import { isJynxAuthor } from './JynxSuggestionBadge.jsx';

/**
 * איך מסודרות ההערות בפאנל.
 *
 * הסידור הוא מתג גלוי בראש הפאנל, ולא משהו שקורה מאליו, כי הוא שייך למי
 * שקורא ולא למי שכתב:
 *
 *   none   — רשימה אחת, החדשה למעלה. זה הסידור המקורי.
 *   groups — הקבוצות שהמשתמש עשה בעצמו, בגרירת הערה על אחרת. ההצעות של
 *            Jynx נאספות כאן לקבוצה משלהן ("Jynx auto suggestions") שאינה
 *            נשמרת בשום מקום: כל הצעה חדשה שלה נופלת פנימה לבד. שיוך ידני
 *            גובר עליה — הערה שנגררה לקבוצה משלכם נשארת שם.
 *   user   — קטע לכל כותב. אינו נשמר ואינו ניתן לעריכה; זו תצוגה בלבד,
 *            וכיבוי המתג מחזיר את הסידור הקודם בדיוק כפי שהיה.
 *
 * לכל קטע יש kind, ולפיו יודעים מה מותר בו: 'manual' אפשר לשנות שם ולפרק,
 * 'auto' ו-'user' רק לפתוח, לסגור ולסנן.
 */

export const AUTO_JYNX_GROUP = 'auto:jynx';
export const AUTO_JYNX_NAME = 'Jynx auto suggestions';

/** שם ההתחלה של קבוצה חדשה — קצר, כי מקלידים עליו מיד. */
export const NEW_GROUP_NAME = 'New group';

export const ARRANGEMENTS = [
  { id: 'none', label: 'None' },
  { id: 'groups', label: 'Groups' },
  { id: 'user', label: 'User' },
];

/** לאיזו קבוצה שייכת הערה בסידור הקבוצות — שיוך ידני גובר על האוטומטי. */
export function groupIdOf(comment) {
  if (comment.groupId) return comment.groupId;
  if (isJynxAuthor(comment)) return AUTO_JYNX_GROUP;
  return null;
}

const bucket = (map, key, item) => {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(item);
};

/**
 * מסדר רשימת הערות לקטעים ולמה שנשאר מחוץ להם. קטע ריק אינו מוצג, ולכן
 * אין קבוצות רפאים אחרי סינון.
 */
export function sectionsFor(comments, groups, arrangement = 'groups') {
  if (arrangement === 'none') return { sections: [], loose: comments };

  if (arrangement === 'user') {
    const byAuthor = new Map();
    for (const c of comments) bucket(byAuthor, c.authorName || 'Unknown', c);
    const sections = [...byAuthor.entries()]
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .map(([name, items]) => ({ id: `user:${name}`, name, items, kind: 'user', author: name }));
    return { sections, loose: [] };
  }

  const byGroup = new Map();
  const loose = [];
  for (const c of comments) {
    const id = groupIdOf(c);
    if (id) bucket(byGroup, id, c);
    else loose.push(c);
  }

  // מזהה שחוזר פעמיים היה מצייר את אותה קבוצה פעמיים; שומרים על הראשון.
  const named = [];
  const seen = new Set();
  for (const g of groups) {
    if (!byGroup.has(g.id) || seen.has(g.id)) continue;
    seen.add(g.id);
    named.push({ id: g.id, name: g.name, createdBy: g.createdBy, items: byGroup.get(g.id), kind: 'manual' });
  }

  // האוטומטית אחרונה מבין הקבוצות: היא הרקע, לא הדיון.
  const auto = byGroup.has(AUTO_JYNX_GROUP)
    ? [{ id: AUTO_JYNX_GROUP, name: AUTO_JYNX_NAME, items: byGroup.get(AUTO_JYNX_GROUP), kind: 'auto' }]
    : [];

  return { sections: [...named, ...auto], loose };
}
