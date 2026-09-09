/**
 * הדיבור עם שירות ההערות.
 *
 * הכתובת נקבעת בזמן הבנייה דרך VITE_JYNX_API. כשהיא מוגדרת, כל ההערות חיות
 * בחוט אחד משותף: כולם נכנסים עם שם, כולם רואים את אותן הערות, והשירות דוחף
 * כל שינוי ל-data/jynx-comments.json ברפו.
 *
 * אין דרך לדחוף לרפו ישירות מהדפדפן בלי להטמיע בו טוקן, וטוקן בדף ציבורי הוא
 * טוקן גנוב — לכן השירות. כל עוד לא הוגדרה כתובת, Jynx עובדת במצב מקומי:
 * ההערות נשמרות בדפדפן של המעיר בלבד, וה-UI אומר את זה במפורש.
 */

const BASE = (import.meta.env.VITE_JYNX_API || '').replace(/\/$/, '');
const TOKEN_KEY = 'jynx.token.v1';
const LOCAL_KEY = 'jynx.comments.v1';
const LOCAL_USER_KEY = 'jynx.local-user.v1';

export const isShared = !!BASE;

// ---- סשן -------------------------------------------------------------------

export function readToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
function writeToken(token) {
  try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY); } catch { /* אחסון חסום */ }
}

async function call(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(readToken() ? { Authorization: `Bearer ${readToken()}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) { writeToken(''); throw Object.assign(new Error('נדרשת כניסה'), { code: 401 }); }
  if (!res.ok) {
    let message = `שגיאה ${res.status}`;
    try { message = (await res.json()).error || message; } catch { /* גוף שאינו JSON */ }
    throw Object.assign(new Error(message), { code: res.status });
  }
  return res.status === 204 ? null : res.json();
}

// ---- מצב מקומי -------------------------------------------------------------

function readLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
    return Array.isArray(parsed && parsed.comments) ? parsed.comments : [];
  } catch { return []; }
}
function writeLocal(comments) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify({ version: 1, comments })); } catch { /* אחסון חסום */ }
}

const local = {
  async login(name) {
    const user = { id: 'u-local-' + name.trim().toLowerCase().replace(/\s+/g, '-'), name: name.trim(), isAdmin: true };
    try { localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user)); } catch { /* אחסון חסום */ }
    return { user };
  },
  async me() {
    try {
      const user = JSON.parse(localStorage.getItem(LOCAL_USER_KEY) || 'null');
      return user && user.name ? { user } : null;
    } catch { return null; }
  },
  async logout() { try { localStorage.removeItem(LOCAL_USER_KEY); } catch { /* אחסון חסום */ } },
  async list() { return readLocal(); },
  async create(comment) { const all = readLocal(); all.push(comment); writeLocal(all); return comment; },
  async update(id, patch) {
    const all = readLocal().map((c) => {
      if (c.id !== id) return c;
      const next = { ...c };
      if (Array.isArray(patch.replies)) next.replies = patch.replies;
      if (typeof patch.resolved === 'boolean') next.resolved = patch.resolved;
      if (typeof patch.body === 'string') next.body = patch.body;
      return next;
    });
    writeLocal(all);
    return all.find((c) => c.id === id) || null;
  },
  async remove(id) { writeLocal(readLocal().filter((c) => c.id !== id)); },
  async users() { return []; },
};

// ---- השירות המשותף ---------------------------------------------------------

const shared = {
  async login(name, password) {
    const out = await call('/api/jynx/login', { method: 'POST', body: JSON.stringify({ name, password }) });
    writeToken(out.token);
    return { user: out.user };
  },
  async me() {
    if (!readToken()) return null;
    try { return await call('/api/jynx/me'); } catch { return null; }
  },
  async logout() { writeToken(''); },
  async list() { return (await call('/api/jynx/comments')).comments || []; },
  async create(comment) { return (await call('/api/jynx/comments', { method: 'POST', body: JSON.stringify(comment) })).comment; },
  async update(id, patch) { return (await call(`/api/jynx/comments/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })).comment; },
  async remove(id) { await call(`/api/jynx/comments/${id}`, { method: 'DELETE' }); },
  async users() { return (await call('/api/jynx/users')).users || []; },
};

export const api = isShared ? shared : local;
