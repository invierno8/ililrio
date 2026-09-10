import { useEffect, useRef, useState } from 'react';

/**
 * המקש שמחזיקים כדי להעיר על אלמנט.
 *
 * הזרימה: מחזיקים את המקש — כל מה שעוברים מעליו מקבל מסגרת סגולה — ולוחצים,
 * וקופסת ההערה נפתחת על מה שנלחץ. בלי להחזיק, העמוד מתנהג רגיל לגמרי.
 *
 * כל מקש כשר, לא רק מקשי-צירוף: אפשר להחזיק Q ולהקליק בדיוק כמו ⌘. ההבדל
 * היחיד הוא איך יודעים שהוא מוחזק — מקש-צירוף נישא על אירוע הקליק עצמו, ואת
 * שאר המקשים צריך לעקוב דרך keydown/keyup. כאן עוקבים אחרי שניהם באותה צורה,
 * ולמקשי-הצירוף מוסיפים גם את מה שהאירוע מספר, כדי שלחיצה שהתחילה לפני
 * שהחלון קיבל פוקוס לא תתפספס.
 *
 * הבחירה שייכת למשתמש: היא נשמרת תחת מפתח שכולל את מזהה המשתמש, כך שהחלפה
 * אצל אחד אינה משנה דבר אצל אחר שנכנס מאותו מחשב. בלי העדפה שמורה — ברירת
 * המחדל נגזרת מהמערכת.
 */

const KEY_PREFIX = 'jynx-hotkey-modifier';
const PLAIN_PREFIX = 'key:';

export const MODIFIERS = {
  meta: { prop: 'metaKey', symbol: '⌘', label: 'Command' },
  ctrl: { prop: 'ctrlKey', symbol: 'Ctrl', label: 'Control' },
  alt: { prop: 'altKey', symbol: '⌥', label: 'Option' },
  shift: { prop: 'shiftKey', symbol: '⇧', label: 'Shift' },
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
 * ברירת המחדל לפי המערכת: ⌘ ב-macOS, Ctrl בכל השאר. זו אינה רק שאלת תווית —
 * ב-macOS, Ctrl+קליק הוא לחיצה ימנית והדפדפן כלל לא שולח אירוע click.
 */
export function detectPlatformModifier() {
  return isMacPlatform() ? 'meta' : 'ctrl';
}

export const isPlainKey = (hotkey) => String(hotkey || '').startsWith(PLAIN_PREFIX);
export const plainKeyOf = (hotkey) => String(hotkey || '').slice(PLAIN_PREFIX.length);
export const asPlainKey = (key) => PLAIN_PREFIX + String(key).toLowerCase();

/** שם קריא של המקש הנבחר. */
export function hotkeyLabel(hotkey) {
  if (isPlainKey(hotkey)) {
    const k = plainKeyOf(hotkey);
    if (k === ' ') return 'Space';
    return k.length === 1 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1);
  }
  const spec = MODIFIERS[hotkey] || MODIFIERS[detectPlatformModifier()];
  if (hotkey === 'alt') return isMacPlatform() ? 'Option' : 'Alt';
  return spec.label;
}

/** הסימן שמוצג בשורת הרמז ובקופסת ההערה. */
export function hotkeySymbol(hotkey) {
  if (isPlainKey(hotkey)) return hotkeyLabel(hotkey);
  return (MODIFIERS[hotkey] || MODIFIERS[detectPlatformModifier()]).symbol;
}

/** ממפה אירוע מקלדת לבחירה — מקש-צירוף אם נלחץ כזה, אחרת המקש עצמו. */
export function hotkeyFromEvent(e) {
  if (e.key === 'Meta') return 'meta';
  if (e.key === 'Control') return 'ctrl';
  if (e.key === 'Alt') return 'alt';
  if (e.key === 'Shift') return 'shift';
  if (!e.key || e.key === 'Escape' || e.key === 'Tab') return null;
  return asPlainKey(e.key);
}

/** שדה שמקלידים בו — שם מקש רגיל הוא תו ולא קיצור. */
export function isTypingTarget(el) {
  if (!el) return false;
  return /^(input|textarea|select)$/i.test(el.tagName || '') || !!el.isContentEditable;
}

const storageKey = (userId) => `${KEY_PREFIX}:${userId || 'anon'}`;
const isKnown = (v) => !!v && (MODIFIERS[v] || String(v).startsWith(PLAIN_PREFIX));

function load(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return isKnown(raw) ? raw : detectPlatformModifier();
  } catch {
    return detectPlatformModifier();
  }
}

export function useHotkeyModifier(userId) {
  const [hotkey, setHotkey] = useState(() => load(userId));
  useEffect(() => { setHotkey(load(userId)); }, [userId]);

  const choose = (next) => {
    setHotkey(next);
    try { localStorage.setItem(storageKey(userId), next); } catch { /* אחסון חסום */ }
  };

  return [hotkey, choose];
}

/**
 * האם המקש מוחזק ממש עכשיו. מוחזר גם כ-ref, כדי שמטפלי אירועים יוכלו לקרוא
 * את הערך העדכני בלי להירשם מחדש בכל שינוי.
 */
export function useHotkeyHeld(hotkey) {
  const [held, setHeld] = useState(false);
  const heldRef = useRef(false);

  useEffect(() => {
    const plain = isPlainKey(hotkey);
    const wanted = plain ? plainKeyOf(hotkey) : null;
    const spec = plain ? null : (MODIFIERS[hotkey] || MODIFIERS[detectPlatformModifier()]);

    const apply = (v) => { heldRef.current = v; setHeld(v); };

    function onKeyDown(e) {
      // מקש רגיל שנלחץ בתוך שדה טקסט הוא פשוט תו שמקלידים, לא קיצור: אחרת
      // כתיבת האות בגוף ההערה הייתה מדליקה את המצב, והקליק הבא על "שלח"
      // היה נתפס כקליק-עם-מקש.
      if (plain) { if (!isTypingTarget(e.target) && String(e.key).toLowerCase() === wanted) apply(true); }
      else apply(!!e[spec.prop]);
    }
    function onKeyUp(e) {
      if (plain) { if (String(e.key).toLowerCase() === wanted) apply(false); }
      else apply(!!e[spec.prop]);
    }
    // תנועת עכבר נושאת ממילא את מצב מקשי-הצירוף, וזה מכסה מקש שנלחץ לפני
    // שהחלון קיבל פוקוס. למקש רגיל אין מקבילה, ולכן שם מסתמכים על keydown.
    function onMove(e) { if (!plain) apply(!!e[spec.prop]); }
    const clear = () => apply(false);

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('mousemove', onMove, true);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
      apply(false);
    };
  }, [hotkey]);

  return [held, heldRef];
}

/**
 * האם האירוע נחשב "עם המקש". למקש רגיל אין דרך לדעת מהאירוע עצמו, ולכן
 * ההחלטה נשענת על המצב שנעקב; למקש-צירוף מקבלים גם את מה שהאירוע מספר.
 */
export function hasHotkey(e, hotkey, heldNow) {
  if (isPlainKey(hotkey)) return !!heldNow;
  const spec = MODIFIERS[hotkey] || MODIFIERS[detectPlatformModifier()];
  return !!e[spec.prop] || !!heldNow;
}
