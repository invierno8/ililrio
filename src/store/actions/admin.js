/** מסכי המפעיל: משתמשים, מאשרים, העברת תפקיד, רשימות מנוהלות ושער הכניסה. */
export function attachAdminActions(store) {
  store.emptyP4UserForm = (u) => ({ name: u ? u.name : '', orgId: u ? u.orgId : '', role: u ? u.orgRole : '', body: u ? u.body : '', email: u ? u.email : '', phone: u ? u.phone : '', permission: u ? u.role : '', classification: u ? u.classification : '', approverId: u ? u.approverId : '', isApprover: u ? u.isApprover : false, directPublish: u ? u.directPublish : false, errors: {} });
  store.p4OpenUsersCreate = () => store.setState({ p4UsersCreateOpen: true, p4UsersEditingId: null, p4UserForm: store.emptyP4UserForm() });
  store.p4CancelUsersForm = () => store.setState({ p4UsersCreateOpen: false, p4UsersEditingId: null, p4UserForm: null });
  store.p4EditUser = (id) => { const u = store.state.p4Users.find(x => x.id === id); store.setState({ p4UsersEditingId: id, p4UserForm: store.emptyP4UserForm(u), p4UsersCreateOpen: false }); };
  store.p4SetUserFormField = (key, val) => store.setState(s => ({ p4UserForm: { ...s.p4UserForm, [key]: val } }));
  store.p4OnUserFormNameChange = (e) => store.p4SetUserFormField('name', e.target.value);
  store.p4OnUserFormOrgIdChange = (e) => store.p4SetUserFormField('orgId', e.target.value);
  store.p4OnUserFormRoleChange = (e) => store.p4SetUserFormField('role', e.target.value);
  store.p4OnUserFormBodyChange = (v) => store.p4SetUserFormField('body', v);
  store.p4OnUserFormEmailChange = (e) => store.p4SetUserFormField('email', e.target.value);
  store.p4OnUserFormPhoneChange = (e) => store.p4SetUserFormField('phone', e.target.value);
  store.p4OnUserFormPermissionChange = (v) => store.p4SetUserFormField('permission', v);
  store.p4OnUserFormClassificationChange = (v) => store.p4SetUserFormField('classification', v);
  store.p4OnUserFormDirectPublishToggle = () => store.setState(s => ({ p4UserForm: { ...s.p4UserForm, directPublish: !s.p4UserForm.directPublish } }));
  store.p4OnUserFormApproverIdChange = (v) => store.p4SetUserFormField('approverId', v);
  store.p4OnUserFormIsApproverToggle = () => store.setState(s => ({ p4UserForm: { ...s.p4UserForm, isApprover: !s.p4UserForm.isApprover } }));
  store.p4SaveUserForm = () => {
    const f = store.state.p4UserForm;
    const errors = {};
    ['name', 'orgId', 'role', 'body', 'email'].forEach(k => { if (!f[k] || !f[k].trim()) errors[k] = 'שדה חובה'; });
    if (!f.permission) errors.permission = 'שדה חובה';
    if (f.permission !== 'בעל פריט' && !f.directPublish && !f.approverId) errors.approverId = 'שדה חובה';
    if (Object.keys(errors).length) { store.setState({ p4UserForm: { ...f, errors } }); return; }
    store.setState(s => {
      const isOwner = f.permission === 'בעל פריט';
      const rec = { name: f.name, orgId: f.orgId, orgRole: f.role, body: f.body, email: f.email, phone: f.phone, role: f.permission, classification: f.classification, approverId: isOwner ? '' : f.approverId, isApprover: isOwner ? true : f.isApprover, directPublish: isOwner ? false : f.directPublish, status: 'active' };
      let users;
      if (s.p4UsersEditingId) users = s.p4Users.map(u => u.id === s.p4UsersEditingId ? { ...u, ...rec } : u);
      else users = [...s.p4Users, { id: 'u' + Date.now(), ...rec }];
      return { p4Users: users, p4UsersCreateOpen: false, p4UsersEditingId: null, p4UserForm: null };
    });
  };
  store.p4DisableClick = (id) => store.setRowUI('disable', id, { open: true });
  store.p4DisableCancel = (id) => store.setRowUI('disable', id, { open: false });
  store.p4DisableConfirm = (id) => { store.setState(s => ({ p4Users: s.p4Users.map(u => u.id === id ? { ...u, status: 'disabled' } : u) })); store.setRowUI('disable', id, { open: false }); };
  store.p4EnableUser = (id) => store.setState(s => ({ p4Users: s.p4Users.map(u => u.id === id ? { ...u, status: 'active' } : u) }));

  store.p4OpenApproverAdd = () => store.setState({ p4ApproverAddOpen: true });
  store.p4CancelApproverAdd = () => store.setState({ p4ApproverAddOpen: false });
  store.p4ApproverAddSelect = (id) => store.setState(s => ({ p4Users: s.p4Users.map(u => u.id === id ? { ...u, isApprover: true } : u), p4ApproverAddOpen: false }));
  store.p4ApproverRemoveClick = (id) => store.setRowUI('approverRemove', id, { open: true });
  store.p4ApproverRemoveCancel = (id) => store.setRowUI('approverRemove', id, { open: false });
  store.p4ApproverRemoveConfirm = (id) => { store.setState(s => ({ p4Users: s.p4Users.map(u => u.id === id ? { ...u, isApprover: false } : u) })); store.setRowUI('approverRemove', id, { open: false }); };
  store.p4OpenUserDetail = (id) => store.setState({ activeScreenId: 'p4-user-detail', p4UserDetailId: id });
  store.p4BackFromUserDetail = () => store.setState({ activeScreenId: 'approvers-group', p4UserDetailId: null });

  store.p4OnTransferOutgoingChange = (v) => store.setState({ p4TransferOutgoingId: v, p4TransferResult: null, p4TransferConfirmOpen: false });
  store.p4OnTransferIncomingChange = (v) => store.setState({ p4TransferIncomingId: v, p4TransferResult: null, p4TransferConfirmOpen: false });
  store.p4ToggleTransferSimulateFailure = () => store.setState(s => ({ p4TransferSimulateFailure: !s.p4TransferSimulateFailure }));
  store.p4OpenTransferConfirm = () => store.setState({ p4TransferConfirmOpen: true });
  store.p4CancelTransferConfirm = () => store.setState({ p4TransferConfirmOpen: false });
  store.p4ConfirmTransfer = () => store.setState(s => {
    if (s.p4TransferSimulateFailure) return { p4TransferConfirmOpen: false, p4TransferResult: 'failure' };
    const outId = s.p4TransferOutgoingId, inId = s.p4TransferIncomingId;
    const users = s.p4Users.map(u => u.approverId === outId ? { ...u, approverId: inId } : u);
    return { p4Users: users, p4TransferConfirmOpen: false, p4TransferResult: 'success' };
  });
  store.p4GoDisableOutgoing = () => store.setState(s => ({ p4Users: s.p4Users.map(u => u.id === s.p4TransferOutgoingId ? { ...u, status: 'disabled' } : u), p4TransferResult: null, p4TransferOutgoingId: '', p4TransferIncomingId: '' }));

  store.p4SetManagedListsTab = (tab) => store.setState({ p4ManagedListsTab: tab });
  store.p4SelectList = (id) => store.setState({ p4SelectedListId: id });
  store.p4OnListNewValueChange = (id, v) => store.setState(s => ({ p4ListNewValueInputs: { ...s.p4ListNewValueInputs, [id]: v } }));
  store.p4AddListValue = (id) => store.setState(s => {
    const v = (s.p4ListNewValueInputs[id] || '').trim();
    if (!v) return {};
    return { p4Lists: s.p4Lists.map(l => l.id === id ? { ...l, values: [...l.values, { name: v, usage: 0, active: true }] } : l), p4ListNewValueInputs: { ...s.p4ListNewValueInputs, [id]: '' } };
  });
  store.p4OnListValueName = (listId, idx, v) => store.setState(s => ({ p4Lists: s.p4Lists.map(l => l.id === listId ? { ...l, values: l.values.map((val, i) => i === idx ? { ...val, name: v } : val) } : l) }));
  store.p4ToggleListValue = (listId, idx) => store.setRowUI('listDeactivate', listId + ':' + idx, { open: true });
  store.p4CancelListDeactivate = (listId, idx) => store.setRowUI('listDeactivate', listId + ':' + idx, { open: false });
  store.p4ConfirmListDeactivate = (listId, idx) => { store.setState(s => ({ p4Lists: s.p4Lists.map(l => l.id === listId ? { ...l, values: l.values.map((val, i) => i === idx ? { ...val, active: !val.active } : val) } : l) })); store.setRowUI('listDeactivate', listId + ':' + idx, { open: false }); };

  store.p4OnTagFilterChange = (e) => store.setState({ p4TagFilter: e.target.value });
  store.p4OnTagNameChange = (name, v) => store.setState(s => ({ p4Tags: s.p4Tags.map(t => t.name === name ? { ...t, name: v } : t) }));
  store.p4TagMergeOpenToggle = (name) => store.setState(s => ({ p4TagMergeOpenName: s.p4TagMergeOpenName === name ? null : name, p4TagMergeTarget: '' }));
  store.p4TagMergeTargetChange = (v) => store.setState({ p4TagMergeTarget: v });
  store.p4TagMergeConfirm = (name) => store.setState(s => {
    const target = s.p4TagMergeTarget;
    if (!target) return {};
    const merged = s.p4Tags.find(t => t.name === name);
    return { p4Tags: s.p4Tags.filter(t => t.name !== name).map(t => t.name === target ? { ...t, usage: t.usage + (merged ? merged.usage : 0) } : t), p4TagMergeOpenName: null, p4TagMergeTarget: '' };
  });
  store.p4TagDeactivate = (name) => store.setState(s => ({ p4Tags: s.p4Tags.map(t => t.name === name ? { ...t, active: false } : t) }));

  store.p4OnLogActionTypeChange = (v) => store.setState({ p4LogActionType: v });
  store.p4OnLogUserChange = (v) => store.setState({ p4LogUser: v });
  store.p4OnLogItemChange = (e) => store.setState({ p4LogItem: e.target.value });
  store.p4ClearLogFilters = () => store.setState({ p4LogActionType: '', p4LogUser: '', p4LogItem: '' });

  store.p4GateSetValue = (id, v) => store.setState(s => ({ p4GateRules: s.p4GateRules.map(r => r.id === id ? { ...r, requiredValue: v } : r) }));
  store.p4GateSetFailureMsg = (id, v) => store.setState(s => ({ p4GateRules: s.p4GateRules.map(r => r.id === id ? { ...r, failureMsg: v } : r) }));
  store.p4GateToggle = (id) => store.setState(s => {
    const activeCount = s.p4GateRules.filter(r => r.active).length;
    const rule = s.p4GateRules.find(r => r.id === id);
    if (rule.active && activeCount <= 1) return {};
    return { p4GateRules: s.p4GateRules.map(r => r.id === id ? { ...r, active: !r.active } : r) };
  });
}
