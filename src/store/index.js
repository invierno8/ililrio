import { useSyncExternalStore, useMemo } from 'react';
import { RioStore } from './RioStore.js';
import { deriveVals } from './derive/index.js';

/** מופע יחיד לכל הדמו. אין התמדה — רענון הדף מחזיר את המצב ההתחלתי. */
export const rioStore = new RioStore();

/**
 * מחזיר את המצב הגולמי, את החנות (לפעולות) ואת v — הערכים הנגזרים שהמסכים
 * מציגים. הנגזרות מחושבות מחדש רק כשהמצב באמת משתנה.
 */
export function useRio() {
  const state = useSyncExternalStore(rioStore.subscribe, rioStore.getState);
  const v = useMemo(() => deriveVals(state, rioStore), [state]);
  return { state, store: rioStore, v };
}
