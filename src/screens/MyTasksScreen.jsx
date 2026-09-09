import React from 'react';
import { Button } from '../design-system/index.js';
/** המשימות שלי (P3): תזכורות רענון, טיוטות ופריטים שהוחזרו. */
export default function MyTasksScreen({ v }) {
  const {
    draftRows, draftsEmpty, isMyTasksDrafts, isMyTasksReminders, isMyTasksReturned, isMyTasksScreen,
    myTasksTabDraftsStyle, myTasksTabRemindersStyle, myTasksTabReturnedStyle, openItemFormNew,
    reminderRows, remindersEmpty, returnedEmptyP3, returnedRowsP3, setMyTasksTabDrafts, setMyTasksTabReminders,
    setMyTasksTabReturned, thStyle,
  } = v;
  return (
    <>
      {/* MY TASKS (P3) */}
      {isMyTasksScreen && (<>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700' }}>המשימות שלי</div>
            <Button variant="primary" size="sm" onClick={openItemFormNew}>+ פריט חדש</Button>
          </div>
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
            <button onClick={setMyTasksTabReminders} style={myTasksTabRemindersStyle}>תזכורות רענון</button>
            <button onClick={setMyTasksTabDrafts} style={myTasksTabDraftsStyle}>טיוטות</button>
            <button onClick={setMyTasksTabReturned} style={myTasksTabReturnedStyle}>הוחזרו לתיקון</button>
          </div>

          {isMyTasksReminders && (<>
            {remindersEmpty && (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין תזכורות רענון פתוחות.</div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th style={thStyle}>שם הפריט</th>
                <th style={thStyle}>קצב רענון</th>
                <th style={thStyle}>תזכורת מ-</th>
                <th style={thStyle}>פעולות</th>
              </tr></thead>
              {(reminderRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px' }}><a onClick={row.onOpen} style={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>{row.name}</a></td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.refreshRate}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--tw-amber-700)' }}>{row.overdueDate}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" size="sm" onClick={row.onReviewed}>נבדק, אין שינוי</Button>
                        <Button variant="secondary" size="sm" onClick={row.onTransferToggle}>העבר לבעל הפריט</Button>
                      </div>
                    </td>
                  </tr>
                  {row.confirmOpen && (<>
                    <tr><td colSpan="4" style={{ padding: '0 14px 16px 14px' }}>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <span style={{ fontSize: '12.5px' }}>העברת הטיפול בתזכורת לבעל הפריט. להמשיך?</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" size="sm" onClick={row.onTransferCancel}>ביטול</Button>
                          <Button variant="primary" size="sm" onClick={row.onTransferConfirm}>אשר</Button>
                        </div>
                      </div>
                    </td></tr>
                  </>)}
                </tbody>
              </React.Fragment>))}
            </table>
          </>)}

          {isMyTasksDrafts && (<>
            {draftsEmpty && (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין טיוטות פתוחות.</div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th style={thStyle}>שם הפריט</th>
                <th style={thStyle}>נוצר</th>
                <th style={thStyle}>נשמר לאחרונה</th>
                <th style={thStyle}>מקור</th>
                <th style={thStyle}>פעולות</th>
              </tr></thead>
              <tbody>
                {(draftRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={row.nameStyle}>{row.name}</div>
                      {row.hasMissing && (<><div style={{ fontSize: '12px', color: 'var(--tw-amber-700)', marginTop: '2px' }}>חסרים {row.missingCount} שדות חובה</div></>)}
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.created}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.lastSaved}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.source}</td>
                    <td style={{ padding: '14px' }}><Button variant="secondary" size="sm" onClick={row.onContinue}>המשך הזנה</Button></td>
                  </tr>
                </React.Fragment>))}
              </tbody>
            </table>
          </>)}

          {isMyTasksReturned && (<>
            {returnedEmptyP3 && (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין פריטים שהוחזרו לתיקון.</div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th style={thStyle}>שם הפריט</th>
                <th style={thStyle}>הוחזר על ידי</th>
                <th style={thStyle}>עודכן</th>
                <th style={thStyle}>הערה</th>
                <th style={thStyle}>פעולות</th>
              </tr></thead>
              <tbody>
                {(returnedRowsP3 || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px' }}><a onClick={row.onOpen} style={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>{row.name}</a></td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.returnedBy}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.returnDate}</td>
                    <td style={{ padding: '14px', fontSize: '12.5px' }}>{row.note}</td>
                    <td style={{ padding: '14px' }}><Button variant="secondary" size="sm" onClick={row.onContinue}>ערוך ושלח שוב</Button></td>
                  </tr>
                </React.Fragment>))}
              </tbody>
            </table>
          </>)}
        </div>
      </>)}
    </>
  );
}