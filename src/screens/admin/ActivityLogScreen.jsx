import React from 'react';
import { Badge, Select } from '../../design-system/index.js';
/** יומן הפעולות (P4). */
export default function ActivityLogScreen({ v }) {
  const {
    inputPlainStyle, isP4LogScreen, p4ClearLogFilters, p4HasLogFilters, p4LogActionOptions,
    p4LogActionType, p4LogEmpty, p4LogItem, p4LogRows, p4LogUser, p4LogUserOptions, p4OnLogActionTypeChange,
    p4OnLogItemChange, p4OnLogUserChange, thStyle,
  } = v;
  return (
    <>
      {/* P4: ACTIVITY LOG */}
      {isP4LogScreen && (<>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>יומן פעולות</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ width: '180px' }}><Select options={p4LogActionOptions} value={p4LogActionType} onChange={p4OnLogActionTypeChange} placeholder="כל הפעולות" size="sm" /></div>
            <div style={{ width: '200px' }}><Select options={p4LogUserOptions} value={p4LogUser} onChange={p4OnLogUserChange} placeholder="כל המשתמשים" size="sm" /></div>
            <div style={{ width: '200px' }}><input value={p4LogItem} onChange={p4OnLogItemChange} placeholder="חיפוש בפריט..." style={inputPlainStyle} /></div>
            {p4HasLogFilters && (<><a onClick={p4ClearLogFilters} style={{ fontSize: '12.5px', cursor: 'pointer', color: 'var(--text-muted)' }}>נקה סינונים</a></>)}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
              <th style={thStyle}>תאריך ושעה</th>
              <th style={thStyle}>משתמש מבצע</th>
              <th style={thStyle}>פעולה</th>
              <th style={thStyle}>פריט</th>
              <th style={thStyle}>תוצאה</th>
            </tr></thead>
            <tbody>
              {(p4LogRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.dateTime}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600' }}>{row.user}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px' }}>{row.action}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>{row.entity}</td>
                  <td style={{ padding: '12px 14px' }}><Badge variant={row.resultVariant} size="sm">{row.result}</Badge></td>
                </tr>
              </React.Fragment>))}
            </tbody>
          </table>
          {p4LogEmpty && (<><div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין פעולות התואמות לסינון.</div></>)}
        </div>
      </>)}
    </>
  );
}