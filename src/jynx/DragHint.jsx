import React from 'react';
import { X } from 'lucide-react';

/**
 * רמז קטן שמלמד את הדבר היחיד בפאנל שאי אפשר לנחש: שגוררים הערה על אחרת
 * כדי לקבץ אותן. שתי מלבניות זזות אחת על השנייה בלולאה, ומסגרת מקווקוות
 * נסגרת סביבן — זה כל ההסבר.
 *
 * הוא לא אמור להפריע: הוא שורה אחת בראש הרשימה, אינו חוסם כלום (האנימציה
 * עצמה pointer-events: none), נסגר ב-×, ונעלם מעצמו ברגע שנוצרה קבוצה
 * ראשונה — מי שכבר יודע לגרור לא צריך שילמדו אותו שוב.
 */
export default function DragHint({ onDismiss }) {
  return (
    <div className="jynx-drag-hint" data-devblock="jynx-drag-hint">
      <span className="jynx-drag-hint-anim" aria-hidden="true">
        <span className="jynx-drag-hint-card jynx-drag-hint-card-a" />
        <span className="jynx-drag-hint-card jynx-drag-hint-card-b" />
        <span className="jynx-drag-hint-ring" />
      </span>
      <span className="jynx-drag-hint-text">
        Drag one comment onto another to group them
      </span>
      <button type="button" className="jynx-drag-hint-close" onClick={onDismiss} title="Got it">
        <X size={11} />
      </button>
    </div>
  );
}
