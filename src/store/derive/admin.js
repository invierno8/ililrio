import { ITEMS } from '../../data/items.js';
import { P4_PERMISSION_OPTIONS, P4_BODY_OPTIONS_LIST, LOG_ROWS_SEED } from '../../data/admin.js';
import { underlineTabStyle } from './shared.js';

/** מסכי המפעיל (P4): משתמשים, קבוצת מאשרים, העברת תפקיד, רשימות, יומן ושער כניסה. */
export function deriveAdmin(s, store) {
  // --- משתמשים ---
  const p4UserForm = s.p4UserForm || store.emptyP4UserForm();
  const p4UserFormIsOwner = p4UserForm.permission === 'בעל פריט';
  const p4ApproverPool = s.p4Users.filter((u) => u.isApprover && u.status === 'active');

  const p4UserRows = s.p4Users.map((u) => {
    const disableUI = store.getRowUI('disable', u.id);
    const approvesForUsers = s.p4Users.filter((x) => x.approverId === u.id);
    const hasDependents = approvesForUsers.length > 0;
    return {
      id: u.id, name: u.name, orgId: u.orgId, body: u.body, role: u.role,
      statusLabel: u.status === 'active' ? 'פעיל' : 'מושבת',
      statusVariant: u.status === 'active' ? 'success' : 'neutral',
      isActive: u.status === 'active',
      isDisabled: u.status === 'disabled',
      onEdit: () => store.p4EditUser(u.id),
      onDisableClick: () => store.p4DisableClick(u.id),
      onDisableCancel: () => store.p4DisableCancel(u.id),
      onDisableConfirm: () => store.p4DisableConfirm(u.id),
      onEnable: () => store.p4EnableUser(u.id),
      disableConfirmOpen: !!disableUI.open,
      hasDependents,
      noDependents: !hasDependents,
      dependentsText: approvesForUsers.map((x) => x.name).join(', '),
      onGoTransfer: () => store.setState({ activeScreenId: 'role-transfer', p4TransferOutgoingId: u.id }),
    };
  });

  // --- קבוצת המאשרים ---
  const approverList = s.p4Users.filter((u) => u.isApprover);
  const p4ApproverRows = approverList.map((u) => {
    const removeUI = store.getRowUI('approverRemove', u.id);
    const approvesForUsers = s.p4Users.filter((x) => x.approverId === u.id);
    const hasDependentsForRemoval = approvesForUsers.length > 0;
    return {
      id: u.id, name: u.name, role: u.role,
      forLabel: approvesForUsers.length + ' משתמשים',
      onOpenDetail: () => store.p4OpenUserDetail(u.id),
      onRemoveClick: () => store.p4ApproverRemoveClick(u.id),
      removeConfirmOpen: !!removeUI.open,
      hasDependentsForRemoval,
      noDependentsForRemoval: !hasDependentsForRemoval,
      forCount: approvesForUsers.length,
      onRemoveCancel: () => store.p4ApproverRemoveCancel(u.id),
      onRemoveConfirm: () => store.p4ApproverRemoveConfirm(u.id),
    };
  });

  const p4ApproverDetailUser = s.p4Users.find((u) => u.id === s.p4UserDetailId)
    || { name: '', orgId: '', orgRole: '', body: '', email: '', phone: '', status: 'active' };

  // --- העברת תפקיד ---
  const p4ActiveUsers = s.p4Users.filter((u) => u.status === 'active');
  const p4TransferOutgoingUser = s.p4Users.find((u) => u.id === s.p4TransferOutgoingId);
  const p4TransferIncomingUser = s.p4Users.find((u) => u.id === s.p4TransferIncomingId);
  const p4TransferHasOutgoing = !!p4TransferOutgoingUser;
  const p4TransferOwnedCount = p4TransferOutgoingUser ? ITEMS.filter((it) => it.owner === p4TransferOutgoingUser.name).length : 0;
  const p4TransferApprovesForList = p4TransferOutgoingUser ? s.p4Users.filter((u) => u.approverId === p4TransferOutgoingUser.id) : [];
  const p4TransferApprovesForCount = p4TransferApprovesForList.length;
  const p4TransferAllZero = p4TransferHasOutgoing && p4TransferOwnedCount === 0 && p4TransferApprovesForCount === 0;
  const p4TransferHasIncoming = !!p4TransferIncomingUser;
  const p4TransferReady = p4TransferHasOutgoing && p4TransferHasIncoming;

  // --- רשימות מנוהלות ותגיות ---
  const p4SelectedList = s.p4Lists.find((l) => l.id === s.p4SelectedListId) || s.p4Lists[0];
  const p4ListRows = p4SelectedList.values.map((v, i) => {
    const rowUI = store.getRowUI('listDeactivate', p4SelectedList.id + ':' + i);
    return {
      name: v.name, usage: v.usage, active: v.active,
      onNameChange: (e) => store.p4OnListValueName(p4SelectedList.id, i, e.target.value),
      onToggle: () => store.p4ToggleListValue(p4SelectedList.id, i),
      deactivateConfirmOpen: !!rowUI.open,
      onCancelDeactivate: () => store.p4CancelListDeactivate(p4SelectedList.id, i),
      onConfirmDeactivate: () => store.p4ConfirmListDeactivate(p4SelectedList.id, i),
    };
  });

  const p4TagFilterLower = s.p4TagFilter.trim().toLowerCase();
  const p4TagsFiltered = s.p4Tags.filter((t) => !p4TagFilterLower || t.name.toLowerCase().includes(p4TagFilterLower));
  const p4TagRows = p4TagsFiltered.map((t) => ({
    name: t.name, usage: t.usage, statusLabel: t.active ? 'פעילה' : 'כבויה',
    onNameChange: (e) => store.p4OnTagNameChange(t.name, e.target.value),
    onMergeClick: () => store.p4TagMergeOpenToggle(t.name),
    canDeactivate: t.usage === 0 && t.active,
    onDeactivate: () => store.p4TagDeactivate(t.name),
    mergeOpen: s.p4TagMergeOpenName === t.name,
    mergeTargetOptions: s.p4Tags.filter((x) => x.name !== t.name).map((x) => ({ value: x.name, label: x.name })),
    mergeTarget: s.p4TagMergeTarget,
    onMergeTargetChange: (v) => store.p4TagMergeTargetChange(v),
    hasMergeTarget: !!s.p4TagMergeTarget,
    onMergeCancel: () => store.p4TagMergeOpenToggle(t.name),
    onMergeConfirm: () => store.p4TagMergeConfirm(t.name),
    mergeConfirmDisabled: !s.p4TagMergeTarget,
  }));

  // --- יומן פעולות ---
  const p4LogFiltered = LOG_ROWS_SEED.filter((r) =>
    (!s.p4LogActionType || r.action === s.p4LogActionType)
    && (!s.p4LogUser || r.user === s.p4LogUser)
    && (!s.p4LogItem.trim() || r.entity.toLowerCase().includes(s.p4LogItem.trim().toLowerCase())));

  // --- שער הכניסה ---
  const gateActiveCount = s.p4GateRules.filter((r) => r.active).length;

  return {
    isP4UsersScreen: s.activeScreenId === 'users',
    p4OpenUsersCreate: store.p4OpenUsersCreate,
    p4CancelUsersForm: store.p4CancelUsersForm,
    p4UserFormOpen: s.p4UsersCreateOpen || !!s.p4UsersEditingId,
    p4UserFormTitle: s.p4UsersEditingId ? 'עריכת משתמש' : 'הוספת משתמש',
    p4UserForm,
    p4UserFormIsOwner,
    p4UserFormNotOwner: !p4UserFormIsOwner,
    p4PermissionOptions: P4_PERMISSION_OPTIONS.map((v) => ({ value: v, label: v })),
    p4BodyOptionsForForm: Array.from(new Set([...P4_BODY_OPTIONS_LIST, p4UserForm.body].filter(Boolean))).map((v) => ({ value: v, label: v })),
    p4ApproverOptionsForForm: p4ApproverPool.map((u) => ({ value: u.id, label: u.name })),
    p4ApproverFieldLabel: 'מאשר התוכן' + (p4UserForm.directPublish ? '' : ' *'),
    p4OnUserFormNameChange: store.p4OnUserFormNameChange,
    p4OnUserFormOrgIdChange: store.p4OnUserFormOrgIdChange,
    p4OnUserFormRoleChange: store.p4OnUserFormRoleChange,
    p4OnUserFormBodyChange: store.p4OnUserFormBodyChange,
    p4OnUserFormEmailChange: store.p4OnUserFormEmailChange,
    p4OnUserFormPhoneChange: store.p4OnUserFormPhoneChange,
    p4OnUserFormPermissionChange: store.p4OnUserFormPermissionChange,
    p4OnUserFormClassificationChange: store.p4OnUserFormClassificationChange,
    p4OnUserFormDirectPublishToggle: store.p4OnUserFormDirectPublishToggle,
    p4OnUserFormApproverIdChange: store.p4OnUserFormApproverIdChange,
    p4OnUserFormIsApproverToggle: store.p4OnUserFormIsApproverToggle,
    p4SaveUserForm: store.p4SaveUserForm,
    p4UsersCountText: s.p4Users.length + ' משתמשים',
    p4UserRows,

    isP4ApproversScreen: s.activeScreenId === 'approvers-group',
    p4ApproverEmpty: approverList.length === 0,
    p4ApproverRows,
    p4ApproverAddOpen: s.p4ApproverAddOpen,
    p4OpenApproverAdd: store.p4OpenApproverAdd,
    p4CancelApproverAdd: store.p4CancelApproverAdd,
    p4ApproverAddOptions: s.p4Users.filter((u) => !u.isApprover && u.status === 'active').map((u) => ({ value: u.id, label: u.name })),
    p4ApproverAddSelect: store.p4ApproverAddSelect,

    isP4UserDetailScreen: s.activeScreenId === 'p4-user-detail',
    p4BackFromUserDetail: store.p4BackFromUserDetail,
    p4ApproverDetailUser,
    p4ApproverDetailStatusLabel: p4ApproverDetailUser.status === 'active' ? 'פעיל' : 'מושבת',
    p4ApproverDetailStatusVariant: p4ApproverDetailUser.status === 'active' ? 'success' : 'neutral',

    isP4TransferScreen: s.activeScreenId === 'role-transfer',
    p4TransferOutgoingOptions: p4ActiveUsers.map((u) => ({ value: u.id, label: u.name })),
    p4TransferIncomingOptions: p4ActiveUsers.filter((u) => u.id !== s.p4TransferOutgoingId).map((u) => ({ value: u.id, label: u.name })),
    p4TransferOutgoingId: s.p4TransferOutgoingId,
    p4TransferIncomingId: s.p4TransferIncomingId,
    p4OnTransferOutgoingChange: store.p4OnTransferOutgoingChange,
    p4OnTransferIncomingChange: store.p4OnTransferIncomingChange,
    p4TransferHasOutgoing,
    p4TransferAllZero,
    p4TransferHasHoldings: p4TransferHasOutgoing && !p4TransferAllZero,
    p4TransferOwnedCount,
    p4TransferApprovesForCount,
    p4TransferApprovesForNamesText: p4TransferApprovesForList.length ? '(' + p4TransferApprovesForList.map((u) => u.name).join(', ') + ')' : '',
    p4TransferHasIncoming,
    p4TransferApproverCheckOk: p4TransferHasIncoming && p4TransferIncomingUser.isApprover,
    p4TransferApproverCheckFails: p4TransferHasIncoming && !p4TransferIncomingUser.isApprover,
    p4TransferReady,
    p4TransferOutgoingName: p4TransferOutgoingUser ? p4TransferOutgoingUser.name : '',
    p4TransferIncomingName: p4TransferIncomingUser ? p4TransferIncomingUser.name : '',
    p4ToggleTransferSimulateFailure: store.p4ToggleTransferSimulateFailure,
    p4TransferSimulateFailureLabel: s.p4TransferSimulateFailure ? 'הדגמה: כשל בהעברה (מופעל)' : 'הדגמה: כשל בהעברה (כבוי)',
    p4TransferConfirmClosed: !s.p4TransferConfirmOpen && !s.p4TransferResult,
    p4OpenTransferConfirm: store.p4OpenTransferConfirm,
    p4TransferSubmitDisabled: !p4TransferReady,
    p4TransferConfirmOpen: s.p4TransferConfirmOpen,
    p4CancelTransferConfirm: store.p4CancelTransferConfirm,
    p4ConfirmTransfer: store.p4ConfirmTransfer,
    p4TransferSuccess: s.p4TransferResult === 'success',
    p4TransferFailure: s.p4TransferResult === 'failure',
    p4GoDisableOutgoing: store.p4GoDisableOutgoing,

    isP4ManagedListsScreen: s.activeScreenId === 'managed-lists',
    p4SetTabValues: () => store.p4SetManagedListsTab('values'),
    p4SetTabTags: () => store.p4SetManagedListsTab('tags'),
    p4TabValuesStyle: underlineTabStyle(s.p4ManagedListsTab === 'values', '10px 4px'),
    p4TabTagsStyle: underlineTabStyle(s.p4ManagedListsTab === 'tags', '10px 4px'),
    isP4TabValues: s.p4ManagedListsTab === 'values',
    isP4TabTags: s.p4ManagedListsTab === 'tags',
    p4ListNames: s.p4Lists.map((l) => ({
      name: l.name,
      hasGap: !!l.gap,
      gap: l.gap,
      onClick: () => store.p4SelectList(l.id),
      rowStyle: { padding: '8px 10px', borderRadius: 'var(--radius-control)', cursor: 'pointer', fontSize: '13px', fontWeight: s.p4SelectedListId === l.id ? 700 : 500, background: s.p4SelectedListId === l.id ? 'var(--surface)' : 'transparent', color: 'var(--text-primary)' },
    })),
    p4SelectedListName: p4SelectedList.name,
    p4SelectedListHasGap: !!p4SelectedList.gap,
    p4SelectedListGap: p4SelectedList.gap,
    p4ListNewValueInput: s.p4ListNewValueInputs[p4SelectedList.id] || '',
    p4ListNewValueOnChange: (e) => store.p4OnListNewValueChange(p4SelectedList.id, e.target.value),
    p4ListNewValueOnAdd: () => store.p4AddListValue(p4SelectedList.id),
    p4ListValuesEmpty: p4SelectedList.values.length === 0,
    p4ListRows,
    p4TagFilter: s.p4TagFilter,
    p4OnTagFilterChange: store.p4OnTagFilterChange,
    p4TagsCountText: p4TagsFiltered.length + ' תגיות',
    p4TagRows,

    isP4LogScreen: s.activeScreenId === 'activity-log',
    p4LogActionOptions: Array.from(new Set(LOG_ROWS_SEED.map((r) => r.action))).map((v) => ({ value: v, label: v })),
    p4LogUserOptions: Array.from(new Set(LOG_ROWS_SEED.map((r) => r.user))).map((v) => ({ value: v, label: v })),
    p4LogActionType: s.p4LogActionType,
    p4LogUser: s.p4LogUser,
    p4LogItem: s.p4LogItem,
    p4OnLogActionTypeChange: store.p4OnLogActionTypeChange,
    p4OnLogUserChange: store.p4OnLogUserChange,
    p4OnLogItemChange: store.p4OnLogItemChange,
    p4HasLogFilters: !!(s.p4LogActionType || s.p4LogUser || s.p4LogItem.trim()),
    p4ClearLogFilters: store.p4ClearLogFilters,
    p4LogRows: p4LogFiltered.map((r) => ({
      dateTime: r.dateTime, user: r.user, action: r.action, entity: r.entity, result: r.result,
      resultVariant: r.result === 'הצליח' ? 'success' : r.result === 'הצליח חלקית' ? 'warning' : 'error',
    })),
    p4LogEmpty: p4LogFiltered.length === 0,

    isP4GateScreen: s.activeScreenId === 'entry-gate',
    p4GateRows: s.p4GateRules.map((r) => ({
      name: r.name, checkType: r.checkType, requiredValue: r.requiredValue, failureMsg: r.failureMsg, changedLabel: r.changedLabel,
      active: r.active,
      activeLabel: r.active ? 'פעיל' : 'כבוי',
      onValueChange: (e) => store.p4GateSetValue(r.id, e.target.value),
      onFailureMsgChange: (e) => store.p4GateSetFailureMsg(r.id, e.target.value),
      onToggle: () => store.p4GateToggle(r.id),
      lastActiveWarn: r.active && gateActiveCount <= 1,
    })),
  };
}
