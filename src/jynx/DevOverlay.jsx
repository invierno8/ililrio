import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHoverTarget, labelForElement, pathForElement, findTarget, kindForElement } from './useHoverTarget.js';
import AnnotationPopover from './AnnotationPopover.jsx';
import AnnotationMarkers from './AnnotationMarkers.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DrawingOverlay from './DrawingOverlay.jsx';
import { hasHotkey, useHotkeyHeld, MODIFIERS } from './hotkey.js';

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

export default function DevOverlay({ hoverOn, markersOn, drawMode, drawColor, route, routeItemId, comments, currentUser, hotkey, onSubmit, onResolve, onDelete }) {
  // ההילה מופיעה רק כל עוד המקש מוחזק: מחזיקים, עוברים מעל, לוחצים ומעירים.
  // בלי זה כל תנועת עכבר על העמוד הייתה מציירת מסגרת, גם כשרק קוראים אותו.
  // העין נשארת המתג העליון — כבויה, אין הילה גם כשמחזיקים.
  const hotkeyHeld = useHotkeyHeld(hotkey);
  // Shift מרחיב מהטקסט אל המכל שמסביבו. אם המשתמש בחר דווקא ב-Shift כמקש
  // הקיצור, אין הרחבה — אחרת אי אפשר היה להעיר על טקסט בכלל.
  const shiftHeld = useHotkeyHeld('shift');
  const preferBlock = hotkey !== 'shift' && shiftHeld;
  const target = useHoverTarget(hoverOn && hotkeyHeld, true, preferBlock);
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

      // במצב ציור, גרירה עם המקש היא שרטוט — והקליק שנגרר אחריה שייך לציור.
      // בלי החרגה כאן הוא היה פותח קופסת הערה בעצמו, מסיים את הסשן אחרי
      // שרטוט אחד, ופותח אותה בלי הציור שכבר צויר.
      if (drawMode && !popover) return;

      if (popover) {
        if (!hasHotkey(e, hotkey)) return;
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        const lbl = labelForElement(findTarget(el, preferBlock));
        setPopover((p) => {
          if (!p) return p;
          if (p.secondaryTargets.includes(lbl) || lbl === p.label) return p;
          return { ...p, secondaryTargets: [...p.secondaryTargets, lbl] };
        });
        return;
      }

      if (!hasHotkey(e, hotkey)) return;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const resolved = findTarget(el, preferBlock);
      setPopover({
        x: e.clientX,
        y: e.clientY,
        label: labelForElement(resolved),
        path: pathForElement(resolved),
        kind: kindForElement(resolved),
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
  }, [target, popover, hotkey, drawMode, preferBlock]);

  // בזמן ציור אין הילה: היד עסוקה בשרטוט, ומסגרת שרודפת אחרי הסמן רק מפריעה.
  const rect = hoverOn && hotkeyHeld && !drawMode ? target?.getBoundingClientRect() : null;

  /** ציור שהושלם פותח את אותה קופסה בדיוק, רק עם הציור מצורף אליה. */
  function handleDrawingComplete({ drawing, targetEl, screenX, screenY }) {
    const resolved = targetEl ? findTarget(targetEl) : document.body;
    setPopover({
      x: screenX,
      y: screenY,
      label: labelForElement(resolved),
      path: pathForElement(resolved),
      kind: kindForElement(resolved),
      secondaryTargets: [],
      drawing,
    });
  }

  async function submit(comment) {
    await onSubmit({
      route,
      routeItemId,
      targetLabel: popover.label,
      targetPath: popover.path,
      targetKind: popover.kind,
      comment,
      secondaryTargets: parseSecondaryTargetsFromComment(comment),
      drawing: popover.drawing || null,
    });
    setPopover(null);
  }

  return createPortal(
    <div className="dev-overlay-ignore jynx-ui">
      {rect && (
        <div
          className={
            'dev-overlay-highlight'
            + (pickingSecondary ? ' dev-overlay-highlight-secondary' : isJynxHover ? ' dev-overlay-highlight-jynx' : '')
          }
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        >
          {/* מה בדיוק ייתפס כשלוחצים. בלי זה ההילה מראה גבול אבל לא אומרת על
              מה מעירים — וזה בדיוק מה שנשמר עם ההערה כ-targetLabel. */}
          <span className={'dev-overlay-highlight-label' + (rect.top < 26 ? ' dev-overlay-highlight-label-below' : '')}>
            <span className="dev-overlay-highlight-kind">{kindForElement(target) === 'text' ? 'text' : 'block'}</span>
            {labelForElement(target)}
          </span>
        </div>
      )}
      {popover?.drawing && <DrawingOverlay drawing={popover.drawing} />}
      {popover && (
        <AnnotationPopover
          x={popover.x}
          y={popover.y}
          label={popover.label}
          secondaryTargets={popover.secondaryTargets}
          hotkeySymbol={(MODIFIERS[hotkey] || MODIFIERS.ctrl).symbol}
          kind={popover.kind}
          hasDrawing={!!popover.drawing}
          onCancel={() => setPopover(null)}
          onSubmit={submit}
        />
      )}
      <DrawingCanvas active={drawMode && !popover} hotkey={hotkey} color={drawColor} onComplete={handleDrawingComplete} />
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
