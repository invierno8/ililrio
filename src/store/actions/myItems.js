import { STATUS_INFO, STATUS_VARIANT } from '../../data/taxonomy.js';

/** הפריטים שלי: עריכה במקום, הבעות עניין וממתינים לאישור. */
export function attachMyItemsActions(store) {
  store.startEdit = () => {
    const item = store.getMergedItem(store.state.selectedItemId);
    store.setState({ editMode: true, editDraft: { desc: item.desc || '', status: item.status, contact: item.contact, contactRole: item.contactRole, attachments: [...item.attachments], addedImages: 0 } });
  };
  store.cancelEdit = () => store.setState({ editMode: false, editDraft: null });
  store.saveEdit = () => store.setState(s => {
    const item = store.getMergedItem(s.selectedItemId);
    const draft = s.editDraft;
    return {
      editMode: false, editDraft: null,
      itemOverrides: { ...s.itemOverrides, [s.selectedItemId]: {
        desc: draft.desc, status: draft.status, contact: draft.contact, contactRole: draft.contactRole,
        attachments: draft.attachments,
        gallery: [...item.gallery, ...Array(draft.addedImages || 0).fill({ type: 'image', badge: 'NEW' })],
        statusVariant: STATUS_VARIANT[draft.status], statusInfo: STATUS_INFO[draft.status]
      } }
    };
  });
  store.onEditDescChange = (e) => store.setState(s => ({ editDraft: { ...s.editDraft, desc: e.target.value } }));
  store.onEditStatusChange = (v) => store.setState(s => ({ editDraft: { ...s.editDraft, status: v } }));
  store.onEditContactNameChange = (e) => store.setState(s => ({ editDraft: { ...s.editDraft, contact: e.target.value } }));
  store.onEditContactRoleChange = (e) => store.setState(s => ({ editDraft: { ...s.editDraft, contactRole: e.target.value } }));
  store.addEditImage = () => store.setState(s => ({ editDraft: { ...s.editDraft, addedImages: (s.editDraft.addedImages || 0) + 1 } }));
  store.addEditDocument = () => store.setState(s => ({ editDraft: { ...s.editDraft, attachments: [...s.editDraft.attachments, { ext: 'PDF', name: 'מסמך חדש ' + (s.editDraft.attachments.length + 1) }] } }));

  store.openWhoInterested = (itemId) => store.setState({ activeScreenId: 'my-items', activeMyItemsTab: 'interest', whoInterestedItemId: itemId, whoReadyOnly: false, whoNeedExpanded: {}, expandedNavId: 'my-items' });
  store.backToInterestList = () => store.setState({ whoInterestedItemId: null });
  store.toggleWhoReadyOnly = () => store.setState(s => ({ whoReadyOnly: !s.whoReadyOnly }));
  store.toggleWhoNeed = (idx) => store.setState(s => ({ whoNeedExpanded: { ...s.whoNeedExpanded, [idx]: !s.whoNeedExpanded[idx] } }));
  store.pendingApproveClick = (id) => store.setPendingUI(id, { confirmOpen: true });
  store.pendingApproveCancel = (id) => store.setPendingUI(id, { confirmOpen: false });
  store.pendingApproveConfirm = (id) => store.setState(s => ({ approvedIds: [...s.approvedIds, id], pendingUI: { ...s.pendingUI, [id]: { confirmOpen: false, noteOpen: false, noteText: '', noteError: false } } }));
  store.pendingNoteToggle = (id) => store.setPendingUI(id, { noteOpen: !store.getPendingUI(id).noteOpen, noteError: false });
  store.pendingSetNoteText = (id, v) => store.setPendingUI(id, { noteText: v, noteError: false });
  store.pendingSubmitReturn = (id) => {
    const text = store.getPendingUI(id).noteText || '';
    if (text.trim() === '') { store.setPendingUI(id, { noteError: true }); return; }
    store.setState(s => ({ returnedIds: [...s.returnedIds, id], pendingUI: { ...s.pendingUI, [id]: { confirmOpen: false, noteOpen: false, noteText: '', noteError: false } } }));
  };
  store.detailApproveClick = () => store.setState({ detailConfirmOpen: true });
  store.detailApproveCancel = () => store.setState({ detailConfirmOpen: false });
  store.detailApproveConfirm = () => store.setState(s => ({ approvedIds: [...s.approvedIds, s.selectedItemId], activeScreenId: 'my-items', activeMyItemsTab: 'pending', detailConfirmOpen: false }));
  store.detailNoteToggle = () => store.setState(s => ({ detailNoteOpen: !s.detailNoteOpen, detailNoteError: false }));
  store.detailSetNoteText = (e) => store.setState({ detailNoteText: e.target.value, detailNoteError: false });
  store.detailSubmitReturn = () => {
    if (store.state.detailNoteText.trim() === '') { store.setState({ detailNoteError: true }); return; }
    store.setState(s => ({ returnedIds: [...s.returnedIds, s.selectedItemId], activeScreenId: 'my-items', activeMyItemsTab: 'pending', detailNoteOpen: false }));
  };
}
