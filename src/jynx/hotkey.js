import { useEffect, useState } from 'react';

/**
 * המקש שמחזיקים כדי להעיר על אלמנט.
 *
 * ב-commando הרשימה קבועה (⌘ או Ctrl) והבחירה משנה רק את התווית, כי שם תמיד
 * מתקבלים שניהם. כאן, לפי בקשה, הבחירה היא זו שקובעת בפועל, והיא נלכדת מהמקש
 * שבאמת לוחצים: פותחים את כרטיס הלכידה, מחזיקים מקש, וזה נהיה המקש.
 *
 * ברירת המחדל נגזרת מהמערכת. ב-macOS אי אפשר להשתמש ב-Ctrl+קליק — המערכת
 * מתרגמת אותו ללחיצה ימנית ואירוע ה-click כלל לא נורה — ולכן שם ⌘.
 */

const KEY = 'jynx-hotkey-modifier';

export const MODIFIERS = {
  meta: { prop: 'metaKey', symbol: '⌘', label: 'Command' },
  ctrl: { prop: 'ctrlKey', symbol: 'Ctrl', label: 'Control' },
  alt: { prop: 'altKey', symbol: '⌥', label: 'Option/Alt' },
  shift: { prop: 'shiftKey', symbol: '⇧', label: 'Shift' },
};

/** ממפה אירוע מקלדת למזהה מקש-מחזיק, או null אם נלחץ מקש שאי אפשר להחזיק. */
export function modifierFromEvent(e) {
  if (e.key === 'Meta' || e.metaKey) return 'meta';
  if (e.key === 'Control' || e.ctrlKey) return 'ctrl';
  if (e.key === 'Alt' || e.altKey) return 'alt';
  if (e.key === 'Shift' || e.shiftKey) return 'shift';
  return null;
}

export function detectPlatformModifier() {
  try {
    const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
    // ב-macOS, Ctrl+קליק הוא לחיצה ימנית ולא מגיע כ-click בכלל.
    return /mac|iphone|ipad/i.test(platform) ? 'meta' : 'ctrl';
  } catch {
    return 'ctrl';
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return MODIFIERS[raw] ? raw : detectPlatformModifier();
  } catch {
    return detectPlatformModifier();
  }
}

export function useHotkeyModifier() {
  const [modifier, setModifier] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, modifier); } catch { /* אחסון חסום */ }
  }, [modifier]);

  return [modifier, setModifier];
}

/** האם האירוע מחזיק את המקש שנבחר? */
export function hasHotkey(e, modifier) {
  const spec = MODIFIERS[modifier] || MODIFIERS[detectPlatformModifier()];
  return !!e[spec.prop];
}
