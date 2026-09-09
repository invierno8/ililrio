import React, { useEffect, useRef, useState } from 'react';

/**
 * הפנים הזעירות שבתוך הבועה — שתי "עיניים" ב-CSS בלבד, בלי SVG ובלי נכס חיצוני.
 * mood קובע גם צורה וגם התנהגות:
 *  - idle: ממצמצת במרווחים אקראיים והעיניים נודדות קלות אחרי הסמן.
 *  - typing: מצמוץ ער ומהיר, בלי מעקב אחרי הסמן (הקשב על הטקסט).
 *  - thinking / success / error: הבעה אחת קבועה.
 *
 * מקור: client/src/devtools/JynxFace.jsx ב-commando.
 */
export default function JynxFace({ mood = 'idle' }) {
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const faceRef = useRef(null);

  useEffect(() => {
    if (mood !== 'idle' && mood !== 'typing') return undefined;
    let cancelled = false;
    const gap = mood === 'typing' ? 1400 : 2600;
    function scheduleBlink() {
      const delay = gap + Math.random() * gap;
      window.setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        window.setTimeout(() => { if (!cancelled) setBlink(false); }, 140);
        scheduleBlink();
      }, delay);
    }
    scheduleBlink();
    return () => { cancelled = true; };
  }, [mood]);

  useEffect(() => {
    if (mood !== 'idle') { setLook({ x: 0, y: 0 }); return undefined; }
    function onMove(e) {
      const el = faceRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const maxShift = 1.4;
      setLook({ x: (dx / dist) * maxShift, y: (dy / dist) * maxShift });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mood]);

  const eyeStyle = mood === 'idle' ? { transform: `translate(${look.x}px, ${look.y}px)` } : undefined;

  return (
    <div ref={faceRef} className={'jynx-face jynx-face-' + mood} aria-hidden="true">
      <span className={'jynx-face-eye' + (blink ? ' jynx-face-blink' : '')} style={eyeStyle} />
      <span className={'jynx-face-eye' + (blink ? ' jynx-face-blink' : '')} style={eyeStyle} />
    </div>
  );
}
