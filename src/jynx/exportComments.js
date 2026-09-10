import { screenOf, personaOf } from './route.js';
import { groupIdOf, AUTO_JYNX_GROUP, AUTO_JYNX_NAME } from './grouping.js';

/**
 * ייצוא החוט לטבלה.
 *
 * שתי צורות לאותו תוכן: CSV שנפתח באקסל, וטבלת Markdown להעתקה ישירה לצ'אט
 * עם Claude. הכוונה בשנייה מפורשת — לוקחים את הטבלה, נותנים אותה למודל,
 * והוא יודע לתקן לפי מה שכתוב בה. לכן כל שורה נושאת לא רק את ההערה אלא גם
 * לאן היא מכוונת: המסך, שם האלמנט, והנתיב אליו ב-DOM.
 */

const COLUMNS = [
  ['#', (c, i) => String(i + 1)],
  ['Screen', (c) => screenOf(c.route) || ''],
  ['Persona', (c) => personaOf(c) || ''],
  ['Element', (c) => c.targetLabel || ''],
  ['Type', (c) => (c.targetKind === 'text' ? 'text' : 'block')],
  ['Also points at', (c) => (c.secondaryTargets || []).join(' · ')],
  ['Author', (c) => c.authorName || ''],
  ['Date', (c) => (c.createdAt ? new Date(c.createdAt).toLocaleString('en-GB') : '')],
  ['Status', (c) => (c.resolved ? 'done' : 'open')],
  ['Group', (c, i, groupName) => groupName],
  ['Comment', (c) => c.comment || ''],
  ['Replies', (c) => (c.replies || []).map((r) => `${r.authorName}: ${r.body}`).join(' | ')],
  ['Drawing', (c) => (c.drawing ? 'yes' : '')],
  // אחרון, כי הוא לא נועד לקריאה: זה העוגן הפנימי שבו Jynx מוצאת את
  // האלמנט בעמוד. הוא נשאר בטבלה כדי ששום מידע לא ילך לאיבוד.
  ['Anchor', (c) => c.targetPath || ''],
];

/** שם הקבוצה של הערה, בדיוק כפי שהוא מוצג בפאנל. */
function groupNameFor(comment, groups) {
  const id = groupIdOf(comment);
  if (!id) return '';
  if (id === AUTO_JYNX_GROUP) return AUTO_JYNX_NAME;
  return groups.find((g) => g.id === id)?.name || '';
}

export function rowsFor(comments, groups) {
  return comments.map((c, i) => COLUMNS.map(([, read]) => read(c, i, groupNameFor(c, groups))));
}

export const HEADERS = COLUMNS.map(([name]) => name);

/* ---------- CSV ---------- */

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

/**
 * BOM בראש הקובץ: בלעדיו אקסל בווינדוס קורא UTF-8 כלטינית, וכל העברית
 * יוצאת ג'יבריש. שורות מופרדות ב-CRLF מאותה סיבה.
 */
export function toCsv(comments, groups) {
  const lines = [HEADERS, ...rowsFor(comments, groups)].map((row) => row.map(csvCell).join(','));
  return '﻿' + lines.join('\r\n') + '\r\n';
}

/* ---------- Markdown ---------- */

// תא בטבלת Markdown אינו יכול להכיל | או שורה חדשה בלי לשבור אותה.
const mdCell = (v) => String(v).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();

export function toMarkdown(comments, groups, { title = 'RIO demo — Jynx comments' } = {}) {
  const head = `# ${title}\n\n`
    + `${comments.length} comment${comments.length === 1 ? '' : 's'} left on the RIO catalog demo, exported ${new Date().toLocaleString('en-GB')}.\n`
    + 'Each row is one comment: the screen it was left on, the element it points at, and what was said.\n'
    + 'Screen and Element are how to find it; Anchor is Jynx\'s internal DOM index path and can be ignored.\n\n';
  const rows = [HEADERS, HEADERS.map(() => '---'), ...rowsFor(comments, groups)];
  return head + rows.map((row) => `| ${row.map(mdCell).join(' | ')} |`).join('\n') + '\n';
}

/* ---------- הגשה למשתמש ---------- */

export function downloadCsv(comments, groups) {
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([toCsv(comments, groups)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rio-jynx-comments-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // שחרור מיידי היה מבטל את ההורדה בחלק מהדפדפנים.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** מחזיר true אם הטקסט אכן הגיע ללוח. */
export async function copyMarkdown(comments, groups) {
  const text = toMarkdown(comments, groups);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // דפדפן שחוסם את הלוח בלי מחווה ישירה — נופלים לדרך הישנה.
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
