/**
 * מי מנהל. אותה רשימה בדיוק קיימת גם בשירות (server/auth.js) — כאן היא משמשת
 * רק כדי לדעת מה להציג, ושם היא זו שקובעת בפועל: הדפדפן אינו מקור סמכות.
 */
export const ADMIN_NAMES = ['tom', 'ilil'];

export const isAdminName = (name) => ADMIN_NAMES.includes(String(name || '').trim().toLowerCase());

export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (!then) return '';
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'עכשיו';
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  const days = Math.round(hours / 24);
  if (days < 30) return `לפני ${days} ימים`;
  return new Date(iso).toLocaleDateString('he-IL');
}
