import { CURRENT_PROFILE } from '../../data/people.js';

/** מסך הפריט: פתיחה, גלריה, פאנלים נפתחים והבעת עניין. */
export function attachDetailActions(store) {
  store.openItem = (id, backScreen, backLabel, context, backTab) => {
    store.setState({ activeScreenId: 'item-detail', selectedItemId: id, showAllInterested: false, ownerInfoOpen: false, contactInfoOpen: false, statusInfoOpen: false, activeGalleryIndex: 0, detailBackScreen: backScreen || 'catalog', detailBackLabel: backLabel || 'קטלוג', detailContext: context || 'default', detailBackTab: backTab || null, detailConfirmOpen: false, detailNoteOpen: false, detailNoteText: '', detailNoteError: false, editMode: false, editDraft: null, interestFormOpen: false, interestJustSubmitted: false, interestFormErrors: {} });
    store.scrollMainToTop();
  };
  store.goBackFromDetail = () => store.setState(s => ({ activeScreenId: s.detailBackScreen, activeMyItemsTab: s.detailBackTab || s.activeMyItemsTab }));
  store.setGalleryIndex = (i) => store.setState({ activeGalleryIndex: i });
  store.prevGalleryItem = () => store.setState(s => { const n = store.getItem(s.selectedItemId).gallery.length; return { activeGalleryIndex: (s.activeGalleryIndex - 1 + n) % n }; });
  store.nextGalleryItem = () => store.setState(s => { const n = store.getItem(s.selectedItemId).gallery.length; return { activeGalleryIndex: (s.activeGalleryIndex + 1) % n }; });
  store.toggleShowAllInterested = () => store.setState(s => ({ showAllInterested: !s.showAllInterested }));
  store.toggleOwnerInfo = () => store.setState(s => ({ ownerInfoOpen: !s.ownerInfoOpen }));
  store.toggleContactInfo = () => store.setState(s => ({ contactInfoOpen: !s.contactInfoOpen }));
  store.toggleStatusInfo = () => store.setState(s => ({ statusInfoOpen: !s.statusInfoOpen }));
  store.copyItemLink = () => {
    const item = store.getItem(store.state.selectedItemId);
    try { navigator.clipboard && navigator.clipboard.writeText(location.href.split('#')[0] + '#item-' + item.id); } catch (e) {}
    store.setState({ shareCopiedFlash: true });
    setTimeout(() => store.setState({ shareCopiedFlash: false }), 1500);
  };

  store.openInterestForm = () => store.setState({ interestFormOpen: true, interestJustSubmitted: false, interestForm: { phone: CURRENT_PROFILE.phone, need: '', classification: '', readyForTrials: false, notes: '' }, interestFormErrors: {}, interestFormSubmitAttempted: false });
  store.cancelInterestForm = () => store.setState({ interestFormOpen: false, interestFormErrors: {}, interestFormSubmitAttempted: false });
  store.onInterestPhoneChange = (v) => store.setState(s => ({ interestForm: { ...s.interestForm, phone: v } }));
  store.onInterestNeedChange = (e) => store.setState(s => ({ interestForm: { ...s.interestForm, need: e.target.value } }));
  store.onInterestClassificationChange = (v) => store.setState(s => ({ interestForm: { ...s.interestForm, classification: v } }));
  store.toggleInterestReady = () => store.setState(s => ({ interestForm: { ...s.interestForm, readyForTrials: !s.interestForm.readyForTrials } }));
  store.onInterestNotesChange = (e) => store.setState(s => ({ interestForm: { ...s.interestForm, notes: e.target.value } }));
  store.submitInterestForm = () => {
    const f = store.state.interestForm;
    const errors = {};
    if (!f.need || f.need.trim() === '') errors.need = 'הצורך המבצעי הוא שדה חובה';
    if (!f.classification) errors.classification = 'סיווג ההצהרה הוא שדה חובה';
    if (Object.keys(errors).length > 0) { store.setState({ interestFormErrors: errors, interestFormSubmitAttempted: true }); return; }
    const itemId = store.state.selectedItemId;
    const newRecord = { id: 'f-' + Date.now(), itemId, phone: f.phone, need: f.need, classification: f.classification, readyForTrials: f.readyForTrials, notes: f.notes, date: new Date().toLocaleDateString('he-IL'), removed: false };
    store.setState(s => ({ myFollows: [...s.myFollows, newRecord], interestFormOpen: false, interestJustSubmitted: true, interestFormErrors: {} }));
  };
  store.goToExistingFollow = () => store.setState({ activeScreenId: 'my-follows' });
  store.goToMyFollowsFromDetail = () => store.setState({ activeScreenId: 'my-follows' });
}
