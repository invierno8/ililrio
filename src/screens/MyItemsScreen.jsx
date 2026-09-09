import React from 'react';
import { Badge, Button, Checkbox } from '../design-system/index.js';
/** הפריטים שלי (P2): פריטים, הבעות עניין וממתינים לאישור. */
export default function MyItemsScreen({ v }) {
  const {
    backToInterestList, bodyPillSmallStyle, fieldErrorStyle, interestListHeaderCountLabel,
    interestListHeaderNameLabel, interestListHeaderStatusLabel, interestListOnSortCount, interestListOnSortName,
    interestListOnSortStatus, interestedItemsList, interestedItemsListEmpty, isMyItemsInterestTab,
    isMyItemsItemsTab, isMyItemsPendingTab, isMyItemsScreen, isWhoInterestedDetail, isWhoInterestedList,
    myItemsCountLabel, myItemsEmpty, myItemsHeaderNameLabel, myItemsHeaderStatusLabel, myItemsHeaderUpdatedLabel,
    myItemsOnSortName, myItemsOnSortStatus, myItemsOnSortUpdated, myItemsRows, myItemsTabInterestStyle,
    myItemsTabItemsStyle, myItemsTabPendingStyle, pendingCountSuffix, pendingEmpty, pendingHeaderDateLabel,
    pendingHeaderNameLabel, pendingHeaderSubmitterLabel, pendingOnSortDate, pendingOnSortName,
    pendingOnSortSubmitter, pendingRows, setMyItemsTabInterest, setMyItemsTabItems, setMyItemsTabPending,
    textareaStyle, thStyle, toggleWhoReadyOnly, whoItem, whoReadyOnly, whoRows, whoRowsEmpty,
    whoStats, whoSummaryLine,
  } = v;
  return (
    <>
      {/* MY ITEMS (P2) */}
      {isMyItemsScreen && (<>
        <div>
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
            <button onClick={setMyItemsTabItems} style={myItemsTabItemsStyle}>הפריטים שלי</button>
            <button onClick={setMyItemsTabInterest} style={myItemsTabInterestStyle}>הבעות עניין</button>
            <button onClick={setMyItemsTabPending} style={myItemsTabPendingStyle}>ממתין לאישורי{pendingCountSuffix}</button>
          </div>

          {isMyItemsItemsTab && (<>
            <div style={{ marginBottom: '14px', fontSize: '13px', color: 'var(--text-secondary)' }}>{myItemsCountLabel}</div>
            {myItemsEmpty && (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין פריטים המשויכים אליך עדיין.</div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th onClick={myItemsOnSortName} style={thStyle}>{myItemsHeaderNameLabel}</th>
                <th onClick={myItemsOnSortStatus} style={thStyle}>{myItemsHeaderStatusLabel}</th>
                <th onClick={myItemsOnSortUpdated} style={thStyle}>{myItemsHeaderUpdatedLabel}</th>
                <th style={thStyle}>פעולות</th>
              </tr></thead>
              <tbody>
                {(myItemsRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px' }}>
                      <a onClick={row.onOpen} style={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-block', marginBottom: '3px' }}>{row.name}</a>
                      <div><span style={bodyPillSmallStyle}>{row.body}</span></div>
                    </td>
                    <td style={{ padding: '14px' }}><Badge variant={row.statusVariant} size="sm">{row.status}</Badge></td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.updated}</div>
                      {row.reminderOverdue && (<><div style={{ fontSize: '11px', color: 'var(--tw-amber-700)', marginTop: '2px' }}>תזכורת לא נענתה</div></>)}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" size="sm" onClick={row.onOpen}>תצוגה מקדימה</Button>
                        <Button variant="secondary" size="sm" onClick={row.onWhoInterested}>מי מתעניין ({row.interestedCount})</Button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>))}
              </tbody>
            </table>
          </>)}

          {isMyItemsInterestTab && (<>
            {isWhoInterestedList && (<>
              {interestedItemsListEmpty && (
                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין עדיין פריטים עם הבעות עניין.</div>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                  <th onClick={interestListOnSortName} style={thStyle}>{interestListHeaderNameLabel}</th>
                  <th onClick={interestListOnSortStatus} style={thStyle}>{interestListHeaderStatusLabel}</th>
                  <th onClick={interestListOnSortCount} style={thStyle}>{interestListHeaderCountLabel}</th>
                </tr></thead>
                <tbody>
                  {(interestedItemsList || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                    <tr onClick={row.onOpen} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                      <td style={{ padding: '14px', fontSize: '14px', fontWeight: '700' }}>{row.name}</td>
                      <td style={{ padding: '14px' }}><Badge variant={row.statusVariant} size="sm">{row.status}</Badge></td>
                      <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600' }}>{row.interestedCount} מתעניינים</td>
                    </tr>
                  </React.Fragment>))}
                </tbody>
              </table>
            </>)}

            {isWhoInterestedDetail && (<>
              <a onClick={backToInterestList} style={{ fontSize: '12.5px', cursor: 'pointer', display: 'inline-block', marginBottom: '16px' }}>← חזרה לרשימת הפריטים</a>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '700' }}>{whoItem.name}</div>
                  <Badge variant={whoItem.statusVariant} size="sm">{whoItem.status}</Badge>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>מציג רק הבעות עניין בתוך רמת הסיווג שלך</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>{whoSummaryLine}</div>
                <Checkbox checked={whoReadyOnly} onChange={toggleWhoReadyOnly} label="מוכנים לבדיקות בלבד" size="sm" />
              </div>
              {whoRowsEmpty && (
                <div style={{ padding: '30px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין גורמים מתאימים לסינון שנבחר.</div>
              )}
              {(whoRows || []).map((p, pIdx) => (<React.Fragment key={pIdx}>
                <div style={{ borderBottom: '1px solid var(--border)', padding: '14px 4px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: '1 1 0', minWidth: '0' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{p.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}> · {p.role}</span>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{p.unit}</div>
                  </div>
                  <div style={{ width: '100px', flexShrink: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>{p.date}</div>
                  <div style={{ width: '170px', flexShrink: '0' }}><a href={p.mailto} style={{ fontSize: '12px' }}>{p.email}</a></div>
                  <div onClick={p.onToggleNeed} style={{ flex: '1 1 0', minWidth: '0', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', cursor: 'pointer', whiteSpace: '{{ p.needExpanded }}' }}>{p.need}</div>
                  <div style={{ width: '110px', flexShrink: '0' }}>
                    {p.ready && (<><Badge variant="success" size="sm">מוכנ/ה לבדיקות</Badge></>)}
                  </div>
                </div>
              </React.Fragment>))}
              <div style={{ marginTop: '22px', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                {(whoStats || []).map((stat, statIdx) => (<React.Fragment key={statIdx}>
                  <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>{stat}</div>
                </React.Fragment>))}
              </div>
            </>)}
          </>)}

          {isMyItemsPendingTab && (<>
            {pendingEmpty && (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>אין בקשות הממתינות לאישורך.</div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th onClick={pendingOnSortName} style={thStyle}>{pendingHeaderNameLabel}</th>
                <th onClick={pendingOnSortSubmitter} style={thStyle}>{pendingHeaderSubmitterLabel}</th>
                <th onClick={pendingOnSortDate} style={thStyle}>{pendingHeaderDateLabel}</th>
                <th style={thStyle}>סטטוס</th>
                <th style={thStyle}>פעולות</th>
              </tr></thead>
              {(pendingRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px' }}><a onClick={row.onPreview} style={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>{row.name}</a></td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.submitter}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.date}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.waitingLabel}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" size="sm" onClick={row.onPreview}>תצוגה מקדימה</Button>
                        <Button variant="secondary" size="sm" onClick={row.onReturnToggle}>החזר עם הערה</Button>
                        <Button variant="primary" size="sm" onClick={row.onApproveClick}>אשר</Button>
                      </div>
                    </td>
                  </tr>
                  {row.confirmOpen && (<>
                    <tr><td colSpan="5" style={{ padding: '0 14px 16px 14px' }}>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <span style={{ fontSize: '12.5px' }}>לחיצה על אישור תפרסם את הפריט ותחתום עליו בשמך. להמשיך?</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" size="sm" onClick={row.onApproveCancel}>ביטול</Button>
                          <Button variant="primary" size="sm" onClick={row.onApproveConfirm}>אשר ופרסם</Button>
                        </div>
                      </div>
                    </td></tr>
                  </>)}
                  {row.noteOpen && (<>
                    <tr><td colSpan="5" style={{ padding: '0 14px 16px 14px' }}>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <textarea value={row.noteText} onChange={row.onNoteChange} placeholder="הוסיפו הערה להחזרה..." style={textareaStyle}></textarea>
                        {row.noteError && (<><div style={fieldErrorStyle}>יש להוסיף הערה לפני החזרה</div></>)}
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <Button variant="secondary" size="sm" onClick={row.onReturnToggle}>ביטול</Button>
                          <Button variant="primary" size="sm" onClick={row.onNoteSubmit}>שלח החזרה</Button>
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