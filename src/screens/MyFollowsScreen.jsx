import React from 'react';
import { Badge, Button, Checkbox, Input, Select } from '../design-system/index.js';
import { hostPositionStyle } from '../lib/hostStyle.js';
/** המעקבים שלי: כל הפריטים שהמשתמש הביע בהם עניין. */
export default function MyFollowsScreen({ v }) {
  const {
    bodyPillSmallStyle, cancelEditFollow, classificationOptions, dangerBtnStyle, dangerFilledBtnStyle,
    fieldErrorStyle, followEditClassificationError, followEditForm, followEditNeedError, followHeaderDateLabel,
    followHeaderNameLabel, followHeaderStatusLabel, followOnSortDate, followOnSortName, followOnSortStatus,
    followRows, followsCountLabel, followsEmpty, followsNotEmpty, isMyFollowsScreen, onFollowEditClassificationChange,
    onFollowEditNeedChange, onFollowEditNotesChange, onFollowEditPhoneChange, saveEditFollow,
    textareaStyle, thStyle, toggleFollowEditReady,
  } = v;
  return (
    <>
      {/* MY FOLLOWS */}
      {isMyFollowsScreen && (<>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{followsCountLabel}</span>
          </div>
          {followsEmpty && (
            <div style={{ padding: '60px 0', textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)' }}>לא הבעת עניין באף פריט עדיין.</div>
          )}
          {followsNotEmpty && (<>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th onClick={followOnSortName} style={thStyle}>{followHeaderNameLabel}</th>
                <th onClick={followOnSortStatus} style={thStyle}>{followHeaderStatusLabel}</th>
                <th onClick={followOnSortDate} style={thStyle}>{followHeaderDateLabel}</th>
                <th style={thStyle}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {(followRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                <tr style={row.rowWrapStyle}>
                  <td style={{ padding: '14px', verticalAlign: 'top' }}>
                    {row.hasLink && (
                      <a onClick={row.onOpen} style={{ fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}>{row.name}</a>
                    )}
                    {row.noLink && (
                      <div style={{ fontSize: '13.5px', fontWeight: '700' }}>{row.name}</div>
                    )}
                    <div style={{ marginTop: '4px' }}><span style={bodyPillSmallStyle}>{row.body}</span></div>
                  </td>
                  <td style={{ padding: '14px', verticalAlign: 'top' }}><Badge variant={row.badgeVariant} size="sm">{row.statusLabel}</Badge></td>
                  <td style={{ padding: '14px', verticalAlign: 'top', fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}><bdi dir="ltr">{row.date}</bdi></td>
                  <td style={{ padding: '14px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: '0' }}>
                      {row.showEdit && (
                        <Button variant="secondary" size="sm" onClick={row.onEdit}>ערוך</Button>
                      )}
                      {row.showUpdate && (
                        <Button variant="secondary" size="sm" disabled={true} title="פעולה זו טרם הוגדרה">עדכן</Button>
                      )}
                      <span className="sc-host-x" style={hostPositionStyle(dangerBtnStyle)}><Button variant="secondary" size="sm" onClick={row.onRemoveClick}>הסר</Button></span>
                    </div>
                  </td>
                </tr>
                {row.removeConfirmOpen && (<>
                  <tr>
                    <td colSpan="4" style={{ padding: '0 14px 16px 14px' }}>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <span style={{ fontSize: '12.5px' }}>הסרת הבעת העניין תמחק את הרשומה. להמשיך?</span>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: '0' }}>
                          <Button variant="secondary" size="sm" onClick={row.onRemoveCancel}>ביטול</Button>
                          <span className="sc-host-x" style={hostPositionStyle(dangerFilledBtnStyle)}><Button variant="secondary" size="sm" onClick={row.onRemoveConfirm}>הסר</Button></span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>)}
                {row.editOpen && (<>
                  <tr>
                    <td colSpan="4" style={{ padding: '0 14px 18px 14px' }}>
                      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>הצורך המבצעי <span style={{ color: 'var(--tw-red-600)' }}>*</span></label>
                          <textarea value={followEditForm.need} onChange={onFollowEditNeedChange} style={textareaStyle}></textarea>
                          {followEditNeedError && (<><div style={fieldErrorStyle}>{followEditNeedError}</div></>)}
                        </div>
                        <Select label="סיווג ההצהרה *" hint="הצעה · ממצא 1" options={classificationOptions} value={followEditForm.classification} onChange={onFollowEditClassificationChange} placeholder="בחר רמת סיווג" error={followEditClassificationError} size="sm" />
                        <div style={{ maxWidth: '280px' }}>
                          <Input label="טלפון ליצירת קשר" value={followEditForm.phone} onChange={onFollowEditPhoneChange} size="sm" />
                        </div>
                        <Checkbox checked={followEditForm.readyForTrials} onChange={toggleFollowEditReady} label="יחידתי מוכנה להשתלב בניסוי או בבדיקת שדה" size="sm" />
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>הערות ואינפוט</label>
                          <textarea value={followEditForm.notes} onChange={onFollowEditNotesChange} style={textareaStyle}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="primary" size="sm" onClick={saveEditFollow}>שמור</Button>
                          <Button variant="secondary" size="sm" onClick={cancelEditFollow}>ביטול</Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>)}
              </React.Fragment>))}
            </tbody>
          </table>
          </>)}
        </div>
      </>)}
    </>
  );
}