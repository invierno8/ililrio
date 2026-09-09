import crypto from 'node:crypto';

/**
 * זהות פשוטה, בלי בסיס נתונים. שתי דרגות:
 *
 *  מנהל   — Tom ו-ilil, כל אחד עם הסיסמה שלו. רואים הכול, מוחקים הכול,
 *           ומנהלים את רשימת המשתמשים.
 *  מעיר   — כל אחד אחר. נכנס עם שם, ועם JYNX_REVIEWER_PASSWORD אם הוגדרה.
 *           מעיר, מגיב, ועורך או מוחק רק את מה שהוא עצמו כתב.
 *
 * הסשן הוא מחרוזת חתומה ב-HMAC. אין צורך באחסון סשנים — כדי לאמת אותה נדרש
 * הסוד בלבד, וזה מה שמאפשר לשירות להירדם ולקום בלי שאיש יתנתק.
 */

/**
 * הסיסמאות הזמניות של המנהלים, לפי בקשה, כדי שהכניסה תעבוד מיד אחרי הפריסה.
 * להחלפה בלי לגעת בקוד: מגדירים JYNX_PASSWORD_TOM / JYNX_PASSWORD_ILIL בלוח
 * הבקרה של השירות. הן אינן סוד אמיתי — כשהדמו יוצא מהחוג הקרוב, החליפו אותן.
 */
const ADMINS = {
  tom: process.env.JYNX_PASSWORD_TOM || '2222',
  ilil: process.env.JYNX_PASSWORD_ILIL || '1111',
};

export const ADMIN_NAMES = Object.keys(ADMINS);
export const ADMIN_PASSWORDS_ARE_DEFAULT = !process.env.JYNX_PASSWORD_TOM && !process.env.JYNX_PASSWORD_ILIL;

const SECRET = process.env.JYNX_SESSION_SECRET || '';
const REVIEWER_PASSWORD = process.env.JYNX_REVIEWER_PASSWORD || '';
const SESSION_DAYS = 30;

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const mac = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${mac}`;
}

export function verify(token) {
  if (!token || !SECRET) return null;
  const [body, mac] = String(token).split('.');
  if (!body || !mac) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isAdminName(name) {
  return Object.prototype.hasOwnProperty.call(ADMINS, String(name || '').trim().toLowerCase());
}

/** השוואה בזמן קבוע, כדי שסיסמה לא תידלף לפי כמה זמן לקח לדחות אותה. */
function samePassword(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(expected || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** מחזיר { user, token } או { error }. */
export function login(name, password) {
  const clean = String(name || '').trim();
  if (!clean) return { error: 'צריך שם' };
  if (!SECRET) return { error: 'השירות אינו מוגדר: חסר JYNX_SESSION_SECRET' };

  const key = clean.toLowerCase();
  const admin = isAdminName(key);
  if (admin) {
    if (!samePassword(password, ADMINS[key])) return { error: 'סיסמה שגויה' };
  } else if (REVIEWER_PASSWORD && !samePassword(password, REVIEWER_PASSWORD)) {
    return { error: 'סיסמה שגויה' };
  }

  const user = {
    id: 'u-' + crypto.createHash('sha256').update(key).digest('hex').slice(0, 10),
    name: clean,
    isAdmin: admin,
  };
  const token = sign({ ...user, exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000 });
  return { user, token };
}

/** middleware: דורש סשן תקין, ותולה אותו על req.user. */
export function requireUser(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verify(token);
  if (!payload) return res.status(401).json({ error: 'נדרשת כניסה' });
  req.user = { id: payload.id, name: payload.name, isAdmin: !!payload.isAdmin };
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'למנהלים בלבד' });
  return next();
}
