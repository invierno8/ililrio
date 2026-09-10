import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2 } from 'lucide-react';
import { useKeepInViewport } from './useKeepInViewport.js';
import { elementForComment } from './useHoverTarget.js';

/* ==================================================================
   סימון קבוע (לא תלוי-הובר) לכל הערה על המסך הנוכחי — נקודה אחת לאלמנט,
   מקובצות לפי היעד. שלוש דרגות אינטראקציה, בדיוק כמו ב-commando
   (overlay/AdminAnnotationMarkers.jsx):
     - במנוחה: קטנה ושקטה, לא מציפה את העמוד.
     - בהובר: גדלה, והאלמנט שעליו נכתבה ההערה — וכל יעד משני שקושר אליה —
       מקבל הילה על העמוד החי, כך שרואים למה ההערה מכוונת בלי לפתוח כלום.
     - בקליק: נפתח כרטיס הפרטים עם הטקסט והסטטוס.
   קבוצה שכולה טופלה נשארת כנקודה שקטה וקטנה יותר, כהיסטוריה — לא נעלמת.

   מה שאין כאן ויש שם: סטטוסי הפעולה האוטומטית (queued/PR/failed) וכפתור
   ה-Action. זו גרסת הערות בלבד, ולכן נשארו שני מצבים — פתוח וטופל.
   ================================================================== */

// פתוחה סגולה, טופלה ירוקה. ב-commando הפתוחה אדומה כי שם הצבע מסמן סטטוס
// בתוך תור פעולות; כאן אין תור, ולכן הצבע הוא פשוט של Jynx.
const COLOR_OPEN = 'var(--jynx)';
const COLOR_DONE = 'var(--green)';

