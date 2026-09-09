import React from 'react';
import { Badge, Button, Checkbox, Input, Select } from '../../design-system/index.js';
/** ניהול משתמשים (P4). */
export default function UsersScreen({ v }) {
  const {
    bodyPillSmallStyle, classificationOptions, isP4UsersScreen, p4ApproverFieldLabel, p4ApproverOptionsForForm,
    p4BodyOptionsForForm, p4CancelUsersForm, p4OnUserFormApproverIdChange, p4OnUserFormBodyChange,
    p4OnUserFormClassificationChange, p4OnUserFormDirectPublishToggle, p4OnUserFormEmailChange,
    p4OnUserFormIsApproverToggle, p4OnUserFormNameChange, p4OnUserFormOrgIdChange, p4OnUserFormPermissionChange,
    p4OnUserFormPhoneChange, p4OnUserFormRoleChange, p4OpenUsersCreate, p4PermissionOptions,
    p4SaveUserForm, p4UserForm, p4UserFormIsOwner, p4UserFormNotOwner, p4UserFormOpen, p4UserFormTitle,
    p4UserRows, p4UsersCountText, thStyle,
  } = v;
  return (
    <>
      {/* P4: USERS */}
      {isP4UsersScreen && (<>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700' }}>משתמשים</div>
            <Button variant="primary" size="sm" onClick={p4OpenUsersCreate}>+ משתמש חדש</Button>
          </div>
          <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{p4UsersCountText}</div>

          {p4UserFormOpen && (<>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '20px 22px', marginBottom: '20px', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>{p4UserFormTitle}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>זיהוי</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <Input label="שם המשתמש" required={true} value={p4UserForm.name} onChange={p4OnUserFormNameChange} error={p4UserForm.errors.name} size="sm" />
                <Input label="מזהה ארגוני" required={true} value={p4UserForm.orgId} onChange={p4OnUserFormOrgIdChange} error={p4UserForm.errors.orgId} size="sm" />
                <Input label="תפקיד ארגוני" required={true} value={p4UserForm.role} onChange={p4OnUserFormRoleChange} error={p4UserForm.errors.role} size="sm" />
                <Select label="שיוך לגוף *" options={p4BodyOptionsForForm} value={p4UserForm.body} onChange={p4OnUserFormBodyChange} placeholder="בחר גוף" error={p4UserForm.errors.body} size="sm" />
                <Input label="כתובת מייל" required={true} value={p4UserForm.email} onChange={p4OnUserFormEmailChange} error={p4UserForm.errors.email} size="sm" />
                <Input label="טלפון" value={p4UserForm.phone} onChange={p4OnUserFormPhoneChange} size="sm" />
              </div>

              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>הרשאה</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <Select label="הרשאת מערכת *" options={p4PermissionOptions} value={p4UserForm.permission} onChange={p4OnUserFormPermissionChange} placeholder="בחר הרשאה" error={p4UserForm.errors.permission} size="sm" />
                <Select label="רמת סיווג *" options={classificationOptions} value={p4UserForm.classification} onChange={p4OnUserFormClassificationChange} placeholder="בחר רמת סיווג" hint="הצעה · ממצא 1" size="sm" />
              </div>

              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>פרסום</div>
              {p4UserFormIsOwner && (
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>בעלי פריטים מתווספים אוטומטית לקבוצת המאשרים</div>
              )}
              {p4UserFormNotOwner && (<>
                <div style={{ marginBottom: '12px' }}><Checkbox checked={p4UserForm.directPublish} onChange={p4OnUserFormDirectPublishToggle} label="המשתמש מפרסם ישירות ללא אישור" size="sm" /></div>
                <div style={{ maxWidth: '320px', marginBottom: '12px' }}><Select label={p4ApproverFieldLabel} options={p4ApproverOptionsForForm} value={p4UserForm.approverId} onChange={p4OnUserFormApproverIdChange} placeholder="בחר מאשר" error={p4UserForm.errors.approverId} size="sm" /></div>
                <div style={{ marginBottom: '14px' }}><Checkbox checked={p4UserForm.isApprover} onChange={p4OnUserFormIsApproverToggle} label="חבר בקבוצת המאשרים" size="sm" /></div>
              </>)}

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="primary" size="sm" onClick={p4SaveUserForm}>שמור</Button>
                <Button variant="secondary" size="sm" onClick={p4CancelUsersForm}>ביטול</Button>
              </div>
            </div>
          </>)}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
              <th style={thStyle}>שם</th>
              <th style={thStyle}>מזהה ארגוני</th>
              <th style={thStyle}>גוף</th>
              <th style={thStyle}>סטטוס</th>
              <th style={thStyle}>פעולות</th>
            </tr></thead>
            {(p4UserRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>{row.name}</span>
                      <span style={bodyPillSmallStyle}>{row.role}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}><bdi dir="ltr">{row.orgId}</bdi></td>
                  <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.body}</td>
                  <td style={{ padding: '14px' }}><Badge variant={row.statusVariant} size="sm">{row.statusLabel}</Badge></td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" size="sm" onClick={row.onEdit}>ערוך</Button>
                      {row.isActive && (<><Button variant="secondary" size="sm" onClick={row.onDisableClick}>השבת</Button></>)}
                      {row.isDisabled && (<><Button variant="secondary" size="sm" onClick={row.onEnable}>הפעל מחדש</Button></>)}
                    </div>
                  </td>
                </tr>
                {row.disableConfirmOpen && (<>
                  <tr><td colSpan="5" style={{ padding: '0 14px 16px 14px' }}>
                    {row.hasDependents && (<>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>לא ניתן להשבית — קיימות תלויות פתוחות:</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>מאשר תוכן עבור: {row.dependentsText}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <a onClick={row.onGoTransfer} style={{ fontSize: '12.5px', cursor: 'pointer' }}>בצע העברת תפקיד תחילה</a>
                          <Button variant="secondary" size="sm" onClick={row.onDisableCancel}>סגור</Button>
                        </div>
                      </div>
                    </>)}
                    {row.noDependents && (<>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <span style={{ fontSize: '12.5px' }}>השבתת {row.name} תמנע ממנו כניסה למערכת. להמשיך?</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" size="sm" onClick={row.onDisableCancel}>ביטול</Button>
                          <Button variant="primary" size="sm" onClick={row.onDisableConfirm}>השבת</Button>
                        </div>
                      </div>
                    </>)}
                  </td></tr>
                </>)}
              </tbody>
            </React.Fragment>))}
          </table>
        </div>
      </>)}
    </>
  );
}