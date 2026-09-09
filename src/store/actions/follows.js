/** המעקבים שלי: עריכת הבעת עניין והסרתה. */
export function attachFollowsActions(store) {
  store.startEditFollow = (follow) => store.setState({ followEditingId: follow.id, followEditForm: { phone: follow.phone, need: follow.need, classification: follow.classification, readyForTrials: follow.readyForTrials, notes: follow.notes }, followEditErrors: {}, followEditSubmitAttempted: false });
  store.cancelEditFollow = () => store.setState({ followEditingId: null, followEditForm: null, followEditErrors: {}, followEditSubmitAttempted: false });
  store.onFollowEditNeedChange = (e) => store.setState(s => ({ followEditForm: { ...s.followEditForm, need: e.target.value } }));
  store.onFollowEditClassificationChange = (v) => store.setState(s => ({ followEditForm: { ...s.followEditForm, classification: v } }));
  store.onFollowEditPhoneChange = (v) => store.setState(s => ({ followEditForm: { ...s.followEditForm, phone: v } }));
  store.toggleFollowEditReady = () => store.setState(s => ({ followEditForm: { ...s.followEditForm, readyForTrials: !s.followEditForm.readyForTrials } }));
  store.onFollowEditNotesChange = (e) => store.setState(s => ({ followEditForm: { ...s.followEditForm, notes: e.target.value } }));
  store.saveEditFollow = () => {
    const f = store.state.followEditForm;
    const errors = {};
    if (!f.need || f.need.trim() === '') errors.need = 'הצורך המבצעי הוא שדה חובה';
    if (!f.classification) errors.classification = 'סיווג ההצהרה הוא שדה חובה';
    if (Object.keys(errors).length > 0) { store.setState({ followEditErrors: errors, followEditSubmitAttempted: true }); return; }
    const id = store.state.followEditingId;
    store.setState(s => ({ myFollows: s.myFollows.map(r => r.id === id ? { ...r, ...f } : r), followEditingId: null, followEditForm: null, followEditErrors: {} }));
  };
  store.openRemoveFollowConfirm = (id) => store.setState({ followRemoveConfirmId: id });
  store.cancelRemoveFollowConfirm = () => store.setState({ followRemoveConfirmId: null });
  store.removeFollow = (id) => store.setState(s => ({ myFollows: s.myFollows.filter(r => r.id !== id), followRemoveConfirmId: null }));
}
