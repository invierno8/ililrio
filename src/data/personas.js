// ארבע הפרסונות של המערכת והתפריט של כל אחת מהן.
export const PERSONAS = {
  P1: { label: 'צרכן מבצעי', nav: [
    { id: 'catalog', label: 'קטלוג' },
    { id: 'my-follows', label: 'המעקבים שלי' },
    { id: 'notifications', label: 'מרכז התראות' }
  ] },
  P2: { label: 'בעל פריט', nav: [
    { id: 'catalog', label: 'קטלוג' },
    { id: 'my-items', label: 'הפריטים שלי', children: [
      { id: 'who-interested', label: 'הבעות עניין' },
      { id: 'pending-approvals', label: 'ממתין לאישורי' }
    ] },
    { id: 'add-item', label: 'הוספת פריטים', children: [
      { id: 'item-form', label: 'טופס פריט' },
      { id: 'batch-import', label: 'ייבוא אצווה' }
    ] }
  ] },
  P3: { label: 'מזין תוכן', nav: [
    { id: 'catalog', label: 'קטלוג' },
    { id: 'my-tasks', label: 'המשימות שלי' },
    { id: 'add-item', label: 'הוספת פריטים', children: [
      { id: 'item-form', label: 'טופס פריט' },
      { id: 'batch-import', label: 'ייבוא אצווה' }
    ] }
  ] },
  P4: { label: 'מפעיל', nav: [
    { id: 'catalog', label: 'קטלוג' },
    { id: 'users', label: 'משתמשים' },
    { id: 'approvers-group', label: 'קבוצת המאשרים' },
    { id: 'role-transfer', label: 'העברת תפקיד' },
    { id: 'managed-lists', label: 'רשימות מנוהלות', children: [
      { id: 'tags-thesaurus', label: 'אוצר תגיות' }
    ] },
    { id: 'activity-log', label: 'יומן פעולות' },
    { id: 'entry-gate', label: 'שער הכניסה' }
  ] }
};
