import React, { useEffect, useRef, useState } from 'react';

/**
 * הקופסה שנפתחת אחרי לחיצה על יעד: מראה על מה מעירים, ומקבלת את ההערה.
 * Enter שולח, Shift+Enter יורד שורה, Escape סוגר.
 */
export default function CommentPopover({ at, label, onSubmit, onCancel, onTyping }) {
  const [text, setText] = useState('');
  const boxRef = useRef(null);
  const areaRef = useRef(null);
  const [pos, setPos] = useState({ left: at.x, top: at.y });

  useEffect(() => { if (areaRef.current) areaRef.current.focus(); }, []);

  // מחזיקים את הקופסה בתוך המסך, בלי לחתוך אותה בקצה.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 12;
    const left = Math.min(Math.max(margin, at.x), window.innerWidth - r.width - margin);
    const top = Math.min(Math.max(margin, at.y), window.innerHeight - r.height - margin);
    setPos({ left, top });
  }, [at.x, at.y]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onCancel(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onCancel]);

  const send = () => {
    const body = text.trim();
    if (body) onSubmit(body);
  };

  return (
    <div ref={boxRef} className="jynx-card" style={{ left: pos.left, top: pos.top }}>
      <div className="jynx-card-title">הערה חדשה</div>
      <div className="jynx-target-chip" title={label}>◎ {label}</div>
      <textarea
        ref={areaRef}
        className="jynx-textarea"
        placeholder="מה לא מסתדר כאן?"
        value={text}
        onChange={(e) => { setText(e.target.value); if (onTyping) onTyping(e.target.value); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        }}
      />
      <div className="jynx-card-row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="jynx-btn jynx-btn-ghost" onClick={onCancel}>ביטול</button>
        <button type="button" className="jynx-btn jynx-btn-primary" onClick={send} disabled={!text.trim()}>שלח</button>
      </div>
    </div>
  );
}
