/**
 * התמדה ל-GitHub. שני קבצי JSON ברפו הם מקור האמת: ההערות והמשתמשים.
 * הדיסק של Render חולף — אחרי הרדמה או פריסה מחדש הוא מתאפס — ולכן כל כתיבה
 * הולכת ישר ל-GitHub, ובזיכרון נשמר רק עותק עובד עם ה-sha האחרון.
 */

import fs from 'node:fs';
import path from 'node:path';

const REPO = process.env.GITHUB_REPO || 'invierno8/ililrio';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN = process.env.GITHUB_TOKEN;
const API = 'https://api.github.com';

const shas = new Map();

// הרצה מקומית בלי טוקן: אם הוצבע על תיקיית נתונים, היא מחליפה את GitHub —
// אותם קבצים בדיוק, רק על הדיסק. כך אפשר להריץ ולבדוק את השירות מקומית בלי
// לגעת בחוט האמיתי שברפו.
const DATA_DIR = !TOKEN && process.env.JYNX_DATA_DIR ? process.env.JYNX_DATA_DIR : null;
const localFile = (p) => path.join(DATA_DIR, path.basename(p));

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

export function githubEnabled() {
  return !!TOKEN;
}

/** איפה נשמרים הנתונים בפועל — לשורת הפתיחה של השירות. */
export function storageLabel() {
  if (TOKEN) return 'github';
  if (DATA_DIR) return `local dir ${DATA_DIR}`;
  return 'memory only';
}

export async function readJson(p, fallback) {
  if (DATA_DIR) {
    try { return JSON.parse(fs.readFileSync(localFile(p), 'utf8')); } catch { return fallback; }
  }
  if (!TOKEN) return fallback;
  const res = await fetch(`${API}/repos/${REPO}/contents/${p}?ref=${BRANCH}`, { headers: headers() });
  if (res.status === 404) return fallback;
  if (!res.ok) throw new Error(`github read ${p}: ${res.status}`);
  const body = await res.json();
  shas.set(p, body.sha);
  try {
    return JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'));
  } catch {
    return fallback;
  }
}

export async function writeJson(p, data, message) {
  if (DATA_DIR) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(localFile(p), JSON.stringify(data, null, 2) + '\n', 'utf8');
    return;
  }
  if (!TOKEN) return;
  const content = Buffer.from(JSON.stringify(data, null, 2) + '\n', 'utf8').toString('base64');
  const body = { message, content, branch: BRANCH };
  const known = shas.get(p);
  if (known) body.sha = known;

  let res = await fetch(`${API}/repos/${REPO}/contents/${p}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(body),
  });

  // 409 = מישהו אחר כתב בינתיים. קוראים את ה-sha העדכני ומנסים שוב, פעם אחת.
  if (res.status === 409 || res.status === 422) {
    const current = await fetch(`${API}/repos/${REPO}/contents/${p}?ref=${BRANCH}`, { headers: headers() });
    if (current.ok) {
      const meta = await current.json();
      body.sha = meta.sha;
      res = await fetch(`${API}/repos/${REPO}/contents/${p}`, {
        method: 'PUT', headers: headers(), body: JSON.stringify(body),
      });
    }
  }

  if (!res.ok) throw new Error(`github write ${p}: ${res.status} ${await res.text()}`);
  const saved = await res.json();
  if (saved.content && saved.content.sha) shas.set(p, saved.content.sha);
}
