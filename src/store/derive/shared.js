import { CLASSIFICATION_VALUES } from '../../data/taxonomy.js';
import { PENDING_APPROVALS_RAW } from '../../data/seeds.js';

/**
 * סגנונות וערכים שחוזרים בכמה מסכים. הם אינם תלויים במצב, ולכן מוגדרים פעם אחת
 * ומשותפים לכל הנגזרות.
 */

export const toOpts = (arr) => arr.map((v) => ({ value: v, label: v }));

export const classificationOptions = toOpts(CLASSIFICATION_VALUES);

export const controlBtnBase = { height: '40px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: '7px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer' };

export const thStyle = { textAlign: 'right', padding: '10px 14px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' };
export const bodyPillSmallStyle = { display: 'inline-block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--surface)', borderRadius: '4px', padding: '2px 8px' };

export const textareaStyle = { width: '100%', minHeight: '68px', border: '1px solid var(--tw-slate-300)', borderRadius: 'var(--radius-field)', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' };
export const textareaTallStyle = { ...textareaStyle, minHeight: '110px' };
export const inputPlainStyle = { width: '100%', height: '36px', border: '1px solid var(--tw-slate-300)', borderRadius: 'var(--radius-field)', padding: '0 10px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' };
export const fieldErrorStyle = { fontSize: '12px', color: 'var(--tw-red-600)', marginTop: '5px' };

export const dangerBtnStyle = { color: 'var(--tw-red-600)', borderColor: 'var(--tw-red-200)' };
export const dangerFilledBtnStyle = { color: '#fff', background: 'var(--tw-red-600)', borderColor: 'var(--tw-red-600)' };

export const chipBase = { display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)', borderRadius: '9999px', padding: '5px 6px 5px 14px', fontSize: '12px', background: 'var(--surface)' };
export const chipRemoveBtnStyle = { width: '16px', height: '16px', borderRadius: '50%', border: 'none', background: 'var(--tw-gray-200)', cursor: 'pointer', fontSize: '10px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };

export const clearAllStyle = { fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'underline', padding: '4px 0' };
export const emptyRemoveChipStyle = { fontSize: '12px', padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' };

/** לשונית עם קו תחתון — התבנית של "הפריטים שלי", "הוספת פריטים" ו"המשימות שלי". */
export const underlineTabStyle = (on, padding = '12px 4px') => ({
  padding,
  fontSize: '13.5px',
  fontWeight: on ? 700 : 500,
  color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
  borderBottom: on ? '2px solid var(--tw-neutral-900)' : '2px solid transparent',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  fontFamily: 'var(--font-body)',
});

/** כמה פריטים עדיין ממתינים לאישור — מוצג גם כתג בתפריט וגם בלשונית. */
export const pendingApprovalsCount = (s) =>
  PENDING_APPROVALS_RAW.filter((p) => !s.approvedIds.includes(p.id) && !s.returnedIds.includes(p.id)).length;

export const sharedVals = {
  thStyle,
  bodyPillSmallStyle,
  textareaStyle,
  textareaTallStyle,
  inputPlainStyle,
  fieldErrorStyle,
  dangerBtnStyle,
  dangerFilledBtnStyle,
  classificationOptions,
  clearAllStyle,
  emptyRemoveChipStyle,
  noop: () => {},
};
