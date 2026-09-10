import { isJynxAuthor } from './JynxSuggestionBadge.jsx';

/**
 * קיבוץ הערות.
 *
 * שני סוגי קבוצות חיים זה לצד זה:
 *
 *  אוטומטית — "Jynx auto suggestions". אינה נשמרת בשום מקום ואינה צריכה
 *              תחזוקה: כל הצעה שהיא משאירה נופלת לתוכה מעצמה, גם כזו שתיכתב
 *              מחר. אם מישהו גורר הצעה כזו לקבוצה משלו, השיוך הידני גובר.
 *
 *  ידנית    — נוצרת בגרירה של הערה אחת על אחרת, מקבלת שם, ונשמרת בשירות.
 *
 * מה שלא שייך לאף אחת מהן מוצג כרגיל, בלי כותרת קבוצה.
 */

export const AUTO_JYNX_GROUP = 'auto:jynx';
export const AUTO_JYNX_NAME = 'Jynx auto suggestions';

/** לאיזו קבוצה שייכת הערה — שיוך ידני גובר על האוטומטי. */
export function groupIdOf(comment) {
  if (comment.groupId) return comment.groupId;
  if (isJynxAuthor(comment)) return AUTO_JYNX_GROUP;
  return null;
}

/**
 * מסדר רשימת הערות לקטעים: קבוצות תחילה (האוטומטית אחרונה מביניהן, כי היא
 * הרקע ולא הדיון), ואחריהן מה שאינו מקובץ. קבוצה ריקה אינה מוצגת.
 */
export function sectionsFor(comments, groups) {
  const byGroup = new Map();
  const loose = [];

  for (const c of comments) {
    const id = groupIdOf(c);
    if (!id) { loose.push(c); continue; }
    if (!byGroup.has(id)) byGroup.set(id, []);
    byGroup.get(id).push(c);
  }

  // מזהה שחוזר פעמיים היה מצייר את אותה קבוצה פעמיים; שומרים על הראשון.
  const named = [];
  const seen = new Set();
  for (const g of groups) {
    if (!byGroup.has(g.id) || seen.has(g.id)) continue;
    seen.add(g.id);
    named.push({ id: g.id, name: g.name, createdBy: g.createdBy, items: byGroup.get(g.id), auto: false });
  }

  const auto = byGroup.has(AUTO_JYNX_GROUP)
    ? [{ id: AUTO_JYNX_GROUP, name: AUTO_JYNX_NAME, items: byGroup.get(AUTO_JYNX_GROUP), auto: true }]
    : [];

  return { sections: [...named, ...auto], loose };
}

/** שם ברירת מחדל לקבוצה חדשה — קצר, ומיד ניתן לעריכה. */
export function defaultGroupName(comments) {
  const label = comments[0]?.targetLabel || '';
  const short = label.replace(/\s+/g, ' ').trim().slice(0, 24);
  return short ? `${short}…` : 'New group';
}
