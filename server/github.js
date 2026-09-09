/**
 * התמדה ל-GitHub. שני קבצי JSON ברפו הם מקור האמת: ההערות והמשתמשים.
 * הדיסק של Render חולף — אחרי הרדמה או פריסה מחדש הוא מתאפס — ולכן כל כתיבה
 * הולכת ישר ל-GitHub, ובזיכרון נשמר רק עותק עובד עם ה-sha האחרון.
 */

const REPO = process.env.GITHUB_REPO || 'invierno8/ililrio';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN = process.env.GITHUB_TOKEN;
const API = 'https://api.github.com';

const shas = new Map();

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

export async function readJson(path, fallback) {
  if (!TOKEN) return fallback;
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: headers() });
  if (res.status === 404) return fallback;
  if (!res.ok) throw new Error(`github read ${path}: ${res.status}`);
  const body = await res.json();
  shas.set(path, body.sha);
  try {
    return JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'));
  } catch {
    return fallback;
  }
}

export async function writeJson(path, data, message) {
  if (!TOKEN) return;
  const content = Buffer.from(JSON.stringify(data, null, 2) + '\n', 'utf8').toString('base64');
  const body = { message, content, branch: BRANCH };
  const known = shas.get(path);
  if (known) body.sha = known;

  let res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(body),
  });

  // 409 = מישהו אחר כתב בינתיים. קוראים את ה-sha העדכני ומנסים שוב, פעם אחת.
  if (res.status === 409 || res.status === 422) {
    const current = await fetch(`${API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: headers() });
    if (current.ok) {
      const meta = await current.json();
      body.sha = meta.sha;
      res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
        method: 'PUT', headers: headers(), body: JSON.stringify(body),
      });
    }
  }

  if (!res.ok) throw new Error(`github write ${path}: ${res.status} ${await res.text()}`);
  const saved = await res.json();
  if (saved.content && saved.content.sha) shas.set(path, saved.content.sha);
}
