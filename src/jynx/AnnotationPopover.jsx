import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import { useDraggableFab } from './useDraggableFab.js';

/* קופסת התגובה שנפתחת ב-Ctrl/Cmd+קליק. הועברה מ-commando
   (overlay/AnnotationPopover.jsx) בלי הקובץ המצורף, בלי כפתור "יישלח
   כפעולה" ובלי תור המשוב-על-Jynx — הגרסה כאן היא הערות בלבד.

   יעדים משניים: כל עוד הקופסה פתוחה, DevOverlay.jsx הופך Ctrl/Cmd+קליק על
   אלמנט תקין ליעד משני, והאפקט למטה מזריק טוקן טקסט קריא ("[→ תווית]")
   לתוך ה-textarea במיקום הסמן — כך שהוא חלק אמיתי מהמשפט וניתן למחיקה
   כמו כל טקסט אחר. השרת מקבל את הרשימה מנותחת מחדש מהטקסט עצמו בזמן
   השליחה, לא ממערך נפרד, כך שהטקסט הוא תמיד מקור האמת היחיד.

   גרירה: useDraggableFab — אותו hook בדיוק כמו הפאנל והסרגל. */
export default function AnnotationPopover({ x, y, label, secondaryTargets, hotkeySymbol = 'Ctrl', onCancel, onSubmit }) {
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const prevSecondaryLenRef = useRef(secondaryTargets.length);

  useEffect(() => {
    if (secondaryTargets.length > prevSecondaryLenRef.current) {
      const newOnes = secondaryTargets.slice(prevSecondaryLenRef.current);
      setComment((prev) => {
        const ta = textareaRef.current;
        const pos = ta && typeof ta.selectionStart === 'number' ? ta.selectionStart : prev.length;
        const insertText = newOnes.map((t) => `[→ ${t}]`).join(' ') + ' ';
        const next = prev.slice(0, pos) + insertText + prev.slice(pos);
        requestAnimationFrame(() => {
          if (!ta) return;
          const newPos = pos + insertText.length;
          ta.focus();
          ta.setSelectionRange(newPos, newPos);
        });
        return next;
      });
    }
    prevSecondaryLenRef.current = secondaryTargets.length;
  }, [secondaryTargets]);

  // מיקום ראשוני מחושב פעם אחת מנקודת הקליק שפתחה את הקופסה; גרירה משם
  // ואילך משתלטת ונשמרת ב-localStorage כמו כל שאר כלי Jynx.
  const initialPos = useMemo(() => {
    const top = Math.min(y, window.innerHeight - 200);
    const left = Math.min(x, window.innerWidth - 300);
    return { left, bottom: Math.max(4, window.innerHeight - top - 230) };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- קפוא במכוון בעת ה-mount
  }, []);
  const { pos, dragHandlers, sizeRef } = useDraggableFab('jynx-annotate-popover-pos', initialPos, 'left');

  async function submit() {
    if (!comment.trim() || sending) return;
    setSending(true);
    setError('');
    try {
      await onSubmit(comment.trim());
    } catch (e) {
      setError(e.message || 'Failed to send, please try again');
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      ref={sizeRef}
      // jynx-chrome ולא dev-overlay-ignore: הקופסה היא UI אמיתי של Jynx,
      // ולכן אפשר להעיר גם עליה — בדיוק כמו במקור.
      className="dev-annotate-popover jynx-ui jynx-chrome"
      data-devblock="jynx-comment-composer"
      style={{ left: pos.left, bottom: pos.bottom }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
    >
      <div className="dev-annotate-popover-head">
        <span className="dev-annotate-popover-grip" {...dragHandlers} title="Drag to move">
          <GripVertical size={13} />
        </span>
        <div className="dev-annotate-popover-label" title={label}>{label}</div>
      </div>
      <textarea
        ref={textareaRef}
        autoFocus
        rows={3}
        placeholder="What needs to change/be checked here? (e.g. move this to →)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="dev-annotate-picking-hint">
        {hotkeySymbol}+click any element on screen to link it here — it&apos;ll appear as a tag in your comment
        {secondaryTargets.length > 0 && ` (${secondaryTargets.length} linked)`}
      </div>
      {error && <div className="dev-login-error">{error}</div>}
      <div className="dev-annotate-popover-actions">
        <button type="button" className="dev-annotate-btn" onClick={onCancel} disabled={sending}>
          Cancel
        </button>
        <button type="button" className="dev-annotate-btn dev-annotate-btn-primary" onClick={submit} disabled={!comment.trim() || sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
