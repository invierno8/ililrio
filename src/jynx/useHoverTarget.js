import { useEffect, useRef, useState } from 'react';

/* ==================================================================
   זיהוי המכל שמתחת לסמן — הותאם מ-commando (overlay/useHoverTarget.js).

   שם האות הראשי הוא data-devblock על עטיפות בעלות משמעות. המסכים של RIO הם
   המרה ישירה של אב-הטיפוס ואין בהם תוויות כאלה, ולכן כאן נשאר הגיבוי שהיה
   שם ממילא: מטפסים מהאלמנט הגולמי עד למכל הראשון שהוא flex/grid/טבלה. זה
   מה שגורם להילה "להיצמד" לכרטיס, לשורה או לפאנל במקום להאיר כל <div> מקונן.

   הזהות של הערה — מה שמחזיר אותה לאותו אלמנט אחרי רענון — נשמרת כאן כנתיב
   מבני (targetPath), כי בלי data-devblock אין תווית יציבה להיאחז בה. התווית
   הקריאה (targetLabel) עדיין נשמרת, ומשמשת גם כגיבוי וגם כמה שמוצג לאדם.
   ================================================================== */

const ROOT_SELECTOR = '#root';

/**
 * רמזי מחלקה, בדיוק כמו FALLBACK_CLASS_HINTS ב-commando — שם הרשימה מונה את
 * הפרימיטיבים של אותו פרויקט, וכאן את אלה של מערכת העיצוב שהדמו בנוי ממנה.
 * בלעדיהם ההילה נעצרת על ה-flex הפנימי הראשון: ריחוף מעל כרטיס היה מסמן את
 * גוף הכרטיס בלבד במקום את הכרטיס כולו.
 */
const FALLBACK_CLASS_HINTS = [
  'ht-card', 'ht-btn', 'ht-action', 'ht-search', 'ht-select', 'ht-input', 'ht-check',
  'ht-radio', 'ht-modal', 'ht-drawer', 'ht-toast', 'ht-badge', 'ht-tab', 'ht-crumbs',
  'ht-pager', 'ht-qty', 'ht-spec', 'rio-screen',
];

function hasHintClass(el) {
  const cls = el.className;
  if (typeof cls !== 'string' || !cls) return false;
  const list = cls.split(/\s+/);
  return FALLBACK_CLASS_HINTS.some((c) => list.includes(c));
}

/**
 * פקד מושבת אינו נראה כלל לבדיקת מיקום: מערכת העיצוב נותנת לו
 * pointer-events:none, ולכן elementFromPoint מחזיר את המכל שמאחוריו. אבל
 * כפתור אפור הוא בדיוק מה שרוצים להעיר עליו — "למה זה מושבת?" — ולכן מחפשים
 * אותו לפי הקואורדינטות במקום לסמוך על בדיקת המיקום של הדפדפן.
 */
const DISABLED_CONTROLS = 'button:disabled, input:disabled, select:disabled, textarea:disabled, [aria-disabled="true"]';

