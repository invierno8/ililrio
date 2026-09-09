import { MY_ITEMS_IDS, PENDING_APPROVALS_RAW, getWhoInterested } from '../../data/seeds.js';
import { parseDMY } from '../../lib/dates.js';
import { underlineTabStyle, pendingApprovalsCount } from './shared.js';

/** הפריטים שלי (P2): רשימת הפריטים, הבעות העניין וממתינים לאישור. */
export function deriveMyItems(s, store) {
  const isMyItemsScreen = s.activeScreenId === 'my-items';
  const isAddItemScreen = s.activeScreenId === 'add-item';
  const isMyItemsInterestTab = isMyItemsScreen && s.activeMyItemsTab === 'interest';
  const pendingCount = pendingApprovalsCount(s);

  // --- לשונית הפריטים ---
  const myItemsComparators = {
    name: (a, b) => a.name.localeCompare(b.name),
    status: (a, b) => a.status.localeCompare(b.status),
    updated: (a, b) => parseDMY(a.updated) - parseDMY(b.updated),
  };
  const myItemsSource = MY_ITEMS_IDS.map((id) => store.getMergedItem(id));
  const myItemsRows = store.applySort(myItemsSource, s.myItemsSort, myItemsComparators, 'name', 'asc').map((it) => ({
    name: it.name, body: it.body, status: it.status, updated: it.updated, statusVariant: it.statusVariant,
    reminderOverdue: !!it.reminderOverdue, interestedCount: it.interestedCount,
    onOpen: () => store.openItem(it.id, 'my-items', 'הפריטים שלי', 'p2-own'),
    onWhoInterested: () => store.openWhoInterested(it.id),
  }));

  // --- לשונית הבעות העניין ---
  const interestedItemsListSource = MY_ITEMS_IDS.map((id) => store.getMergedItem(id)).filter((it) => it.interestedCount > 0);
  const interestedItemsList = store.applySort(
    interestedItemsListSource,
    s.interestListSort,
    {
      name: (a, b) => a.name.localeCompare(b.name),
      status: (a, b) => a.status.localeCompare(b.status),
      interestedCount: (a, b) => a.interestedCount - b.interestedCount,
    },
    'interestedCount',
    'desc',
  ).map((it) => ({ name: it.name, status: it.status, statusVariant: it.statusVariant, interestedCount: it.interestedCount, onOpen: () => store.openWhoInterested(it.id) }));

  const whoItem = store.getMergedItem(s.whoInterestedItemId != null ? s.whoInterestedItemId : MY_ITEMS_IDS[0]);
  const whoData = getWhoInterested(whoItem);
  const whoPeopleFiltered = s.whoReadyOnly ? whoData.people.filter((p) => p.ready) : whoData.people;
  const whoRows = whoPeopleFiltered.map((p, i) => ({
    name: p.name, role: p.role, unit: p.unit, date: p.date, email: p.email, mailto: 'mailto:' + p.email, ready: p.ready, need: p.need,
    needExpanded: !!s.whoNeedExpanded[i],
    onToggleNeed: () => store.toggleWhoNeed(i),
  }));

  // --- לשונית הממתינים לאישור ---
  const pendingSource = PENDING_APPROVALS_RAW.filter((p) => !s.approvedIds.includes(p.id) && !s.returnedIds.includes(p.id));
  const pendingRowsRaw = pendingSource.map((p) => {
    const it = store.getMergedItem(p.id);
    const ui = store.getPendingUI(p.id);
    return {
      id: p.id, name: it.name, submitter: p.submitter, date: p.date, waitingDays: p.waitingDays,
      waitingLabel: 'ממתין ' + p.waitingDays + ' ימים', warn: p.waitingDays > 7,
      confirmOpen: ui.confirmOpen, noteOpen: ui.noteOpen, noteText: ui.noteText, noteError: ui.noteError,
      onPreview: () => store.openItem(p.id, 'my-items', 'הפריטים שלי', 'p2-pending-preview', 'pending'),
      onReturnToggle: () => store.pendingNoteToggle(p.id),
      onApproveClick: () => store.pendingApproveClick(p.id),
      onApproveCancel: () => store.pendingApproveCancel(p.id),
      onApproveConfirm: () => store.pendingApproveConfirm(p.id),
      onNoteChange: (e) => store.pendingSetNoteText(p.id, e.target.value),
      onNoteSubmit: () => store.pendingSubmitReturn(p.id),
    };
  });
  const pendingRows = store.applySort(
    pendingRowsRaw,
    s.pendingSort,
    { name: (a, b) => a.name.localeCompare(b.name), submitter: (a, b) => a.submitter.localeCompare(b.submitter), date: (a, b) => parseDMY(a.date) - parseDMY(b.date) },
    'date',
    'desc',
  );

  return {
    isMyItemsScreen,
    isAddItemScreen,
    isMyItemsItemsTab: isMyItemsScreen && s.activeMyItemsTab === 'items',
    isMyItemsInterestTab,
    isMyItemsPendingTab: isMyItemsScreen && s.activeMyItemsTab === 'pending',
    myItemsTabItemsStyle: underlineTabStyle(s.activeMyItemsTab === 'items'),
    myItemsTabInterestStyle: underlineTabStyle(s.activeMyItemsTab === 'interest'),
    myItemsTabPendingStyle: underlineTabStyle(s.activeMyItemsTab === 'pending'),
    pendingCountSuffix: pendingCount > 0 ? ' (' + pendingCount + ')' : '',
    setMyItemsTabItems: () => store.setMyItemsTab('items'),
    setMyItemsTabInterest: () => store.setMyItemsTab('interest'),
    setMyItemsTabPending: () => store.setMyItemsTab('pending'),

    myItemsRows,
    myItemsEmpty: myItemsRows.length === 0,
    myItemsCountLabel: myItemsRows.length + ' פריטים משויכים אליך',
    myItemsHeaderNameLabel: 'שם הפריט' + store.sortArrow(s.myItemsSort, 'name'),
    myItemsHeaderStatusLabel: 'סטטוס' + store.sortArrow(s.myItemsSort, 'status'),
    myItemsHeaderUpdatedLabel: 'עודכן' + store.sortArrow(s.myItemsSort, 'updated'),
    myItemsOnSortName: () => store.toggleSort('myItemsSort', 'name'),
    myItemsOnSortStatus: () => store.toggleSort('myItemsSort', 'status'),
    myItemsOnSortUpdated: () => store.toggleSort('myItemsSort', 'updated'),

    interestedItemsList,
    interestedItemsListEmpty: interestedItemsList.length === 0,
    interestListHeaderNameLabel: 'שם הפריט' + store.sortArrow(s.interestListSort, 'name'),
    interestListHeaderStatusLabel: 'סטטוס' + store.sortArrow(s.interestListSort, 'status'),
    interestListHeaderCountLabel: 'מתעניינים' + store.sortArrow(s.interestListSort, 'interestedCount'),
    interestListOnSortName: () => store.toggleSort('interestListSort', 'name'),
    interestListOnSortStatus: () => store.toggleSort('interestListSort', 'status'),
    interestListOnSortCount: () => store.toggleSort('interestListSort', 'interestedCount'),

    isWhoInterestedList: isMyItemsInterestTab && s.whoInterestedItemId == null,
    isWhoInterestedDetail: isMyItemsInterestTab && s.whoInterestedItemId != null,
    whoItem,
    backToInterestList: store.backToInterestList,
    whoRows,
    whoRowsEmpty: whoRows.length === 0,
    whoSummaryLine: whoData.totalCount + ' הבעות עניין מתוך ' + whoData.unitCount + ' יחידות',
    whoStats: [
      whoData.totalCount + ' הבעות עניין',
      whoData.unitCount + ' יחידות שונות',
      whoData.readyCount + ' מוכנים לבדיקות',
      'הבעה ראשונה: ' + whoData.firstDate,
    ],
    whoReadyOnly: s.whoReadyOnly,
    toggleWhoReadyOnly: store.toggleWhoReadyOnly,

    pendingRows,
    pendingEmpty: pendingRows.length === 0,
    pendingHeaderNameLabel: 'שם הפריט' + store.sortArrow(s.pendingSort, 'name'),
    pendingHeaderSubmitterLabel: 'מגיש' + store.sortArrow(s.pendingSort, 'submitter'),
    pendingHeaderDateLabel: 'תאריך הגשה' + store.sortArrow(s.pendingSort, 'date'),
    pendingOnSortName: () => store.toggleSort('pendingSort', 'name'),
    pendingOnSortSubmitter: () => store.toggleSort('pendingSort', 'submitter'),
    pendingOnSortDate: () => store.toggleSort('pendingSort', 'date'),
  };
}
