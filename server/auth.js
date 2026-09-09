import crypto from 'node:crypto';

/**
 * מי יכול להעיר.
 *
 *  מנהל — Tom ו-ilil, כל אחד עם הסיסמה שלו. רואים הכול, מוחקים הכול,
 *         ומנהלים את רשימת המעירים.
 *  מעיר — רק מי שמנהל הוסיף לרשימה (data/jynx-users.json). מעיר, מגיב,
 *         ועורך או מוחק רק את מה שהוא עצמו כתב.
 *
 * מי שאינו ברשימה פשוט לא נכנס — הוא רואה את הבועה הנעולה. אין "אורח".
 *
 * הסיסמאות של המעירים נשמרות כ-scrypt עם מלח אקראי לכל משתמש, כי הקובץ
 * יושב ברפו ציבורי. של המנהלים כלל לא נשמרות בקובץ — הן משתני סביבה.
 *
 * הסשן הוא מחרוזת חתומה ב-HMAC. אין צורך באחסון סשנים — כדי לאמת אותה נדרש
 * הסוד בלבד, וזה מה שמאפשר לשירות להירדם ולקום בלי שאיש יתנתק.
 */

/**
 * הסיסמאות הזמניות של המנהלים, לפי בקשה, כדי שהכניסה תעבוד מיד אחרי
 * הפריסה. להחלפה בלי לגעת בקוד: JYNX_PASSWORD_TOM / JYNX_PASSWORD_ILIL
 * בלוח הבקרה של השירות.
 */
const ADMINS = {
  tom: process.env.JYNX_PASSWORD_TOM || '2222',
  ilil: process.env.JYNX_PASSWORD_ILIL || '1111',
};

export const ADMIN_NAMES = Object.keys(ADMINS);
export const ADMIN_PASSWORDS_ARE_DEFAULT = !process.env.JYNX_PASSWORD_TOM && !process.env.JYNX_PASSWORD_ILIL;

const SECRET = process.env.JYNX_SESSION_SECRET || '';
const SESSION_DAYS = 30;

export function isAdminName(name) {
  return Object.prototype.hasOwnProperty.call(ADMINS, String(name || '').trim().toLowerCase());
}

export function userIdFor(name) {
  return 'u-' + crypto.createHash('sha256').update(String(name).trim().toLowerCase()).digest('hex').slice(0, 10);
}

// ---- סיסמאות ---------------------------------------------------------------

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 32).toString('hex');
  return { salt, hash };
}

function samePassword(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(expected || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function verifyHashed(password, record) {
  if (!record || !record.salt || !record.hash) return false;
  const given = crypto.scryptSync(String(password || ''), record.salt, 32);
  const known = Buffer.from(record.hash, 'hex');
  if (given.length !== known.length) return false;
  return crypto.timingSafeEqual(given, known);
}

// ---- סשן -------------------------------------------------------------------

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

/**
 * מחזיר { user, token } או { error }. roster הוא רשימת המעירים שהמנהלים
 * הוסיפו — מי שאינו מנהל ואינו שם, אינו נכנס.
 */
export function login(name, password, roster) {
  const clean = String(name || '').trim();
  if (!clean) return { error: 'Name required' };
  if (!SECRET) return { error: 'Service misconfigured: JYNX_SESSION_SECRET is missing' };

  const key = clean.toLowerCase();
  let user;

  if (isAdminName(key)) {
    if (!samePassword(password, ADMINS[key])) return { error: 'Wrong password' };
    user = { id: userIdFor(key), name: clean, isAdmin: true };
  } else {
    const known = roster.find((u) => u.name.trim().toLowerCase() === key);
    if (!known) return { error: 'No Jynx user by that name — ask Tom or ilil to add you' };
    if (!verifyHashed(password, known)) return { error: 'Wrong password' };
    user = { id: known.id, name: known.name, isAdmin: false };
  }

  const token = sign({ ...user, exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000 });
  return { user, token };
}

/** middleware: דורש סשן תקין, ותולה אותו על req.user. */
export function requireUser(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verify(token);
  if (!payload) return res.status(401).json({ error: 'Sign in required' });
  req.user = { id: payload.id, name: payload.name, isAdmin: !!payload.isAdmin };
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admins only' });
  return next();
}
