/**
 * ההערות של חשבון ההתנסות.
 *
 * מי שנכנס עם חשבון הצפייה יכול להעיר בדיוק כמו כולם — ההילה, קופסת ההערה,
 * הנקודות, הפאנל — אבל שום דבר ממה שהוא כותב אינו יוצא מהדפדפן שלו: זה נשמר
 * כאן, ב-localStorage, ואף אחד אחר לא רואה את זה לעולם. השירות ממילא דוחה לו
 * כל בקשה שאינה קריאה, כך שגם אם משהו כאן יישבר, החוט המשותף מוגן.
 *
 * ההערות נשארות בין ביקורים, כי זה מה שהופך את זה למגרש משחקים אמיתי ולא
 * לרושם חולף, ואפשר לנקות אותן בלחיצה מתוך תפריט המשתמש.
 */

const KEY = 'jynx-demo-comments';

export const LOCAL_PREFIX = 'local-';
export const isLocalComment = (c) => !!c && String(c.id || '').startsWith(LOCAL_PREFIX);

export function loadLocalComments() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveLocalComments(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* אחסון חסום */ }
  return list;
}

export function clearLocalComments() {
  try { localStorage.removeItem(KEY); } catch { /* אחסון חסום */ }
  return [];
}

/** אותו מבנה בדיוק כמו הערה מהשירות, כדי שכל השאר לא יצטרך לדעת מהיכן היא. */
export function makeLocalComment(payload, user) {
  return {
    id: LOCAL_PREFIX + Math.random().toString(16).slice(2, 10),
    createdAt: new Date().toISOString(),
    authorId: user?.id || 'u-viewer',
    authorName: user?.name || 'viewer',
    route: payload.route || '',
    routePersona: payload.routePersona || '',
    routeItemId: payload.routeItemId ?? null,
    targetLabel: payload.targetLabel || '',
    targetPath: payload.targetPath || '',
    targetKind: payload.targetKind || 'block',
    secondaryTargets: payload.secondaryTargets || [],
    drawing: payload.drawing || null,
    comment: payload.comment || '',
    groupId: null,
    resolved: false,
    replies: [],
  };
}
