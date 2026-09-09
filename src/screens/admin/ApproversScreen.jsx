import React from 'react';
import { Button, Select } from '../../design-system/index.js';
/** קבוצת המאשרים (P4). */
export default function ApproversScreen({ v }) {
  const {
    bodyPillSmallStyle, isP4ApproversScreen, p4ApproverAddOpen, p4ApproverAddOptions, p4ApproverAddSelect,
    p4ApproverEmpty, p4ApproverRows, p4CancelApproverAdd, p4OpenApproverAdd, thStyle,
  } = v;
  return (
    <>
      {/* P4: APPROVERS GROUP */}
      {isP4ApproversScreen && (<>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700' }}>קבוצת המאשרים</div>
            <Button variant="secondary" size="sm" onClick={p4OpenApproverAdd}>+ הוסף חבר</Button>
          </div>

          {p4ApproverAddOpen && (<>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '16px 18px', marginBottom: '20px', background: 'var(--surface)', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 auto', maxWidth: '320px' }}><Select label="בחר משתמש להוספה" options={p4ApproverAddOptions} value="" onChange={p4ApproverAddSelect} placeholder="בחר משתמש" size="sm" /></div>
              <Button variant="secondary" size="sm" onClick={p4CancelApproverAdd}>ביטול</Button>
            </div>
          </>)}

          {p4ApproverEmpty && (
            <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)' }}>אין חברים בקבוצת המאשרים. לא ניתן לנתב תוכן לאישור.</div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
              <th style={thStyle}>שם</th>
              <th style={thStyle}>תפקיד</th>
              <th style={thStyle}>מאשר עבור</th>
              <th style={thStyle}></th>
            </tr></thead>
            {(p4ApproverRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px' }}><a onClick={row.onOpenDetail} style={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>{row.name}</a></td>
                  <td style={{ padding: '14px' }}><span style={bodyPillSmallStyle}>{row.role}</span></td>
                  <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.forLabel}</td>
                  <td style={{ padding: '14px' }}><Button variant="secondary" size="sm" onClick={row.onRemoveClick}>הסר מהקבוצה</Button></td>
                </tr>
                {row.removeConfirmOpen && (<>
                  <tr><td colSpan="4" style={{ padding: '0 14px 16px 14px' }}>
                    {row.hasDependentsForRemoval && (<>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '12.5px', marginBottom: '10px' }}>לא ניתן להסיר — {row.name} הוא מאשר התוכן של {row.forCount} משתמשים. שנה את ניתוב המאשר שלהם תחילה.</div>
                        <Button variant="secondary" size="sm" onClick={row.onRemoveCancel}>סגור</Button>
                      </div>
                    </>)}
                    {row.noDependentsForRemoval && (<>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <span style={{ fontSize: '12.5px' }}>הסרת {row.name} מקבוצת המאשרים. להמשיך?</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" size="sm" onClick={row.onRemoveCancel}>ביטול</Button>
                          <Button variant="primary" size="sm" onClick={row.onRemoveConfirm}>הסר</Button>
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