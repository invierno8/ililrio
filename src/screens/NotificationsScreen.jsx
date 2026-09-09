import React from 'react';
/** מרכז ההתראות. */
export default function NotificationsScreen({ v }) {
  const {
    isNotificationsScreen, markAllNotifsRead, notifFlatRows, notifHeaderDateLabel, notifHeaderTextLabel,
    notifHeaderTypeLabel, notifOnSortDate, notifOnSortText, notifOnSortType, notificationsEmpty,
    notificationsNotEmpty, thStyle, unreadCountLabel,
  } = v;
  return (
    <>
      {/* NOTIFICATIONS */}
      {isNotificationsScreen && (<>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{unreadCountLabel}</span>
            <a onClick={markAllNotifsRead} style={{ fontSize: '12.5px', cursor: 'pointer' }}>סמן הכל כנקרא</a>
          </div>
          {notificationsEmpty && (
            <div style={{ padding: '60px 0', textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)' }}>אין התראות חדשות.</div>
          )}
          {notificationsNotEmpty && (<>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th onClick={notifOnSortText} style={thStyle}>{notifHeaderTextLabel}</th>
                <th onClick={notifOnSortType} style={thStyle}>{notifHeaderTypeLabel}</th>
                <th onClick={notifOnSortDate} style={thStyle}>{notifHeaderDateLabel}</th>
              </tr>
            </thead>
            <tbody>
              {(notifFlatRows || []).map((n, nIdx) => (<React.Fragment key={nIdx}>
                <tr onClick={n.onOpen} style={n.rowStyle}>
                  <td style={n.textCellStyle}>{n.text}</td>
                  <td style={n.typeCellStyle}>{n.type}</td>
                  <td style={n.dateCellStyle}>{n.dateTime}</td>
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