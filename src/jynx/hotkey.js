import { useEffect, useState } from 'react';

/**
 * המקש שמחזיקים כדי להעיר על אלמנט.
 *
 * הזרימה: מחזיקים את המקש — כל מה שעוברים מעליו מקבל מסגרת סגולה — ולוחצים,
 * וקופסת ההערה נפתחת על מה שנלחץ. בלי להחזיק, העמוד מתנהג רגיל לגמרי.
 *
 * הבחירה שייכת למשתמש ולא לדפדפן: היא נשמרת תחת מפתח שכולל את מזהה המשתמש,
 * כך שהחלפת מקש אצל אחד אינה משנה דבר אצל אחר שנכנס מאותו מחשב. ברירת המחדל,
 * ובכל מקרה שאין העדפה שמורה, נגזרת מהמערכת.
 */

const KEY_PREFIX = 'jynx-hotkey-modifier';

export const MODIFIERS = {
  meta: { prop: 'metaKey', symbol: '⌘', label: 'Command', keys: ['Meta'] },
  ctrl: { prop: 'ctrlKey', symbol: 'Ctrl', label: 'Control', keys: ['Control'] },
  alt: { prop: 'altKey', symbol: '⌥', label: 'Option', keys: ['Alt'] },
  shift: { prop: 'shiftKey', symbol: '⇧', label: 'Shift', keys: ['Shift'] },
};

export function isMacPlatform() {
  try {
    const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
    return /mac|iphone|ipad/i.test(platform);
  } catch {
    return false;
  }
}

/**
 * ברירת המחדל לפי המערכת שממנה נכנסים: ⌘ ב-macOS, Ctrl בכל השאר. זו אינה
 * רק שאלת תווית — ב-macOS, Ctrl+קליק הוא לחיצה ימנית והדפדפן כלל לא שולח
 * אירוע click, כך ש-Ctrl פשוט לא יכול לשמש שם.
 */
export function detectPlatformModifier() {
  return isMacPlatform() ? 'meta' : 'ctrl';
}

/** ⌥ ב-macOS נקרא Option, ובחלונות Alt — אותו מקש, שם אחר. */
export function labelFor(modifier) {
  const spec = MODIFIERS[modifier] || MODIFIERS[detectPlatformModifier()];
  if (modifier === 'alt') return isMacPlatform() ? 'Option' : 'Alt';
  return spec.label;
}

const storageKey = (userId) => `${KEY_PREFIX}:${userId || 'anon'}`;

function load(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return MODIFIERS[raw] ? raw : detectPlatformModifier();
  } catch {
    return detectPlatformModifier();
  }
}

/** ההעדפה של המשתמש הנוכחי. משתמש אחר על אותו מחשב מקבל את שלו. */
export function useHotkeyModifier(userId) {
  const [modifier, setModifier] = useState(() => load(userId));

  useEffect(() => { setModifier(load(userId)); }, [userId]);

  const choose = (next) => {
    setModifier(next);
    try { localStorage.setItem(storageKey(userId), next); } catch { /* אחסון חסום */ }
  };

  return [modifier, choose];
}

/** ממפה אירוע מקלדת למזהה מקש-מחזיק, או null אם נלחץ מקש שאי אפשר להחזיק. */
export function modifierFromEvent(e) {
  if (e.key === 'Meta' || e.metaKey) return 'meta';
  if (e.key === 'Control' || e.ctrlKey) return 'ctrl';
  if (e.key === 'Alt' || e.altKey) return 'alt';
  if (e.key === 'Shift' || e.shiftKey) return 'shift';
  return null;
}

/** האם האירוע מחזיק את המקש שנבחר? */
export function hasHotkey(e, modifier) {
  const spec = MODIFIERS[modifier] || MODIFIERS[detectPlatformModifier()];
  return !!e[spec.prop];
}

/**
 * האם המקש מוחזק ממש עכשיו.
 *
 * גם מקלדת וגם עכבר: keydown/keyup הם המקור, אבל כל תנועת עכבר נושאת ממילא
 * את מצב המקשים, וזה מה שמכסה מקרים שבהם ה-keydown עצמו לא הגיע לחלון —
 * למשל מקש שנלחץ לפני שהפוקוס חזר לדף. blur מנקה, כדי שהמצב לא ייתקע דלוק
 * אחרי מעבר לחלון אחר עם המקש לחוץ.
 */
export function useHotkeyHeld(modifier) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const spec = MODIFIERS[modifier] || MODIFIERS[detectPlatformModifier()];
    const sync = (e) => setHeld(!!e[spec.prop]);
    const clear = () => setHeld(false);

    window.addEventListener('keydown', sync, true);
    window.addEventListener('keyup', sync, true);
    window.addEventListener('mousemove', sync, true);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    return () => {
      window.removeEventListener('keydown', sync, true);
      window.removeEventListener('keyup', sync, true);
      window.removeEventListener('mousemove', sync, true);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
    };
  }, [modifier]);

  return held;
}