export function disabledControlAt(x, y) {
  for (const el of document.querySelectorAll(DISABLED_CONTROLS)) {
    if (el.closest('.jynx-chrome, .dev-overlay-ignore')) continue;
    const r = el.getBoundingClientRect();
    if (r.width && r.height && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return el;
  }
  return null;
}

export function isJynxChrome(el) {
  return !!(el && el.closest && el.closest('.jynx-chrome'));
}

/** תגיות שהתוכן שלהן הוא טקסט זורם, גם כשיש בפנים הדגשה או קישור. */
const INLINE_TAGS = new Set(['SPAN', 'B', 'I', 'EM', 'STRONG', 'SMALL', 'BDI', 'BDO', 'BR', 'A', 'CODE', 'MARK', 'SUP', 'SUB', 'U', 'S', 'ABBR', 'TIME']);
const NEVER_TEXT_TARGET = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTION', 'LABEL', 'SVG', 'PATH']);

/**
 * פריט תוכן: אלמנט שמה שיש בו הוא טקסט — כותרת, פסקה, תא בטבלה, שורת ערך —
 * ולא מכל של אלמנטים אחרים. עליו אפשר להעיר על הניסוח עצמו, בנפרד מהכרטיס
 * שמסביבו.
 *
 * פקדים אינם נחשבים טקסט: כפתור או שדה הם דבר שלוחצים עליו, וההערה עליהם
 * שייכת לפקד כולו — ולכן הם נתפסים במעבר של רמזי המחלקות, לא כאן.
 */
export function isTextTarget(el) {
  if (!el || el.nodeType !== 1) return false;
  if (NEVER_TEXT_TARGET.has(el.tagName)) return false;
  if (el.closest('button, a, input, select, textarea, label')) return false;
  const text = (el.textContent || '').trim();
  if (!text) return false;
  // כל צאצא חייב להיות טקסט או הדגשה — אחרת זה מכל, לא פריט תוכן.
  for (const child of el.children) {
    if (!INLINE_TAGS.has(child.tagName)) return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 8 && rect.height > 8;
}

/** האם היעד הוא טקסט או מכל — נשמר עם ההערה ומוצג על ההילה. */
export function kindForElement(el) {
  return isTextTarget(el) ? 'text' : 'block';
}

export function findTarget(el, preferBlock = false) {
  let node = el;
  while (node && node !== document.body) {
    if (node.dataset && node.dataset.devblock) return node;
    node = node.parentElement;
  }
  // טקסט שמתחת לסמן מנצח: מי שמצביע על משפט מתכוון להעיר על המשפט, לא על
  // הכרטיס שמסביבו. אם הצומת עצמו אינו טקסט אבל האב הישיר כן (למשל ריחוף על
  // <b> בתוך פסקה), עולים צעד אחד — לא יותר, כדי לא לבלוע את המכל.
  //
  // preferBlock (Shift מוחזק) מדלג על הכלל הזה: כמעט כל פינה בעמוד מכילה
  // טקסט כלשהו, ובלי דרך לוותר עליו אי אפשר היה להעיר על כרטיס שלם.
  // פקד מושבת הוא היעד עצמו: אין טעם לתפוס את המילה שבתוכו.
  if (el && el.matches && el.matches(DISABLED_CONTROLS)) return el;

  // כל פקד הוא יעד בפני עצמו, גם בלי מחלקה של מערכת העיצוב. בלי הכלל הזה
  // כפתור שמעוצב ב-style ישיר — כמו מחליף רשת/רשימה בקטלוג — לא נתפס, וההילה
  // מטפסת עד שורת הכלים כולה במקום לסמן את הכפתור שמצביעים עליו.
  const control = el && el.closest && el.closest('button, a[href], [role="button"], input, select, textarea');
  if (control && !control.closest('.jynx-chrome')) return control;

  if (!preferBlock) {
    if (isTextTarget(el)) return el;
    if (el && el.parentElement && isTextTarget(el.parentElement)) return el.parentElement;
  }

  // מעבר נפרד: רכיב של מערכת העיצוב מנצח כל flex פנימי שבדרך אליו.
  node = el;
  while (node && node !== document.body) {
    if (hasHintClass(node)) return node;
    node = node.parentElement;
  }
  node = el;
  while (node && node !== document.body) {
    const display = window.getComputedStyle(node).display;
    const rect = node.getBoundingClientRect();
    const boxy = display === 'flex' || display === 'grid' || display === 'table'
      || node.tagName === 'TR' || node.tagName === 'TABLE' || node.tagName === 'ASIDE';
    if (boxy && rect.width > 24 && rect.height > 16) return node;
    node = node.parentElement;
  }
  return el; // שום דבר "מעניין" יותר בדרך — עדיף האלמנט הגולמי מכלום
}

export function labelForElement(el) {
  if (!el) return '?';
  if (el.dataset && el.dataset.devblock) return el.dataset.devblock;
  const text = (el.innerText || '').trim().replace(/\s+/g, ' ');
  if (text) return text.length > 60 ? text.slice(0, 60) + '…' : text;
  const cls = typeof el.className === 'string' ? el.className.split(/\s+/).find(Boolean) : null;
  return cls || (el.tagName ? el.tagName.toLowerCase() : '?');
}

/** נתיב מבני מהשורש: "2/0/5/1" — האינדקס של כל צומת בין אחיו. */
export function pathForElement(el) {
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root || !el || !root.contains(el)) return '';
  const parts = [];
  let node = el;
  while (node && node !== root) {
    const parent = node.parentElement;
    if (!parent) break;
    parts.unshift(Array.prototype.indexOf.call(parent.children, node));
    node = parent;
  }
  return parts.join('/');
}

function elementForPath(path) {
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root || !path) return null;
  let node = root;
  for (const part of path.split('/')) {
    const i = Number(part);
    if (!node.children || !node.children[i]) return null;
    node = node.children[i];
  }
  return node;
}

/**
 * מאתר את האלמנט של הערה קיימת: קודם לפי הנתיב, ואם המבנה זז — לפי התווית.
 * מחזיר null כשההערה כבר לא שייכת למה שמוצג עכשיו.
 */
export function elementForComment(comment) {
  if (!comment) return null;
  const byPath = elementForPath(comment.targetPath);
  if (byPath && labelForElement(byPath) === comment.targetLabel) return byPath;

  const root = document.querySelector(ROOT_SELECTOR);
  if (root && comment.targetLabel) {
    const wanted = comment.targetLabel.replace(/…$/, '');
    for (const el of root.querySelectorAll('*')) {
      if (isJynxChrome(el)) continue;
      if (labelForElement(el).replace(/…$/, '') === wanted) return el;
    }
  }
  return byPath;
}

export function useHoverTarget(active, allowJynxChrome, preferBlock = false) {
  const [target, setTarget] = useState(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setTarget(null);
      return undefined;
    }
    function onMove(e) {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = disabledControlAt(e.clientX, e.clientY) || document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el.closest('.dev-overlay-ignore')) {
          setTarget(null);
          return;
        }
        if (el.closest('.jynx-chrome') && !allowJynxChrome) {
          setTarget(null);
          return;
        }
        setTarget(findTarget(el, preferBlock));
      });
    }
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      // חייבים גם לאפס את ה-ref, לא רק לבטל את ה-frame: ה-guard ב-onMove
      // מתייחס לכל ערך שאינו null כ"כבר יש frame ממתין", כך ש-ref שבוטל אבל
      // לא אופס חוסם לתמיד כל frame עתידי אחרי הרשמה מחדש.
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, allowJynxChrome, preferBlock]);

  return target;
}
