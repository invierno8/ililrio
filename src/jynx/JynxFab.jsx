import React, { useEffect, useRef, useState } from 'react';
import JynxBubbleContent from './JynxBubbleContent.jsx';

/**
 * הבועה הצפה. אפשר לגרור אותה לכל פינה, ולחיצה פותחת מעליה את סרגל הכלים.
 * גרירה ולחיצה מופרדות בסף תזוזה, כך שגרירה קצרה לא נחשבת ללחיצה.
 */
const MARGIN = 16;
const DRAG_THRESHOLD = 4;
const POS_KEY = 'jynx.fab-pos.v1';

function loadPos() {
  try {
    const saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
    if (saved && typeof saved.right === 'number' && typeof saved.bottom === 'number') return saved;
  } catch { /* אחסון חסום */ }
  return { right: MARGIN, bottom: MARGIN };
}

export default function JynxFab({ mood, welcomeName, errorText, onClick, children }) {
  const [pos, setPos] = useState(loadPos);
  const [dragging, setDragging] = useState(false);
  const fabRef = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch { /* אחסון חסום */ }
  }, [pos]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const el = fabRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, base: pos, moved: false };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    d.moved = true;
    setDragging(true);
    const el = fabRef.current;
    const w = el ? el.offsetWidth : 0;
    const h = el ? el.offsetHeight : 0;
    setPos({
      right: Math.min(Math.max(MARGIN, d.base.right - dx), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
      bottom: Math.min(Math.max(MARGIN, d.base.bottom - dy), Math.max(MARGIN, window.innerHeight - h - MARGIN)),
    });
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    const el = fabRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (d && !d.moved) onClick();
  };

  const breathing = mood === 'idle' ? ' jynx-breathe' : mood === 'waking' || mood === 'thinking' ? ' jynx-thinking-pulse' : '';

  return (
    <>
      {children && children({ right: pos.right, bottom: pos.bottom + (fabRef.current ? fabRef.current.offsetHeight + 8 : 48) })}
      <button
        ref={fabRef}
        type="button"
        className={'jynx-fab' + breathing + (dragging ? ' jynx-fab-dragging' : '')}
        style={{ right: pos.right, bottom: pos.bottom }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label="Jynx"
      >
        <JynxBubbleContent mood={mood} welcomeName={welcomeName} errorText={errorText} />
      </button>
    </>
  );
}
