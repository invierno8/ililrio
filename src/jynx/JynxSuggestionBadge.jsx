import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * התג שמסמן הערה שהשאירה Jynx עצמה. הזיהוי הוא לפי שם הכותב, כדי שגם הערות
 * שכבר נכתבו יסומנו בלי צורך בשדה חדש או בהגירה.
 */
export const JYNX_AUTHOR = 'jynx';

export function isJynxAuthor(comment) {
  return String(comment?.authorName || '').trim().toLowerCase() === JYNX_AUTHOR;
}

export default function JynxSuggestionBadge() {
  return (
    <span className="comments-jynx-suggestion" title="Left automatically by Jynx while reviewing this screen">
      <Sparkles size={10} />
      <span className="comments-jynx-suggestion-mark">Jynx</span>
      automatic suggestions
    </span>
  );
}
