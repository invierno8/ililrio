import React, { useEffect, useState } from 'react';
import rioLogo from '../assets/rio-logo.svg';

/**
 * המערכת נבנתה למסך רחב — תפריט צד קבוע, טבלאות רחבות ומסך פריט בשתי עמודות.
 * במסך צר מוצגת במקומה הודעה, במקום פריסה שבורה. הבדיקה חיה: סיבוב מכשיר או
 * הקטנת חלון מחליפים בין המצבים בלי רענון.
 */
const QUERY = '(max-width: 900px)';

export function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(QUERY).matches : false
  ));

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    setNarrow(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return narrow;
}

export default function DesktopOnly() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '18px',
        padding: '32px 24px',
        textAlign: 'center',
        background: 'var(--background)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <img src={rioLogo} alt="RIO" style={{ width: '72px', height: '72px' }} />
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, lineHeight: 1.4 }}>
        המערכת מוצגת על מחשב בלבד
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '300px' }}>
        נא פתחו את הקטלוג בדפדפן על מחשב.
      </div>
    </div>
  );
}
