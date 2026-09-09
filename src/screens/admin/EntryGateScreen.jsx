import React from 'react';
import { Checkbox, Input } from '../../design-system/index.js';
/** שער הכניסה: כללי הבדיקה בכניסה למערכת (P4). */
export default function EntryGateScreen({ v }) {
  const {
    isP4GateScreen, p4GateRows,
  } = v;
  return (
    <>
      {/* P4: ENTRY GATE */}
      {isP4GateScreen && (<>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>שער הכניסה</div>
          {(p4GateRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div style={{ flex: '1 1 auto' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{row.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{row.checkType}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input label="ערך נדרש" value={row.requiredValue} onChange={row.onValueChange} placeholder="[חסר]" size="sm" />
                  <Input label="הודעת כשל" value={row.failureMsg} onChange={row.onFailureMsgChange} size="sm" />
                </div>
                {row.changedLabel && (<><div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '10px' }}>{row.changedLabel}</div></>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: '0', width: '110px', paddingTop: '4px' }}>
                <Checkbox checked={row.active} onChange={row.onToggle} label={row.activeLabel} size="sm" />
                {row.lastActiveWarn && (<><div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>חייב להישאר כלל פעיל אחד</div></>)}
              </div>
            </div>
          </React.Fragment>))}
        </div>
      </>)}
    </>
  );
}