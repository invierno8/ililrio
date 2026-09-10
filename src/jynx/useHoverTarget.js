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

export function isJynxChrome(el) {
  return !!(el && el.closest && el.closest('.jynx-chrome'));
}

export function findTarget(el) {
  let node = el;
  while (node && node !== document.body) {
    if (node.dataset && node.dataset.devblock) return node;
    node = node.parentElement;
  }
  // מעבר שני, נפרד: רכיב של מערכת העיצוב מנצח כל flex פנימי שבדרך אליו.
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

export function useHoverTarget(active, allowJynxChrome) {
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
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el.closest('.dev-overlay-ignore')) {
          setTarget(null);
          return;
        }
        if (el.closest('.jynx-chrome') && !allowJynxChrome) {
          setTarget(null);
          return;
        }
        setTarget(findTarget(el));
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
  }, [active, allowJynxChrome]);

  return target;
}
