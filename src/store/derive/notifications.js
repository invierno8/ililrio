import { parseDMY } from '../../lib/dates.js';

/** מרכז ההתראות: שורות, מיון וסימון כנקרא. */
export function deriveNotifications(s, store) {
  const unreadCount = s.notifications.filter((n) => !n.read).length;
  const notificationsEmpty = s.notifications.length === 0;
  const parseNotifDate = (d) => parseDMY(d.split(' · ')[0]);

  const buildNotifRow = (n) => ({
    text: n.text,
    type: n.type,
    dateTime: n.group === 'היום' ? 'היום' + (n.dateTime.includes(' · ') ? ' · ' + n.dateTime.split(' · ')[1] : '') : n.dateTime,
    onOpen: () => store.openNotifItem(n),
    rowStyle: { cursor: 'pointer', background: n.read ? '#fff' : 'var(--surface)', borderBottom: '1px solid var(--border)' },
    textCellStyle: { padding: '12px 14px', fontSize: '14px', fontWeight: n.read ? 400 : 600, borderRight: n.read ? '3px solid transparent' : '3px solid var(--tw-neutral-900)' },
    typeCellStyle: { padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' },
    dateCellStyle: { padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' },
  });

  let notifFlatRows = s.notifications.map(buildNotifRow);
  if (s.notifSortKey) {
    const sorted = [...s.notifications].sort((a, b) => {
      let av;
      let bv;
      if (s.notifSortKey === 'dateTime') { av = parseNotifDate(a.dateTime); bv = parseNotifDate(b.dateTime); }
      else { av = (a[s.notifSortKey] || '').toString(); bv = (b[s.notifSortKey] || '').toString(); }
      if (av < bv) return s.notifSortDir === 'asc' ? -1 : 1;
      if (av > bv) return s.notifSortDir === 'asc' ? 1 : -1;
      return 0;
    });
    notifFlatRows = sorted.map(buildNotifRow);
  }

  const sortState = { key: s.notifSortKey, dir: s.notifSortDir };

  return {
    unreadCountLabel: unreadCount > 0 ? unreadCount + ' התראות שלא נקראו' : 'כל ההתראות נקראו',
    markAllNotifsRead: store.markAllNotifsRead,
    notificationsEmpty,
    notificationsNotEmpty: !notificationsEmpty,
    notifFlatRows,
    notifHeaderTextLabel: 'התראה' + store.sortArrow(sortState, 'text'),
    notifHeaderTypeLabel: 'סוג' + store.sortArrow(sortState, 'type'),
    notifHeaderDateLabel: 'תאריך' + store.sortArrow(sortState, 'dateTime'),
    notifOnSortText: () => store.toggleNotifSort('text'),
    notifOnSortType: () => store.toggleNotifSort('type'),
    notifOnSortDate: () => store.toggleNotifSort('dateTime'),
  };
}
