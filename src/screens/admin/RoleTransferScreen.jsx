import React from 'react';
import { Button, Select } from '../../design-system/index.js';
/** העברת תפקיד בין משתמשים (P4). */
export default function RoleTransferScreen({ v }) {
  const {
    isP4TransferScreen, p4CancelTransferConfirm, p4ConfirmTransfer, p4GoDisableOutgoing, p4OnTransferIncomingChange,
    p4OnTransferOutgoingChange, p4OpenTransferConfirm, p4ToggleTransferSimulateFailure, p4TransferAllZero,
    p4TransferApproverCheckFails, p4TransferApproverCheckOk, p4TransferApprovesForCount, p4TransferApprovesForNamesText,
    p4TransferConfirmClosed, p4TransferConfirmOpen, p4TransferFailure, p4TransferHasHoldings,
    p4TransferHasIncoming, p4TransferHasOutgoing, p4TransferIncomingId, p4TransferIncomingName,
    p4TransferIncomingOptions, p4TransferOutgoingId, p4TransferOutgoingName, p4TransferOutgoingOptions,
    p4TransferOwnedCount, p4TransferReady, p4TransferSimulateFailureLabel, p4TransferSubmitDisabled,
    p4TransferSuccess,
  } = v;
  return (
    <>
      {/* P4: ROLE TRANSFER */}
      {isP4TransferScreen && (<>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>העברת תפקיד</div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>1. בחר משתמש יוצא</div>
            <div style={{ maxWidth: '340px' }}><Select options={p4TransferOutgoingOptions} value={p4TransferOutgoingId} onChange={p4OnTransferOutgoingChange} placeholder="בחר משתמש" size="sm" /></div>
            {p4TransferHasOutgoing && (<>
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                {p4TransferAllZero && (<><div>אין החזקות פתוחות. ניתן להשבית משתמש זה ישירות.</div></>)}
                {p4TransferHasHoldings && (<>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>פריטים בבעלותו: {p4TransferOwnedCount}</div>
                    <div>משתמשים שהוא מאשר התוכן שלהם: {p4TransferApprovesForCount} {p4TransferApprovesForNamesText}</div>
                  </div>
                </>)}
              </div>
            </>)}
          </div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>2. בחר משתמש נכנס</div>
            <div style={{ maxWidth: '340px' }}><Select options={p4TransferIncomingOptions} value={p4TransferIncomingId} onChange={p4OnTransferIncomingChange} placeholder="בחר משתמש" size="sm" /></div>
            {p4TransferHasIncoming && (<>
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', fontSize: '12.5px' }}>
                {p4TransferApproverCheckOk && (<><div style={{ fontWeight: '600' }}>חבר בקבוצת המאשרים</div></>)}
                {p4TransferApproverCheckFails && (<><div style={{ fontWeight: '600', color: 'var(--tw-amber-700)' }}>הנכנס אינו חבר בקבוצת המאשרים. לא ניתן להעביר ניתובי מאשר.</div></>)}
              </div>
            </>)}
          </div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>3. אשר</div>
            {p4TransferReady && (
              <div style={{ fontSize: '13px', marginBottom: '14px' }}>העברה מ-{p4TransferOutgoingName} אל {p4TransferIncomingName}</div>
            )}
            <div onClick={p4ToggleTransferSimulateFailure} style={{ fontSize: '10.5px', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '14px' }}>{p4TransferSimulateFailureLabel}</div>
            {p4TransferConfirmClosed && (
              <Button variant="primary" size="sm" onClick={p4OpenTransferConfirm} disabled={p4TransferSubmitDisabled}>בצע העברה</Button>
            )}
            {p4TransferConfirmOpen && (<>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '12.5px' }}>ביצוע ההעברה אינו הפיך. להמשיך?</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" size="sm" onClick={p4CancelTransferConfirm}>ביטול</Button>
                  <Button variant="primary" size="sm" onClick={p4ConfirmTransfer}>אשר</Button>
                </div>
              </div>
            </>)}
            {p4TransferSuccess && (
              <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '600' }}>ההעברה בוצעה. ניתן כעת <a onClick={p4GoDisableOutgoing} style={{ cursor: 'pointer' }}>להשבית את {p4TransferOutgoingName}</a>.</div>
            )}
            {p4TransferFailure && (
              <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '600', color: 'var(--tw-red-600)' }}>ההעברה נכשלה. שום החזקה לא עברה. <a onClick={p4OpenTransferConfirm} style={{ cursor: 'pointer' }}>נסה שוב</a></div>
            )}
          </div>
        </div>
      </>)}
    </>
  );
}