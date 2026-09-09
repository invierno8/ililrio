import { CURRENT_PROFILE } from '../../data/people.js';
import { parseDMY } from '../../lib/dates.js';

/** מסך הפריט: כרטיס הפרטים, הגלריה, טופס הבעת העניין ומצב העריכה. */
export function deriveDetail(s, store) {
  const selectedItem = store.getItem(s.selectedItemId);
  const visibleInterested = s.showAllInterested ? selectedItem.interested : selectedItem.interested.slice(0, 3);
  const hasMoreInterested = selectedItem.interested.length > 3;
  const showAllInterestedLabel = s.showAllInterested ? 'הצג פחות' : 'הצג את כל ' + selectedItem.interested.length + ' ההבעות';

  const existingFollow = s.selectedItemId != null ? s.myFollows.find((f) => f.itemId === s.selectedItemId) : null;
  const sortedFollowsByDate = [...s.myFollows].sort((a, b) => parseDMY(b.date) - parseDMY(a.date));
  const existingFollowRowNum = existingFollow ? sortedFollowsByDate.findIndex((f) => f.id === existingFollow.id) + 1 : 0;

  const isDefaultDetailContext = s.detailContext === 'default';
  const isOwnDetailContext = s.detailContext === 'p2-own';
  const isPendingPreviewContext = s.detailContext === 'p2-pending-preview';
  const detailStatusIsAvailable = selectedItem.status === 'זמין';
  const showInterestButton = isDefaultDetailContext && !detailStatusIsAvailable && !existingFollow && !s.interestFormOpen;
  const showAlreadyExpressedLink = isDefaultDetailContext && !detailStatusIsAvailable && !!existingFollow && !s.interestFormOpen;
  const showInterestForm = isDefaultDetailContext && s.interestFormOpen;
  const showInterestConfirmation = isDefaultDetailContext && s.interestJustSubmitted && !s.interestFormOpen;
  const editDraft = s.editDraft || { desc: selectedItem.desc || '', status: selectedItem.status, contact: selectedItem.contact, contactRole: selectedItem.contactRole, attachments: selectedItem.attachments };
  const detailActionsIdle = isPendingPreviewContext && !s.detailConfirmOpen && !s.detailNoteOpen;
  const statusSelectOptions = ['זמין', 'בפיתוח', 'ממתין לתקצוב'].map((v) => ({ value: v, label: v }));

  const breadcrumbItems = [{ label: s.detailBackLabel, href: '#' }, { label: selectedItem.name }];
  const activeGalleryLabel = selectedItem.gallery[s.activeGalleryIndex] ? selectedItem.gallery[s.activeGalleryIndex].badge : '';
  const activeGalleryDesc = selectedItem.gallery[s.activeGalleryIndex] ? selectedItem.gallery[s.activeGalleryIndex].desc : '';
  const galleryThumbs = selectedItem.gallery.map((g, i) => ({
    badge: g.badge,
    onSelect: () => store.setGalleryIndex(i),
    thumbStyle: { width: '64px', height: '48px', borderRadius: '6px', background: 'var(--tw-gray-100)', border: i === s.activeGalleryIndex ? '2px solid var(--tw-neutral-900)' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--text-muted)' },
  }));
  const galleryNavBtnStyle = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };
  const chevronRightMarkStyle = { width: '7px', height: '7px', borderTop: '1.6px solid var(--text-secondary)', borderRight: '1.6px solid var(--text-secondary)', transform: 'rotate(135deg)' };
  const chevronLeftMarkStyle = { width: '7px', height: '7px', borderTop: '1.6px solid var(--text-secondary)', borderRight: '1.6px solid var(--text-secondary)', transform: 'rotate(-45deg)' };

  const attributeRows = selectedItem.attributes || [];

  return {
    breadcrumbItems,
    goBackFromDetail: store.goBackFromDetail,
    selectedItem,
    visibleInterested,
    hasMoreInterested,
    showAllInterestedLabel,
    toggleShowAllInterested: store.toggleShowAllInterested,
    toggleOwnerInfo: store.toggleOwnerInfo,
    ownerInfoOpen: s.ownerInfoOpen,
    toggleContactInfo: store.toggleContactInfo,
    contactInfoOpen: s.contactInfoOpen,
    toggleStatusInfo: store.toggleStatusInfo,
    statusInfoOpen: s.statusInfoOpen,
    copyItemLink: store.copyItemLink,
    shareCopiedFlash: s.shareCopiedFlash,

    showInterestButton,
    showAlreadyExpressedLink,
    showInterestConfirmation,
    showInterestForm,
    openInterestForm: store.openInterestForm,
    cancelInterestForm: store.cancelInterestForm,
    goToExistingFollow: store.goToExistingFollow,
    existingFollowRowNum,
    goToMyFollowsFromDetail: store.goToMyFollowsFromDetail,
    p1Profile: CURRENT_PROFILE,
    interestForm: s.interestForm,
    onInterestPhoneChange: store.onInterestPhoneChange,
    onInterestNeedChange: store.onInterestNeedChange,
    onInterestClassificationChange: store.onInterestClassificationChange,
    toggleInterestReady: store.toggleInterestReady,
    onInterestNotesChange: store.onInterestNotesChange,
    submitInterestForm: store.submitInterestForm,
    interestNeedError: s.interestFormSubmitAttempted ? s.interestFormErrors.need : '',
    interestClassificationError: s.interestFormSubmitAttempted ? s.interestFormErrors.classification : '',

    activeGalleryLabel,
    activeGalleryDesc,
    galleryThumbs,
    prevGalleryItem: store.prevGalleryItem,
    nextGalleryItem: store.nextGalleryItem,
    galleryNavBtnStyle,
    chevronRightMarkStyle,
    chevronLeftMarkStyle,

    attributeRows,
    attributesEmpty: attributeRows.length === 0,
    hasAttributes: attributeRows.length > 0,
    trialsEmpty: selectedItem.trials.length === 0,
    hasTrials: selectedItem.trials.length > 0,
    attachmentsEmpty: selectedItem.attachments.length === 0,
    hasAttachments: selectedItem.attachments.length > 0,

    isDefaultDetailContext,
    isOwnDetailContext,
    isPendingPreviewContext,
    editDraft,
    detailActionsIdle,
    statusSelectOptions,
    editMode: s.editMode,
    editModeOff: !s.editMode,
    startEdit: store.startEdit,
    cancelEdit: store.cancelEdit,
    saveEdit: store.saveEdit,
    onEditDescChange: store.onEditDescChange,
    onEditStatusChange: store.onEditStatusChange,
    onEditContactNameChange: store.onEditContactNameChange,
    onEditContactRoleChange: store.onEditContactRoleChange,
    addEditImage: store.addEditImage,
    addEditDocument: store.addEditDocument,
    editPublishedItem: () => store.openItemFormEditPublished(s.selectedItemId),
    detailConfirmOpen: s.detailConfirmOpen,
    detailApproveClick: store.detailApproveClick,
    detailApproveCancel: store.detailApproveCancel,
    detailApproveConfirm: store.detailApproveConfirm,
    detailNoteOpen: s.detailNoteOpen,
    detailNoteText: s.detailNoteText,
    detailNoteError: s.detailNoteError,
    detailNoteToggle: store.detailNoteToggle,
    detailSetNoteText: store.detailSetNoteText,
    detailSubmitReturn: store.detailSubmitReturn,
  };
}
