import React, { useEffect, useState } from 'react';
import JynxFace from './JynxFace.jsx';

/**
 * מה שמוצג בתוך הבועה עצמה. idle הוא המצב היחיד שמתחלף — פנים בלבד, לוגו
 * בלבד, שניהם, ולפעמים נפנוף — כדי שהבועה לא תיראה כמו כפתור קפוא. שאר
 * המצבים הם רגעים בעלי משמעות, וכל אחד מהם מקבל צמד פנים+טקסט קבוע.
 *
 * מקור: client/src/devtools/JynxBubbleContent.jsx ב-commando.
 */
const IDLE_FRAMES = ['face', 'logo', 'both', 'wave'];
const IDLE_INTERVAL_MS = 4000;

export default function JynxBubbleContent({ mood, welcomeName, errorText }) {
  const [idleFrame, setIdleFrame] = useState(0);

  useEffect(() => {
    if (mood !== 'idle') return undefined;
    const t = setInterval(() => setIdleFrame((f) => (f + 1) % IDLE_FRAMES.length), IDLE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [mood]);

  if (mood === 'waking') return (<><JynxFace mood="thinking" /><span className="jynx-logo">Waking up…</span></>);
  if (mood === 'thinking') return (<><JynxFace mood="thinking" /><span className="jynx-logo">Thinking…</span></>);
  if (mood === 'success') return (<><JynxFace mood="success" /><span className="jynx-logo">{welcomeName ? `Hi, ${welcomeName}!` : 'Ready!'}</span></>);
  if (mood === 'error') return (<><JynxFace mood="error" /><span className="jynx-logo jynx-logo-error">{errorText || "Hmm, that's not right"}</span></>);
  if (mood === 'typing') return (<><JynxFace mood="typing" /><span className="jynx-logo">JYNX</span></>);

  switch (IDLE_FRAMES[idleFrame]) {
    case 'face': return <JynxFace mood="idle" />;
    case 'logo': return <span className="jynx-logo">JYNX</span>;
    case 'wave': return <span className="jynx-logo">👋</span>;
    default: return (<><JynxFace mood="idle" /><span className="jynx-logo">JYNX</span></>);
  }
}
