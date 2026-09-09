/** המשימות שלי: תזכורות רענון, טיוטות ופריטים שהוחזרו. */
export function attachMyTasksActions(store) {
  store.setMyTasksTab = (tab) => store.setState({ myTasksTab: tab });
  store.reminderReviewed = (id) => store.setState(s => ({ reminderClosed: { ...s.reminderClosed, [id]: true } }));
  store.reminderTransferToggle = (id) => store.setRowUI('reminderTransfer', id, { open: !store.getRowUI('reminderTransfer', id).open });
  store.reminderTransferDoConfirm = (id) => store.setState(s => ({ reminderClosed: { ...s.reminderClosed, [id]: true } }));
  store.toggleP3CanPublish = () => store.setState(s => ({ p3CanPublish: !s.p3CanPublish }));
}
