/**
 * עוגן של הערה — איך הערה נשארת קשורה לאותו אלמנט גם אחרי רענון.
 *
 * ב-commando כל אלמנט מעניין נושא data-devblock, וההערה נשמרת לפי התווית הזו.
 * המסכים של RIO הם המרה ישירה של אב-הטיפוס ואין בהם תוויות כאלה, ולכן העוגן
 * נבנה כאן מהמבנה עצמו: נתיב של אינדקסים מהשורש עד האלמנט, ולצדו תווית קריאה
 * (הטקסט הראשון שבתוכו) שמשמשת גיבוי אם המבנה זז.
 */

const ROOT_SELECTOR = '#root';

/** האם האלמנט שייך ל-Jynx עצמה? על עצמה היא לא מגיבה. */
export function isJynxChrome(el) {
  return !!(el && el.closest && el.closest('.jynx-root'));
}

/** מטפסים מהאלמנט הגולמי אל מכל בעל משמעות — כרטיס, שורה, פאנל. */
export function findTarget(el) {
  let node = el;
  while (node && node !== document.body) {
    if (node.dataset && node.dataset.jynxBlock) return node;
    node = node.parentElement;
  }
  node = el;
  while (node && node !== document.body) {
    const cs = window.getComputedStyle(node);
    const r = node.getBoundingClientRect();
    // מכל אמיתי: פריסת flex/grid, או כל דבר עם גבול/רקע משלו בגודל סביר.
    const boxy = cs.display === 'flex' || cs.display === 'grid' || cs.display === 'table'
      || node.tagName === 'TR' || node.tagName === 'TABLE' || node.tagName === 'ASIDE';
    if (boxy && r.width > 24 && r.height > 16) return node;
    node = node.parentElement;
  }
  return el;
}

/** תווית קריאה לאדם: תווית מפורשת, אחרת הטקסט שבתוך האלמנט, אחרת שם התגית. */
export function labelForElement(el) {
  if (!el) return '?';
  if (el.dataset && el.dataset.jynxBlock) return el.dataset.jynxBlock;
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

/** ההפך: מנתיב חזרה לאלמנט, אם הוא עדיין שם. */
export function elementForPath(path) {
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

export function anchorFor(el) {
  return { path: pathForElement(el), label: labelForElement(el), tag: el && el.tagName ? el.tagName.toLowerCase() : '' };
}

/**
 * מאתר את האלמנט של עוגן קיים. קודם לפי הנתיב; אם המבנה זז, מחפש אלמנט עם
 * אותה תווית. מחזיר null אם ההערה כבר לא שייכת למה שמוצג עכשיו.
 */
export function resolveAnchor(anchor) {
  if (!anchor) return null;
  const byPath = elementForPath(anchor.path);
  if (byPath && labelForElement(byPath) === anchor.label) return byPath;
  if (byPath && !anchor.label) return byPath;

  const root = document.querySelector(ROOT_SELECTOR);
  if (!root || !anchor.label) return byPath;
  const wanted = anchor.label.replace(/…$/, '');
  const candidates = root.querySelectorAll(anchor.tag || '*');
  for (const el of candidates) {
    if (isJynxChrome(el)) continue;
    if (labelForElement(el).replace(/…$/, '') === wanted) return el;
  }
  return byPath;
}
