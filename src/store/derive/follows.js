import { parseDMY } from '../../lib/dates.js';

/** המעקבים שלי: טבלת הבעות העניין של המשתמש, מיון, עריכה והסרה. */
export function deriveFollows(s, store) {
  const followsBase = s.myFollows.map((f) => ({ f, it: store.getItem(f.itemId) }));
  const followComparators = {
    name: (a, b) => a.it.name.localeCompare(b.it.name),
    status: (a, b) => (a.f.removed ? 'הוצא מהקטלוג' : a.it.status).localeCompare(b.f.removed ? 'הוצא מהקטלוג' : b.it.status),
    date: (a, b) => parseDMY(a.f.date) - parseDMY(b.f.date),
  };
  const sortedFollowsBase = store.applySort(followsBase, s.followsSort, followComparators, 'date', 'desc');

  const followRows = sortedFollowsBase.map(({ f, it }) => ({
    id: f.id,
    name: it.name,
    body: it.body,
    date: f.date,
    hasLink: !f.removed,
    noLink: f.removed,
    onOpen: () => store.openItem(it.id, 'my-follows', 'המעקבים שלי'),
    statusLabel: f.removed ? 'הוצא מהקטלוג' : it.status,
    badgeVariant: f.removed ? 'neutral' : it.statusVariant,
    rowWrapStyle: { borderBottom: '1px solid var(--border)', background: s.highlightFollowId === f.id ? 'var(--surface)' : '#fff' },
    showEdit: !f.removed,
    showUpdate: !f.removed,
    onEdit: () => store.startEditFollow(f),
    removeConfirmOpen: s.followRemoveConfirmId === f.id,
    onRemoveClick: () => store.openRemoveFollowConfirm(f.id),
    onRemoveCancel: store.cancelRemoveFollowConfirm,
    onRemoveConfirm: () => store.removeFollow(f.id),
    editOpen: s.followEditingId === f.id,
  }));

  const followsEmpty = s.myFollows.length === 0;

  return {
    followsCountLabel: s.myFollows.length + ' פריטים במעקב',
    followsEmpty,
    followsNotEmpty: !followsEmpty,
    followRows,
    followHeaderNameLabel: 'שם הפריט' + store.sortArrow(s.followsSort, 'name'),
    followHeaderStatusLabel: 'סטטוס' + store.sortArrow(s.followsSort, 'status'),
    followHeaderDateLabel: 'תאריך הבעה' + store.sortArrow(s.followsSort, 'date'),
    followOnSortName: () => store.toggleSort('followsSort', 'name'),
    followOnSortStatus: () => store.toggleSort('followsSort', 'status'),
    followOnSortDate: () => store.toggleSort('followsSort', 'date'),

    followEditForm: s.followEditForm || { phone: '', need: '', classification: '', readyForTrials: false, notes: '' },
    followEditNeedError: s.followEditSubmitAttempted ? s.followEditErrors.need : '',
    followEditClassificationError: s.followEditSubmitAttempted ? s.followEditErrors.classification : '',
    onFollowEditNeedChange: store.onFollowEditNeedChange,
    onFollowEditClassificationChange: store.onFollowEditClassificationChange,
    onFollowEditPhoneChange: store.onFollowEditPhoneChange,
    toggleFollowEditReady: store.toggleFollowEditReady,
    onFollowEditNotesChange: store.onFollowEditNotesChange,
    saveEditFollow: store.saveEditFollow,
    cancelEditFollow: store.cancelEditFollow,
  };
}
