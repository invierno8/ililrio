/**
 * איפה נכתבה הערה.
 *
 * בהתחלה שמרתי את המיקום כ-"P2:catalog" — הפרסונה ואחריה המסך — וזו הייתה
 * טעות: הפרסונה היא מי שאתה מתחזה אליו, לא איפה אתה. הערה על הקטלוג היא על
 * הקטלוג, גם אם נכתבה בזמן שהיו מחוברים כבעל פריט וקוראים אותה כצרכן מבצעי.
 * התוצאה בפועל הייתה שכל מי שנכנס והתחיל ב-P1 לא ראה שום הערה שנכתבה ב-P2.
 *
 * לכן המיקום הוא מזהה המסך בלבד, והפרסונה נשמרת לצדו כמידע (מוצג כתווית).
 * הפונקציות כאן סובלניות לפורמט הישן, כדי שהערות שכבר נכתבו יימצאו גם הן.
 */

const LEGACY_PREFIX = /^P\d+:/i;

/** מזהה המסך, בלי קידומת הפרסונה של הפורמט הישן. */
export function screenOf(route) {
  return String(route || '').replace(LEGACY_PREFIX, '');
}

/** הפרסונה שנשמרה בפורמט הישן, אם הייתה. */
export function legacyPersonaOf(route) {
  const m = String(route || '').match(LEGACY_PREFIX);
  return m ? m[0].slice(0, -1).toUpperCase() : '';
}

/** האם ההערה שייכת למסך שמוצג כרגע? */
export function sameScreen(route, currentRoute) {
  return screenOf(route) === screenOf(currentRoute);
}

/** הפרסונה שבה נכתבה ההערה — מהשדה החדש, ואם אין, מהקידומת הישנה. */
export function personaOf(comment) {
  return comment.routePersona || legacyPersonaOf(comment.route);
}
