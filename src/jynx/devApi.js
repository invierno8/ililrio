/**
 * הדיבור עם שירות ההערות (server/). זהו המקור היחיד — אין גיבוי בדפדפן:
 * הערה שנכתבת נשמרת אצל כולם, או שלא נשמרת בכלל ואומרים את זה.
 *
 * הכתובת נכנסת בזמן הבנייה דרך VITE_JYNX_API. בלעדיה Jynx נשארת נעולה, כי
 * בלי השירות אין משתמשים ואין חוט משותף.
 */

const BASE = (import.meta.env.VITE_JYNX_API || '').replace(/\/$/, '');
const TOKEN_KEY = 'jynx-session-token';

export const jynxConfigured = !!BASE;

export function readToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* אחסון חסום */ }
}

async function call(path, options = {}) {
  if (!BASE) throw new Error('Jynx service is not configured');
  const token = readToken();
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    writeToken('');
    // הודעת השרת עדיפה כשהיא קיימת: "Wrong password" בכניסה כושלת אינו אותו
    // דבר כמו סשן שפג באמצע עבודה, ולהציג את השני במקום הראשון פשוט מבלבל.
    let message = 'Session expired — sign in again';
    try { message = (await res.json()).error || message; } catch { /* not JSON */ }
    throw Object.assign(new Error(message), { code: 401 });
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try { message = (await res.json()).error || message; } catch { /* not JSON */ }
    throw Object.assign(new Error(message), { code: res.status });
  }
  return res.status === 204 ? null : res.json();
}

/** הסיסמה היא הזהות — שדה אחד, כמו ב-commando. */
export async function jynxLogin(password) {
  const out = await call('/api/jynx/login', { method: 'POST', body: JSON.stringify({ password }) });
  writeToken(out.token);
  return out.user;
}

export function jynxLogout() {
  writeToken('');
}

export async function fetchMe() {
  if (!BASE || !readToken()) return null;
  try {
    return (await call('/api/jynx/me')).user;
  } catch {
    return null;
  }
}

export async function fetchComments() {
  return (await call('/api/jynx/comments')).comments || [];
}

export async function submitAnnotation({ route, routePersona, routeItemId, targetLabel, targetPath, targetKind, comment, secondaryTargets, drawing }) {
  return (await call('/api/jynx/comments', {
    method: 'POST',
    body: JSON.stringify({ route, routePersona, routeItemId, targetLabel, targetPath, targetKind, comment, secondaryTargets, drawing }),
  })).comment;
}

export async function editAnnotation(id, comment) {
  return (await call(`/api/jynx/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ comment }) })).comment;
}

export async function resolveAnnotation(id, resolved) {
  return (await call(`/api/jynx/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ resolved }) })).comment;
}

export async function replyToAnnotation(id, body) {
  return (await call(`/api/jynx/comments/${id}/replies`, { method: 'POST', body: JSON.stringify({ body }) })).comment;
}

export async function deleteAnnotation(id) {
  await call(`/api/jynx/comments/${id}`, { method: 'DELETE' });
}

export async function listUsers() {
  return (await call('/api/jynx/users')).users || [];
}

export async function createUser(name, password) {
  return (await call('/api/jynx/users', { method: 'POST', body: JSON.stringify({ name, password }) })).user;
}

export async function changePassword(id, { currentPassword, newPassword }) {
  return (await call(`/api/jynx/users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })).user;
}

export async function deleteUser(id) {
  await call(`/api/jynx/users/${id}`, { method: 'DELETE' });
}
