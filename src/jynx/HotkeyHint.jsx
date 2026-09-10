import React, { useEffect, useRef, useState } from 'react';
import { hotkeyFromEvent, hotkeyLabel, hotkeySymbol, isPlainKey, isMacPlatform } from './hotkey.js';

/**
 * השורה שמתחת לסרגל: איזה מקש מחזיקים כדי להעיר, ואיך משנים אותו.
 *
 * לחיצה על השורה פותחת כרטיס לכידה — "press anything to set a new hotkey" —
 * שמאזין למקש הבא וקובע אותו. כמעט כל מקש כשר, לא רק ⌘/Ctrl/⌥/⇧: אפשר
 * להחזיק Q ולהקליק בדיוק באותה מידה. היוצאים מן הכלל הם Esc ו-Tab, שהדפדפן
 * והכרטיס עצמו זקוקים להם.
 */
export default function HotkeyHint({ modifier, onChange }) {
  const [capturing, setCapturing] = useState(false);
  const [rejected, setRejected] = useState('');
  const wrapRef = useRef(null);
  const symbol = hotkeySymbol(modifier);
  const label = hotkeyLabel(modifier);

  useEffect(() => {
    if (!capturing) return undefined;

    function onKeyDown(e) {
      e.preventDefault();
      e.stopPropagation();
      const next = hotkeyFromEvent(e);
      if (next) {
        onChange(next);
        setRejected('');
        setCapturing(false);
      } else {
        // Esc ו-Tab שמורים: אחד סוגר חלונות, השני מזיז פוקוס.
        setRejected(`${e.key} is reserved — pick another key`);
      }
    }
    function onPointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setCapturing(false);
    }

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [capturing, onChange]);

  return (
    <div className="jynx-hotkey-hint jynx-chrome jynx-ui" ref={wrapRef}>
      <span className="jynx-hotkey-hint-text">
        Hold {symbol} and click any element to comment
        {modifier !== 'shift' && <><br />Add ⇧ to comment on the block instead of the text</>}
      </span>
      <button
        type="button"
        className="jynx-hotkey-current"
        onClick={() => { setRejected(''); setCapturing((v) => !v); }}
        title="Click to pick a different key"
      >
        Current hotkey: {symbol === label ? label : `${symbol} ${label}`}
      </button>
      {capturing && (
        <div className="jynx-hotkey-capture">
          <span className="jynx-hotkey-capture-title">Press anything to set a new hotkey</span>
          <span className="jynx-hotkey-capture-keys">{isMacPlatform() ? '⌘ · ⌥ · ⇧ · Ctrl · A–Z · 0–9' : 'Ctrl · Alt · ⇧ · A–Z · 0–9'}</span>
          <span className="jynx-hotkey-capture-hint">
            {isPlainKey(modifier)
              ? 'Any key works — hold it down while you click.'
              : 'Any key works, not just modifiers — hold it down while you click.'}
          </span>
          {rejected && <span className="jynx-hotkey-capture-error">{rejected}</span>}
        </div>
      )}
    </div>
  );
}
