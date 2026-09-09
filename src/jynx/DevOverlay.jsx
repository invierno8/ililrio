import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHoverTarget, labelForElement, pathForElement, findTarget } from './useHoverTarget.js';
import AnnotationPopover from './AnnotationPopover.jsx';
import AnnotationMarkers from './AnnotationMarkers.jsx';

/* ==================================================================
   מותקן פעם אחת, כל עוד יש משתמש מחובר. שלושה תפקידים, כמו ב-commando
   (overlay/DevOverlay.jsx):
     1. הובר: הילה זוהרת סביב המכל שמתחת לסמן (ראו useHoverTarget.js).
     2. Ctrl/Cmd+קליק: עוצר את הקליק לפני שהאפליקציה רואה אותו (capture
        phase) ופותח קופסת תגובה קטנה, שנשלחת ישר לשירות.
     3. נקודות קבועות (לא הובר) לכל הערה על המסך הנוכחי — ראו
        AnnotationMarkers.jsx.
   ================================================================== */

// טוקן טקסט משני בתוך המשפט — "[→ תווית]". מנותח מחדש מהטקסט עצמו בזמן
// השליחה (לא ממערך נפרד), כך שמחיקת הטוקן מהטקסט = הסרת הקישור.
function parseSecondaryTargetsFromComment(comment) {
  const found = [];
  for (const m of comment.matchAll(/\[→\s*([^\]]+?)\s*\]/g)) {
    if (m[1] && !found.includes(m[1])) found.push(m[1]);
  }
  return found.slice(0, 10);
}

export default function DevOverlay({ hoverOn, markersOn, route, comments, currentUser, onSubmit, onResolve, onDelete }) {
  const target = useHoverTarget(hoverOn, true);
  const [popover, setPopover] = useState(null); // { x, y, label, path, secondaryTargets: [] } | null
  const isJynxHover = !!target?.closest('.jynx-chrome');
  // "בוחר יעד משני" הוא פשוט: יש popover פתוח. אין שלב-ביניים של כפתור
  // "+ קשר אלמנט נוסף" — ברגע שהתגובה פתוחה, Ctrl/Cmd+קליק על אלמנט תקין
  // מוסיף אותו כיעד משני מיד. קליק רגיל לא נלכד, כדי שאפשר עדיין ללחוץ על
  // האפליקציה מתחת בזמן שהתגובה פתוחה.
  const pickingSecondary = !!popover;

  useEffect(() => {
    // ה-popover נפתח קרוב מאוד לנקודת הקליק, ולעיתים ממש מעל האלמנט שרוצים
    // לקשר. elementFromPoint היה מחזיר את ה-popover עצמו (הכי עליון שם);
    // elementsFromPoint נותן את כל הערימה, ומדלגים על שכבות ה-overlay.
    function realElementAtPoint(x, y) {
      const stack = document.elementsFromPoint(x, y);
      return stack.find((n) => !n.closest('.dev-overlay-ignore')) || null;
    }
    function onClickCapture(e) {
      const el = realElementAtPoint(e.clientX, e.clientY);

      if (popover) {
        if (!(e.ctrlKey || e.metaKey)) return;
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        const lbl = labelForElement(findTarget(el));
        setPopover((p) => {
          if (!p) return p;
          if (p.secondaryTargets.includes(lbl) || lbl === p.label) return p;
          return { ...p, secondaryTargets: [...p.secondaryTargets, lbl] };
        });
        return;
      }

      if (!(e.ctrlKey || e.metaKey)) return;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const resolved = findTarget(el);
      setPopover({
        x: e.clientX,
        y: e.clientY,
        label: labelForElement(resolved),
        path: pathForElement(resolved),
        secondaryTargets: [],
      });
    }
    function onKeyDown(e) {
      if (e.key === 'Escape' && popover) setPopover(null);
    }
    window.addEventListener('click', onClickCapture, true);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [target, popover]);

  const rect = hoverOn ? target?.getBoundingClientRect() : null;

  async function submit(comment) {
    await onSubmit({
      route,
      targetLabel: popover.label,
      targetPath: popover.path,
      comment,
      secondaryTargets: parseSecondaryTargetsFromComment(comment),
    });
    setPopover(null);
  }

  return createPortal(
    <div className="dev-overlay-ignore">
      {rect && (
        <div
          className={
            'dev-overlay-highlight'
            + (pickingSecondary ? ' dev-overlay-highlight-secondary' : isJynxHover ? ' dev-overlay-highlight-jynx' : '')
          }
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      )}
      {popover && (
        <AnnotationPopover
          x={popover.x}
          y={popover.y}
          label={popover.label}
          secondaryTargets={popover.secondaryTargets}
          onCancel={() => setPopover(null)}
          onSubmit={submit}
        />
      )}
      <AnnotationMarkers
        active={markersOn}
        comments={comments.filter((c) => c.route === route)}
        currentUserId={currentUser?.id}
        isAdmin={!!currentUser?.isAdmin}
        onResolve={onResolve}
        onDelete={onDelete}
      />
    </div>,
    document.body,
  );
}
