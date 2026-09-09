import React from 'react';

/**
 * שלדי הטעינה של הדמו. הם משרטטים את המבנה של המסך שנטען — אותם מידות, אותם
 * מרווחים — כדי שהמעבר בין השלד לתוכן לא יזיז שום דבר על המסך.
 */

/** מלבן אפור עם הבזק אור. width/height מתקבלים כמחרוזות CSS. */
export function Bar({ width = '100%', height = 12, radius, style }) {
  return (
    <div
      className="rio-skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

const stagger = (i) => ({ animationDelay: i * 45 + 'ms' });

function Card({ index }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: '#fff', ...stagger(index) }}>
      <Bar height="auto" radius="0" style={{ aspectRatio: '16/9' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', borderBottom: '1px solid var(--tw-gray-200)', padding: '6px 10px' }}>
        <Bar width="54px" height={14} radius="9999px" />
        <Bar width="46px" height={14} radius="9999px" />
      </div>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <Bar height={11} />
        <Bar width="70%" height={11} />
        <Bar width="88%" height={9} />
      </div>
    </div>
  );
}

/** קטלוג: שורת החיפוש והבקרות, ואחריהן רשת כרטיסים. */
export function CatalogSkeleton() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Bar width="min(520px, 60%)" height={44} radius="var(--radius-field)" />
        <Bar width="112px" height={40} radius="var(--radius-field)" />
        <Bar width="180px" height={40} radius="var(--radius-field)" />
        <Bar width="120px" height={13} style={{ marginInlineStart: 'auto' }} />
      </div>
      <div className="rio-skeleton-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
        {Array.from({ length: 8 }, (_, i) => <Card key={i} index={i} />)}
      </div>
    </div>
  );
}

/** מסך פריט: כרטיס הפרטים מימין, גלריה ומקטעי תוכן משמאל. */
export function DetailSkeleton() {
  return (
    <div>
      <Bar width="220px" height={12} style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', gap: '28px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '20px', background: '#fff' }}>
          <Bar width="70%" height={19} style={{ marginBottom: '12px' }} />
          <Bar width="90px" height={20} radius="9999px" style={{ marginBottom: '10px' }} />
          <Bar width="45%" height={11} style={{ marginBottom: '6px' }} />
          <Bar width="35%" height={11} style={{ marginBottom: '18px' }} />
          <div className="rio-skeleton-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', ...stagger(i) }}>
                <Bar width="86px" height={11} />
                <Bar width="120px" height={11} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: '2 1 420px', minWidth: 0 }}>
          <Bar height="auto" radius="var(--radius-xl)" style={{ aspectRatio: '16/9', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {Array.from({ length: 4 }, (_, i) => <Bar key={i} width="64px" height={48} radius="6px" />)}
          </div>
          <div className="rio-skeleton-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} style={stagger(i)}>
                <Bar width="140px" height={14} style={{ marginBottom: '10px' }} />
                <Bar height={11} style={{ marginBottom: '7px' }} />
                <Bar width="82%" height={11} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** מסכי טבלה: כותרת, שורת סיכום ושורות. */
export function TableSkeleton({ rows = 6 }) {
  return (
    <div>
      <Bar width="180px" height={17} style={{ marginBottom: '8px' }} />
      <Bar width="130px" height={12} style={{ marginBottom: '18px' }} />
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '14px', padding: '10px 14px', background: 'var(--surface)' }}>
          <Bar width="34%" height={11} />
          <Bar width="18%" height={11} />
          <Bar width="18%" height={11} />
        </div>
        <div className="rio-skeleton-stagger">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderTop: '1px solid var(--border)', ...stagger(i) }}>
              <Bar width="34%" height={12} />
              <Bar width="80px" height={20} radius="9999px" />
              <Bar width="90px" height={11} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** טפסים: כותרת ושדות בשתי עמודות. */
export function FormSkeleton() {
  return (
    <div style={{ maxWidth: '760px' }}>
      <Bar width="160px" height={17} style={{ marginBottom: '20px' }} />
      <div className="rio-skeleton-stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={stagger(i)}>
            <Bar width="90px" height={11} style={{ marginBottom: '7px' }} />
            <Bar height={38} radius="var(--radius-field)" />
          </div>
        ))}
      </div>
    </div>
  );
}

const BY_SCREEN = {
  catalog: CatalogSkeleton,
  'item-detail': DetailSkeleton,
  'add-item': FormSkeleton,
  'entry-gate': FormSkeleton,
  'role-transfer': FormSkeleton,
};

/** בוחר את השלד שמתאים למסך שנטען, ונופל בחזרה לשלד טבלה. */
export default function ScreenSkeleton({ screenId }) {
  const Chosen = BY_SCREEN[screenId] || TableSkeleton;
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="ht-sr">טוען…</span>
      <Chosen />
    </div>
  );
}

/** שלד הפתיחה: תפריט הצד ואזור התוכן יחד, לפני שהמסך הראשון מוצג. */
export function BootSkeleton() {
  return (
    <>
      <aside style={{ width: '176px', flexShrink: 0, borderInlineStart: '1px solid var(--border)', background: '#fff', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 10px', borderBottom: '1px solid var(--border)', minHeight: '48px' }}>
          <Bar width="60px" height={60} radius="var(--radius-md)" />
          <Bar height={12} />
        </div>
        <div className="rio-skeleton-stagger" style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {Array.from({ length: 4 }, (_, i) => <Bar key={i} height={22} radius="var(--radius-control)" style={stagger(i)} />)}
        </div>
      </aside>
      <main style={{ flex: '1 1 auto', height: '100vh', overflow: 'hidden', padding: '18px 20px 48px' }}>
        <div role="status" aria-busy="true" aria-live="polite">
          <span className="ht-sr">טוען את קטלוג האמצעים…</span>
          <CatalogSkeleton />
        </div>
      </main>
    </>
  );
}
