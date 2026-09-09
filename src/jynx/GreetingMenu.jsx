import React, { useEffect, useRef, useState } from 'react';
import { useKeepInViewport } from './useKeepInViewport.js';

/* תפריט ה-"Hi" שבקצה הסרגל, כמו ב-commando (DevGreetingMenu.jsx): מי אתה,
   מה הקיצורים, ויציאה. הרשימה מגיעה מבחוץ ומחושבת מהסדר בפועל של הסרגל,
   כך שהמספרים תמיד נכונים ולא עותק שהתיישן. */
export default function GreetingMenu({ user, shortcuts, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const wrapRef = useRef(null);
  useKeepInViewport(menuRef, open, 8, [shortcuts.length]);

  useEffect(() => {
    if (!open) return undefined;
    function onDocPointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    window.addEventListener('pointerdown', onDocPointerDown, true);
    return () => window.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [open]);

  return (
    <div className="dev-greeting-wrap" ref={wrapRef}>
      <button type="button" className="dev-greeting-btn" onClick={() => setOpen((v) => !v)} title="You, shortcuts, and sign out">
        Hi, {user.name}
      </button>
      {open && (
        <div ref={menuRef} className="dev-greeting-menu">
          <span className="dev-greeting-name">{user.name}</span>
          <span className="dev-greeting-role">{user.isAdmin ? 'Admin' : 'Commenter'}</span>
          <div className="dev-greeting-shortcuts">
            <span className="dev-greeting-shortcut">
              <kbd>Ctrl/Cmd</kbd> + click — comment on any element
            </span>
            {shortcuts.map((s) => (
              <span key={s.num} className="dev-greeting-shortcut">
                <kbd>{s.num}</kbd> {s.label}
              </span>
            ))}
          </div>
          <button type="button" className="dev-greeting-logout" onClick={onLogout}>Sign out</button>
        </div>
      )}
    </div>
  );
}
