import React, { useEffect, useRef, useState } from 'react';
import { MODIFIERS, modifierFromEvent } from './hotkey.js';

/**
 * השורה שמתחת לסרגל: איזה מקש מחזיקים כדי להעיר, ואיך משנים אותו.
 *
 * לחיצה על השורה פותחת כרטיס לכידה — "press anything to set a new hotkey" —
 * שמאזין למקש הבא. מקש שאפשר להחזיק (⌘, Ctrl, ⌥, ⇧) נקבע מיד; כל מקש אחר
 * אינו יכול לשמש כאן, כי צריך להחזיק אותו בזמן קליק, ולכן הכרטיס אומר זאת
 * ונשאר פתוח.
 */
export default function HotkeyHint({ modifier, onChange }) {
  const [capturing, setCapturing] = useState(false);
  const [rejected, setRejected] = useState('');
  const wrapRef = useRef(null);
  const spec = MODIFIERS[modifier];

  useEffect(() => {
    if (!capturing) return undefined;

    function onKeyDown(e) {
      e.preventDefault();
      e.stopPropagation();
      const next = modifierFromEvent(e);
      if (next) {
        onChange(next);
        setRejected('');
        setCapturing(false);
      } else {
        setRejected(`${e.key === ' ' ? 'Space' : e.key} can't be held while clicking`);
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
        {spec.symbol}+click any element to comment
      </span>
      <button
        type="button"
        className="jynx-hotkey-current"
        onClick={() => { setRejected(''); setCapturing((v) => !v); }}
        title="Click to pick a different key"
      >
        Current hotkey: {spec.symbol === spec.label ? spec.label : `${spec.symbol} ${spec.label}`}
      </button>
      {capturing && (
        <div className="jynx-hotkey-capture">
          <span className="jynx-hotkey-capture-title">Press anything to set a new hotkey</span>
          <span className="jynx-hotkey-capture-keys">⌘ · Ctrl · ⌥ · ⇧</span>
          <span className="jynx-hotkey-capture-hint">
            It has to be a key you can hold down while clicking.
          </span>
          {rejected && <span className="jynx-hotkey-capture-error">{rejected}</span>}
        </div>
      )}
    </div>
  );
}
