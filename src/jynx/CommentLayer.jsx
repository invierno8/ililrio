import React, { useEffect, useRef, useState } from 'react';
import { findTarget, labelForElement, isJynxChrome, anchorFor, resolveAnchor } from './anchor.js';
import CommentPopover from './CommentPopover.jsx';

/**
 * מצב ההערה: מרחפים מעל המסך, היעד שמתחת לסמן מודגש, ולחיצה פותחת קופסת
 * כתיבה. כל עוד המצב פעיל, הלחיצות נתפסות לפני שהאפליקציה רואה אותן — אחרת
 * לחיצה על "כרטיס" הייתה גם פותחת פריט וגם משאירה הערה.
 */
export function CommentMode({ active, onSubmit, onTyping }) {
  const [hover, setHover] = useState(null); // { rect, label }
  const [pending, setPending] = useState(null); // { at, el, label }
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) { setHover(null); return undefined; }

    function onMove(e) {
      if (pending) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const raw = document.elementFromPoint(e.clientX, e.clientY);
        if (!raw || isJynxChrome(raw)) { setHover(null); return; }
        const el = findTarget(raw);
        const r = el.getBoundingClientRect();
        setHover({ rect: { top: r.top, left: r.left, width: r.width, height: r.height }, label: labelForElement(el), el });
      });
    }

    function onClick(e) {
      if (isJynxChrome(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      const raw = document.elementFromPoint(e.clientX, e.clientY);
      if (!raw || isJynxChrome(raw)) return;
      const el = findTarget(raw);
      setPending({ at: { x: e.clientX + 12, y: e.clientY + 12 }, el, label: labelForElement(el) });
      setHover(null);
    }

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    document.body.classList.add('jynx-crosshair');
    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
      document.body.classList.remove('jynx-crosshair');
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [active, pending]);

  useEffect(() => { if (!active) setPending(null); }, [active]);

  return (
    <>
      {active && hover && (
        <div
          className="jynx-halo"
          style={{ top: hover.rect.top, left: hover.rect.left, width: hover.rect.width, height: hover.rect.height }}
        >
          <span className="jynx-halo-label">{hover.label}</span>
        </div>
      )}
      {pending && (
        <CommentPopover
          at={pending.at}
          label={pending.label}
          onTyping={onTyping}
          onCancel={() => setPending(null)}
          onSubmit={(body) => { onSubmit({ body, anchor: anchorFor(pending.el) }); setPending(null); }}
        />
      )}
    </>
  );
}

/**
 * הסימונים על המסך: עיגול קטן על כל אלמנט שיש עליו הערה במסך הנוכחי. המיקום
 * נמדד מחדש בכל גלילה, שינוי גודל, ומדי פעם — כי המסכים של RIO נפתחים
 * ונסגרים בלי שהעוגן משתנה.
 */
export function CommentMarkers({ comments, onOpen }) {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    let raf = null;
    const measure = () => {
      raf = null;
      const byEl = new Map();
      for (const c of comments) {
        const el = resolveAnchor(c.anchor);
        if (!el || !document.contains(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const key = c.anchor.path || c.id;
        const found = byEl.get(key);
        if (found) { found.items.push(c); continue; }
        byEl.set(key, { key, top: r.top, left: r.left, items: [c] });
      }
      setSpots([...byEl.values()]);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };

    measure();
    const timer = setInterval(schedule, 700);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [comments]);

  return spots.map((spot) => {
    const open = spot.items.filter((c) => !c.resolved).length;
    return (
      <button
        key={spot.key}
        type="button"
        className={'jynx-marker' + (open === 0 ? ' jynx-marker-resolved' : '')}
        style={{ top: Math.max(2, spot.top - 8), left: Math.max(2, spot.left - 8) }}
        title={spot.items.map((c) => `${c.author.name}: ${c.body}`).join('\n')}
        onClick={() => onOpen(spot.items[0])}
      >
        {spot.items.length}
      </button>
    );
  });
}
