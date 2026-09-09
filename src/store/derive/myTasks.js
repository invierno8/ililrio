import { P3_REMINDERS_RAW, P3_DRAFTS_RAW } from '../../data/seeds.js';
import { underlineTabStyle } from './shared.js';

/** המשימות שלי (P3): תזכורות רענון, טיוטות ופריטים שהוחזרו לתיקון. */
export function deriveMyTasks(s, store) {
  const reminderRows = P3_REMINDERS_RAW.filter((r) => !s.reminderClosed[r.id]).map((r) => {
    const item = store.getMergedItem(r.itemId);
    const rowUI = store.getRowUI('reminderTransfer', r.id);
    return {
      id: r.id,
      name: item.name,
      refreshRate: r.refreshRate,
      overdueDate: r.overdueDate,
      onOpen: () => store.openItem(r.itemId, 'my-tasks', 'המשימות שלי'),
      onReviewed: () => store.reminderReviewed(r.id),
      onTransferToggle: () => store.reminderTransferToggle(r.id),
      confirmOpen: !!rowUI.open,
      onTransferCancel: () => store.reminderTransferToggle(r.id),
      onTransferConfirm: () => store.reminderTransferDoConfirm(r.id),
    };
  });

  const draftRows = P3_DRAFTS_RAW.map((d) => ({
    id: d.id,
    name: d.name,
    created: d.created,
    lastSaved: d.lastSaved,
    source: d.source,
    hasMissing: d.missingCount > 0,
    missingCount: d.missingCount,
    nameStyle: { fontSize: '14px', fontWeight: 700 },
    onContinue: () => store.openItemFormNew(),
  }));

  const returnedRowsP3 = s.returnedIds.map((id) => {
    const item = store.getMergedItem(id);
    const note = store.getPendingUI(id).noteText || 'הוחזר לבדיקה חוזרת';
    return {
      id,
      name: item.name,
      onOpen: () => store.openItem(id, 'my-tasks', 'המשימות שלי'),
      returnedBy: item.contact || '—',
      returnDate: item.updated,
      note,
      onContinue: () => store.openItemFormEditPublished(id),
    };
  });

  return {
    isMyTasksScreen: s.activeScreenId === 'my-tasks',
    myTasksTabRemindersStyle: underlineTabStyle(s.myTasksTab === 'reminders'),
    myTasksTabDraftsStyle: underlineTabStyle(s.myTasksTab === 'drafts'),
    myTasksTabReturnedStyle: underlineTabStyle(s.myTasksTab === 'returned'),
    isMyTasksReminders: s.myTasksTab === 'reminders',
    isMyTasksDrafts: s.myTasksTab === 'drafts',
    isMyTasksReturned: s.myTasksTab === 'returned',
    setMyTasksTabReminders: () => store.setMyTasksTab('reminders'),
    setMyTasksTabDrafts: () => store.setMyTasksTab('drafts'),
    setMyTasksTabReturned: () => store.setMyTasksTab('returned'),

    reminderRows,
    remindersEmpty: reminderRows.length === 0,
    draftRows,
    draftsEmpty: draftRows.length === 0,
    returnedRowsP3,
    returnedEmptyP3: returnedRowsP3.length === 0,

    isP3Persona: s.currentPersona === 'P3',
    toggleP3CanPublish: store.toggleP3CanPublish,
    p3AuthLabel: s.p3CanPublish ? 'הדגמה: הרשאת פרסום עצמאי (מופעל)' : 'הדגמה: נדרש אישור בעל פריט (מופעל)',
  };
}