export default function AnnotationMarkers({ active, comments, currentUserId, isAdmin, onResolve, onDelete }) {
  const [tick, setTick] = useState(0);
  const [openLabel, setOpenLabel] = useState(null);

  // rAF-throttled: setTick גולמי לכל אירוע scroll היה מתזמן חישוב מחדש של
  // כל נקודה (getBoundingClientRect לכל אחת) לכל אירוע שהדפדפן יורה, וזה
  // לא מדביק גלילה מהירה. כיווץ ל-frame אחד לכל היותר הוא אותו תיקון בדיוק
  // ש-useHoverTarget עושה ל-mousemove.
  useEffect(() => {
    if (!active) return undefined;
    let rafId = null;
    function onLayoutChange() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setTick((t) => t + 1);
      });
    }
    window.addEventListener('scroll', onLayoutChange, true);
    window.addEventListener('resize', onLayoutChange);
    const id = setInterval(onLayoutChange, 1500); // תופס גם שינויי layout שאינם גלילה/resize
    return () => {
      window.removeEventListener('scroll', onLayoutChange, true);
      window.removeEventListener('resize', onLayoutChange);
      clearInterval(id);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active]);

  // סוגר את הכרטיס הפתוח בכל קליק מחוץ לנקודות — בלי זה הוא היה נשאר פתוח
  // עד קליק נוסף על אותה נקודה בדיוק.
  useEffect(() => {
    if (!openLabel) return undefined;
    function onDocClick(e) {
      if (!e.target.closest?.('.admin-marker-dot-wrap')) setOpenLabel(null);
    }
    window.addEventListener('click', onDocClick, true);
    return () => window.removeEventListener('click', onDocClick, true);
  }, [openLabel]);

  const grouped = useMemo(() => {
    void tick; // תלות מכוונת — רק כדי לגרום לחישוב מחדש בטיק
    if (!active) return [];
    const byLabel = new Map();
    comments.forEach((a) => {
      const key = a.targetPath || a.targetLabel;
      if (!key) return;
      if (!byLabel.has(key)) byLabel.set(key, []);
      byLabel.get(key).push(a);
    });
    const out = [];
    byLabel.forEach((list, key) => {
      const el = elementForComment(list[0]);
      if (!el || !document.contains(el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      out.push({ key, list, rect });
    });
    return out;
  }, [comments, tick, active]);

  if (!active || grouped.length === 0) return null;

  return createPortal(
    <>
      {grouped.map(({ key, list, rect }) => (
        <MarkerDot
          key={key}
          list={list}
          rect={rect}
          open={openLabel === key}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onToggle={() => setOpenLabel((cur) => (cur === key ? null : key))}
          onResolve={onResolve}
          onDelete={onDelete}
        />
      ))}
    </>,
    document.body,
  );
}

function MarkerDot({ list, rect, open, currentUserId, isAdmin, onToggle, onResolve, onDelete }) {
  const openItems = list.filter((a) => !a.resolved);
  const allResolved = openItems.length === 0;
  const color = allResolved ? COLOR_DONE : COLOR_OPEN;
  const anim = allResolved ? 'marker-anim-done' : 'marker-anim-none';
  const [hovered, setHovered] = useState(false);
  const detailRef = useRef(null);
  useKeepInViewport(detailRef, open, 8, [list.length]);

  // יעדים משניים להילה בהובר — איחוד הרשימות של כל ההערות בקבוצה, מחושב רק
  // כשבאמת מרחפים, לא בכל רינדור.
  const secondaryRects = useMemo(() => {
    if (!hovered) return [];
    const labels = [...new Set(list.flatMap((a) => a.secondaryTargets || []))];
    return labels
      .map((l) => elementForComment({ targetLabel: l, targetPath: '' }))
      .filter(Boolean)
      .map((el) => el.getBoundingClientRect());
  }, [hovered, list]);

  return (
    <>
      {/* עזרי הובר בלבד — אף פעם לא יעד תקין להערה. */}
      {hovered && (
        <div className="dev-overlay-ignore jynx-ui">
          <div
            className="admin-marker-highlight"
            style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
          />
          {secondaryRects.map((r, i) => (
            <div
              key={i}
              className="admin-marker-highlight admin-marker-highlight-secondary"
              style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
            />
          ))}
        </div>
      )}
      <div
        className="admin-marker-dot-wrap jynx-chrome jynx-ui"
        style={{ top: rect.top - 8, left: rect.left + rect.width - 8 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className={'admin-marker-dot ' + anim + (allResolved ? ' admin-marker-dot-quiet' : '') + ((hovered || open) ? ' admin-marker-dot-grown' : '')}
          style={{ background: color }}
          onClick={onToggle}
          title={`${list.length} comment${list.length > 1 ? 's' : ''}${allResolved ? ' (done)' : ''} — click for details`}
        >
          {list.length > 1 ? list.length : ''}
        </button>
        {open && (
          <div ref={detailRef} className="admin-marker-detail jynx-ui">
            {list.map((a) => (
              <div key={a.id} className="admin-marker-detail-item">
                <div className="admin-marker-detail-head">
                  <span className="admin-marker-detail-meta">{a.authorName}</span>
                  {a.resolved && <span className="admin-marker-done-badge"><CheckCircle2 size={10} /> Done</span>}
                </div>
                <p className="admin-marker-detail-comment">{a.comment}</p>
                {(a.replies || []).map((r) => (
                  <div key={r.id} className="comments-reply">
                    <p className="comments-reply-body">{r.body}</p>
                    <span className="comments-reply-meta">{r.authorName}</span>
                  </div>
                ))}
                <span className="admin-marker-detail-meta">{new Date(a.createdAt).toLocaleString('en-US')}</span>
                <div className="comments-edit-actions" style={{ justifyContent: 'flex-start' }}>
                  <button type="button" onClick={() => onResolve(a, !a.resolved)}>
                    {a.resolved ? 'Reopen' : 'Mark done'}
                  </button>
                  {(isAdmin || a.authorId === currentUserId) && (
                    <button type="button" onClick={() => onDelete(a)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
