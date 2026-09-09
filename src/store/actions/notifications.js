/** מרכז ההתראות. */
export function attachNotificationsActions(store) {
  store.markNotifRead = (id) => store.setState(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  store.markAllNotifsRead = () => store.setState(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
  store.toggleNotifSort = (key) => store.setState(s => ({ notifSortKey: key, notifSortDir: s.notifSortKey === key && s.notifSortDir === 'asc' ? 'desc' : 'asc' }));
  store.openNotifItem = (n) => { store.markNotifRead(n.id); store.openItem(n.itemId, 'notifications', 'מרכז התראות'); };
}
