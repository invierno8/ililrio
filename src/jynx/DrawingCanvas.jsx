import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { hasHotkey } from './hotkey.js';

/**
 * ציור חופשי בגרירה עם מקש הקיצור, פעיל רק כשמצב הציור דלוק (העיפרון בסרגל).
 * הועבר מ-commando (overlay/DrawingCanvas.jsx); ההבדל היחיד הוא שהמקש נקבע
 * לפי ההעדפה של המשתמש ולא קבוע ל-Ctrl/Cmd.
 *
 * המאזינים הם ברמת החלון (capture) ולא <div> שתופס את כל המסך, כך שכל עוד
 * המקש אינו מוחזק העמוד מתנהג רגיל לגמרי גם כשמצב הציור דלוק.
 *
 * הנקודות נשמרות כאחוזים מהחלון (0–100) ולא בפיקסלים, כדי שציור שמור ינחת
 * במקום היחסי הנכון גם על מסך בגודל אחר.
 *
 * שרטוט שנסגר בערך במקום שבו התחיל מסווג את עצמו כמצולע במקום כקו פתוח —
 * אין צורך בכלי נפרד. ושחרור העכבר אינו מסיים: כל גרירה מוסיפה שרטוט לאותה
 * סשן, וההערה נפתחת רק ב-Escape (או כשמכבים את מצב הציור), כדי שאפשר יהיה
 * לבנות חץ משלושה קווים בלי שהראשון ייסגר לבד.
 */

const CLOSE_THRESHOLD_PCT = 3;

function toPercent(clientX, clientY) {
  return [(clientX / window.innerWidth) * 100, (clientY / window.innerHeight) * 100];
}

function strokeFromPoints(points) {
  const [sx, sy] = points[0];
  const [ex, ey] = points[points.length - 1];
  const type = Math.hypot(ex - sx, ey - sy) < CLOSE_THRESHOLD_PCT ? 'polygon' : 'freehand';
  return { points, type };
}

export default function DrawingCanvas({ active, hotkey, heldRef, onComplete, color = 'var(--jynx)' }) {
  const [strokes, setStrokes] = useState([]);
  const [livePoints, setLivePoints] = useState([]);
  const strokesRef = useRef([]);
  const pointsRef = useRef([]);
  const drawingRef = useRef(false);
  const lastScreenRef = useRef(null);
  // onComplete/color/hotkey נקראים דרך refs ולא כתלויות: הם אינם ממוזכרים אצל
  // הקורא, ותלות ישירה בהם הייתה מריצה מחדש את ה-effect — ואיתו את הסיום
  // שב-cleanup — בכל רינדור לא קשור של ההורה, ובכך מסיימת את הציור באמצע.
  const onCompleteRef = useRef(onComplete);
  const colorRef = useRef(color);
  const hotkeyRef = useRef(hotkey);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { hotkeyRef.current = hotkey; }, [hotkey]);

  useEffect(() => {
    if (!active) return undefined;

    function finishSession() {
      const finalStrokes = strokesRef.current;
      strokesRef.current = [];
      setStrokes([]);
      if (!finalStrokes.length) return;
      const xs = finalStrokes.flatMap((s) => s.points.map((p) => p[0]));
      const ys = finalStrokes.flatMap((s) => s.points.map((p) => p[1]));
      const cx = ((Math.min(...xs) + Math.max(...xs)) / 2 / 100) * window.innerWidth;
      const cy = ((Math.min(...ys) + Math.max(...ys)) / 2 / 100) * window.innerHeight;
      const last = lastScreenRef.current || { x: cx, y: cy };
      onCompleteRef.current({
        drawing: { strokes: finalStrokes, color: colorRef.current },
        targetEl: document.elementFromPoint(cx, cy),
        screenX: last.x,
        screenY: last.y,
      });
    }

    function onPointerDown(e) {
      if (!hasHotkey(e, hotkeyRef.current, heldRef?.current)) return;
      if (e.target.closest?.('.dev-overlay-ignore, .jynx-chrome')) return;
      e.preventDefault();
      e.stopPropagation();
      drawingRef.current = true;
      const start = [toPercent(e.clientX, e.clientY)];
      pointsRef.current = start;
      setLivePoints(start);
    }
    function onPointerMove(e) {
      if (!drawingRef.current) return;
      e.preventDefault();
      const next = [...pointsRef.current, toPercent(e.clientX, e.clientY)];
      pointsRef.current = next;
      setLivePoints(next);
    }
    function onPointerUp(e) {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      const finalPoints = pointsRef.current;
      pointsRef.current = [];
      setLivePoints([]);
      lastScreenRef.current = { x: e.clientX, y: e.clientY };
      if (finalPoints.length < 2) return;
      const nextStrokes = [...strokesRef.current, strokeFromPoints(finalPoints)];
      strokesRef.current = nextStrokes;
      setStrokes(nextStrokes);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape' && strokesRef.current.length) finishSession();
    }

    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onPointerUp, true);
      window.removeEventListener('keydown', onKeyDown);
      // מצב הציור כובה (או שנפתחה קופסת ההערה) באמצע — מסיימים את מה שכבר
      // צויר במקום להשליך אותו בשקט.
      finishSession();
    };
  }, [active]);

  if (!active || (livePoints.length < 2 && !strokes.length)) return null;

  const pointsAttr = (points) => points
    .map(([x, y]) => `${(x / 100) * window.innerWidth},${(y / 100) * window.innerHeight}`)
    .join(' ');

  return createPortal(
    <svg className="dev-overlay-ignore jynx-ui jynx-drawing-live">
      {strokes.map((s, i) => {
        const Tag = s.type === 'polygon' ? 'polygon' : 'polyline';
        return (
          <Tag
            key={i}
            points={pointsAttr(s.points)}
            fill={s.type === 'polygon' ? `color-mix(in srgb, ${color} 16%, transparent)` : 'none'}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      {livePoints.length >= 2 && (
        <polyline points={pointsAttr(livePoints)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>,
    document.body,
  );
}
