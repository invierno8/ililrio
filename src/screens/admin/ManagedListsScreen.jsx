import React from 'react';
import { Button, Checkbox, Select } from '../../design-system/index.js';
/** רשימות מנוהלות ואוצר התגיות (P4). */
export default function ManagedListsScreen({ v }) {
  const {
    inputPlainStyle, isP4ManagedListsScreen, isP4TabTags, isP4TabValues, p4ListNames, p4ListNewValueInput,
    p4ListNewValueOnAdd, p4ListNewValueOnChange, p4ListRows, p4ListValuesEmpty, p4OnTagFilterChange,
    p4SelectedListGap, p4SelectedListHasGap, p4SelectedListName, p4SetTabTags, p4SetTabValues,
    p4TabTagsStyle, p4TabValuesStyle, p4TagFilter, p4TagRows, p4TagsCountText, thStyle,
  } = v;
  return (
    <>
      {/* P4: MANAGED LISTS */}
      {isP4ManagedListsScreen && (<>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>רשימות מנוהלות</div>
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
            <button onClick={p4SetTabValues} style={p4TabValuesStyle}>רשימות ערכים</button>
            <button onClick={p4SetTabTags} style={p4TabTagsStyle}>אוצר תגיות</button>
          </div>

          {isP4TabValues && (<>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
              <div style={{ width: '200px', flexShrink: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {(p4ListNames || []).map((l, lIdx) => (<React.Fragment key={lIdx}>
                  <div onClick={l.onClick} style={l.rowStyle}>
                    <div>{l.name}</div>
                    {l.hasGap && (<><div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{l.gap}</div></>)}
                  </div>
                </React.Fragment>))}
              </div>
              <div style={{ flex: '1 1 auto', minWidth: '0' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>{p4SelectedListName}</div>
                {p4SelectedListHasGap && (<><div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>{p4SelectedListGap}</div></>)}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '420px' }}>
                  <div style={{ flex: '1 1 auto' }}><input value={p4ListNewValueInput} onChange={p4ListNewValueOnChange} placeholder="ערך חדש..." style={inputPlainStyle} /></div>
                  <Button variant="secondary" size="sm" onClick={p4ListNewValueOnAdd}>+ הוסף ערך</Button>
                </div>
                {p4ListValuesEmpty && (<><div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>אין ערכים ברשימה זו עדיין.</div></>)}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                    <th style={thStyle}>ערך</th>
                    <th style={thStyle}>שימוש</th>
                    <th style={thStyle}>פעיל</th>
                  </tr></thead>
                  {(p4ListRows || []).map((v, vIdx) => (<React.Fragment key={vIdx}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 14px' }}><input value={v.name} onChange={v.onNameChange} style={inputPlainStyle} /></td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{v.usage} פריטים</td>
                        <td style={{ padding: '12px 14px' }}><Checkbox checked={v.active} onChange={v.onToggle} size="sm" /></td>
                      </tr>
                      {v.deactivateConfirmOpen && (<>
                        <tr><td colSpan="3" style={{ padding: '0 14px 12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ fontSize: '12px' }}>שינוי הפעילות לא ישנה פריטים קיימים ({v.usage} בשימוש). להמשיך?</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Button variant="secondary" size="sm" onClick={v.onCancelDeactivate}>ביטול</Button>
                              <Button variant="primary" size="sm" onClick={v.onConfirmDeactivate}>אשר</Button>
                            </div>
                          </div>
                        </td></tr>
                      </>)}
                    </tbody>
                  </React.Fragment>))}
                </table>
              </div>
            </div>
          </>)}

          {isP4TabTags && (<>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
              <div style={{ maxWidth: '280px', flex: '1 1 auto' }}><input value={p4TagFilter} onChange={p4OnTagFilterChange} placeholder="סנן לפי שם תגית..." style={inputPlainStyle} /></div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p4TagsCountText}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th style={thStyle}>תגית</th>
                <th style={thStyle}>שימוש</th>
                <th style={thStyle}>סטטוס</th>
                <th style={thStyle}></th>
              </tr></thead>
              {(p4TagRows || []).map((t, tIdx) => (<React.Fragment key={tIdx}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 14px' }}><input value={t.name} onChange={t.onNameChange} style={inputPlainStyle} /></td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{t.usage} פריטים</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{t.statusLabel}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button variant="secondary" size="sm" onClick={t.onMergeClick}>מזג לתגית אחרת</Button>
                        {t.canDeactivate && (<><Button variant="secondary" size="sm" onClick={t.onDeactivate}>כבה</Button></>)}
                      </div>
                    </td>
                  </tr>
                  {t.mergeOpen && (<>
                    <tr><td colSpan="4" style={{ padding: '14px', background: 'var(--surface)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '420px' }}>
                        <Select options={t.mergeTargetOptions} value={t.mergeTarget} onChange={t.onMergeTargetChange} placeholder="בחר תגית מטרה" size="sm" />
                        {t.hasMergeTarget && (<><div style={{ fontSize: '12.5px' }}>מיזוג {t.name} לתוך {t.mergeTarget}. פעולה זו אינה הפיכה.</div></>)}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" size="sm" onClick={t.onMergeCancel}>ביטול</Button>
                          <Button variant="primary" size="sm" onClick={t.onMergeConfirm} disabled={t.mergeConfirmDisabled}>אשר מיזוג</Button>
                        </div>
                      </div>
                    </td></tr>
                  </>)}
                </tbody>
              </React.Fragment>))}
            </table>
          </>)}
        </div>
      </>)}
    </>
  );
}