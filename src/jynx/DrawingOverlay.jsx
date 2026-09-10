import React from 'react';
import { createPortal } from 'react-dom';

/**
 * מצייר ציור שמור בחזרה על העמוד כשכבת SVG. הועבר מ-commando
 * (overlay/DrawingOverlay.jsx) כמו שהוא.
 *
 * הנקודות נשמרות כאחוזים מהחלון ומומרות לפיקסלים מול הגודל הנוכחי בכל
 * רינדור — כך שהציור נוחת במקום היחסי הנכון גם על מסך אחר. יחס תצוגה שונה
 * בתכלית עדיין יעוות אותו במידת מה; זה אותו פשרה שיש לכל מערכת המיקום של
 * Jynx, שאינה מודעת לפריסה רספונסיבית.
 *
 * לא מוצג כל הזמן: הנקודות והפאנל מציגים אותו רק בריחוף, כדי שעמוד עם כמה
 * ציורים לא ייראה משורבט לתמיד.
 */
export default function DrawingOverlay({ drawing }) {
  if (!drawing?.strokes?.length) return null;
  const color = drawing.color || 'var(--jynx)';

  return createPortal(
    <svg className="dev-overlay-ignore jynx-ui jynx-drawing-overlay">
      {drawing.strokes.map((s, i) => {
        const pixelPoints = s.points.map(([x, y]) => [(x / 100) * window.innerWidth, (y / 100) * window.innerHeight]);
        const pointsAttr = pixelPoints.map(([x, y]) => `${x},${y}`).join(' ');
        const isPolygon = s.type === 'polygon';
        const Tag = isPolygon ? 'polygon' : 'polyline';
        return (
          <Tag
            key={i}
            points={pointsAttr}
            fill={isPolygon ? `color-mix(in srgb, ${color} 16%, transparent)` : 'none'}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>,
    document.body,
  );
}
