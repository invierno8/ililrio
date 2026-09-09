/**
 * מי משאיר את ההערה. אין כאן סיסמאות ואין הרשאות — זה דמו, והשם נועד כדי
 * שיהיה ברור למי שייכת כל הערה. הזהות נשמרת בדפדפן, כך שמעיר חוזר לא נשאל
 * שוב, וכל הערה שלו נושאת אותה.
 */

const KEY = 'jynx.identity.v1';

export function loadIdentity() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.name ? parsed : null;
  } catch {
    return null;
  }
}

export function saveIdentity(identity) {
  try {
    localStorage.setItem(KEY, JSON.stringify(identity));
  } catch {
    /* אחסון חסום — הזהות תחזיק רק לאורך הביקור */
  }
  return identity;
}

export function clearIdentity() {
  try { localStorage.removeItem(KEY); } catch { /* אין מה לעשות */ }
}

export function newIdentity(name, role) {
  return {
    id: 'u-' + Math.random().toString(36).slice(2, 9),
    name: name.trim(),
    role: (role || '').trim(),
  };
}

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[parts.length - 1][0];
}
