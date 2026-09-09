/**
 * באב-הטיפוס המקורי, style שנכתב על רכיב מיובא (x-import) לא הגיע לרכיב עצמו:
 * מנוע קנבס העיצוב הסיר אותו, והשאיר ממנו רק את מאפייני המיקום — על עטיפה
 * חיצונית. כל שאר ההצהרות (צבע, גבול וכדומה) פשוט לא נכנסו לתוקף.
 *
 * הפונקציה משחזרת בדיוק את ההתנהגות הזו, כדי שהדמו ייראה כמו המקור. אם תרצו
 * שהסגנון כן ישפיע — העבירו אותו ישירות כ-style לרכיב במקום לקרוא לפונקציה.
 */
const HOST_STYLE_PROPS = new Set([
  'position', 'left', 'right', 'top', 'bottom', 'inset',
  'width', 'height', 'z-index', 'transform',
]);

export function hostPositionStyle(style) {
  if (!style || typeof style !== 'object') return { display: 'contents' };
  const out = {};
  for (const [k, v] of Object.entries(style)) {
    const kebab = k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    if (HOST_STYLE_PROPS.has(kebab)) out[k] = v;
  }
  return Object.keys(out).length ? out : { display: 'contents' };
}
