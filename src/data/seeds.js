import { CURRENT_PROFILE, NAME_POOL, UNIT_POOL, DATE_POOL, ROLE_POOL, NEED_POOL } from './people.js';

// נתוני פתיחה למסכי המשתמש: מעקבים, התראות, משימות והבעות עניין.
export const MY_FOLLOWS_SEED = [
  { id: 1, itemId: 3, phone: CURRENT_PROFILE.phone, need: 'צורך בתקשורת מוצפנת לפעילות בשטח מנותק תקשורת אזרחית.', classification: 'סודי', readyForTrials: true, notes: '', date: '15.01.2025', removed: false },
  { id: 2, itemId: 4, phone: CURRENT_PROFILE.phone, need: 'נדרש חיישן ניוד לזיהוי מוקדם של מקורות חום בשטח פתוח.', classification: 'שמור', readyForTrials: false, notes: '', date: '03.02.2025', removed: false },
  { id: 3, itemId: 7, phone: CURRENT_PROFILE.phone, need: 'בחינת פלטפורמה משותפת לתיאום בין זרועות.', classification: 'סודי', readyForTrials: false, notes: '', date: '20.11.2024', removed: true },
  { id: 4, itemId: 9, phone: CURRENT_PROFILE.phone, need: 'תצפית מתמשכת מעל ציר תנועה בפעילות פלוגתית.', classification: 'שמור', readyForTrials: true, notes: '', date: '02.03.2026', removed: false },
  { id: 5, itemId: 11, phone: CURRENT_PROFILE.phone, need: 'מענה לחדירת כלים בלתי מאוישים למרחב המוגן.', classification: 'סודי', readyForTrials: false, notes: '', date: '18.03.2026', removed: false }
];

export const NOTIFICATIONS_SEED = [
  { id: 1, text: "פריט 'מערכת תקשורת מוצפנת ניידת' עבר לסטטוס זמין", type: 'עדכון סטטוס', group: 'היום', dateTime: '15.01.2025 · 09:42', itemId: 3, read: false },
  { id: 2, text: "הבעת העניין שלך בפריט 'חיישן זיהוי חום' עודכנה", type: 'עדכון סטטוס', group: 'היום', dateTime: '15.01.2025 · 08:15', itemId: 4, read: false },
  { id: 3, text: "פריט 'פלטפורמת תיאום כוחות' עבר לסטטוס בפיתוח", type: 'עדכון סטטוס', group: 'השבוע', dateTime: '12.01.2025 · 14:20', itemId: 7, read: true },
  { id: 4, text: "פריט חדש בתחום התקשורת נוסף לקטלוג", type: 'פריט חדש', group: 'השבוע', dateTime: '10.01.2025 · 11:05', itemId: 3, read: true },
  { id: 5, text: "הבעת העניין שלך בפריט 'מערכת מיגון רכב קל' עודכנה", type: 'עדכון סטטוס', group: 'מוקדם יותר', dateTime: '20.11.2024 · 09:00', itemId: 1, read: true },
  { id: 6, text: "פריט 'רחפן אספקה לוגיסטית' עבר לסטטוס ממתין לתקצוב", type: 'עדכון סטטוס', group: 'היום', dateTime: '21.03.2026 · 10:12', itemId: 12, read: false },
  { id: 7, text: "עודכן תוכן בפריט 'רחפן תצפית פלוגתי'", type: 'עדכון תוכן', group: 'היום', dateTime: '21.03.2026 · 07:40', itemId: 9, read: false },
  { id: 8, text: "פריט חדש בתחום הרחפנות נוסף לקטלוג", type: 'פריט חדש', group: 'השבוע', dateTime: '18.03.2026 · 15:25', itemId: 11, read: true }
];

export const P3_REMINDERS_RAW = [
  { id: 1, itemId: 1, refreshRate: 'רבעוני', overdueDate: '12.05.2026' },
  { id: 2, itemId: 5, refreshRate: 'שנתי', overdueDate: '01.03.2026' },
  { id: 3, itemId: 9, refreshRate: 'רבעוני', overdueDate: '10.06.2026' }
];
export const P3_DRAFTS_RAW = [
  { id: 1, name: 'רכזת חיישני קרקע (טיוטה)', created: '10.03.2026', lastSaved: '14.03.2026', source: 'טופס פריט', missingCount: 2 },
  { id: 2, name: 'ערכת ניטור רחפנים', created: '02.02.2026', lastSaved: '02.02.2026', source: 'ייבוא אצווה', missingCount: 0 },
  { id: 3, name: 'רחפן תצפית ימי (טיוטה)', created: '12.03.2026', lastSaved: '19.03.2026', source: 'טופס פריט', missingCount: 3 },
  { id: 4, name: 'ערכת סוללות מורחבת לרחפן פלוגתי', created: '05.03.2026', lastSaved: '05.03.2026', source: 'ייבוא אצווה', missingCount: 0 }
];

export const MY_ITEMS_IDS = [3, 4, 8, 9, 12];
export const PENDING_APPROVALS_RAW = [
  { id: 2, submitter: 'רס"ן יעל כהן', date: '14.03.2025', waitingDays: 3 },
  { id: 7, submitter: 'סמ"ר אבי ברק', date: '01.03.2025', waitingDays: 16 },
  { id: 11, submitter: 'סגן תמר בן חיים', date: '18.03.2026', waitingDays: 5 }
];

export const WHO_INTERESTED_DETAIL = {
  3: { people: [
    { name: 'סא"ל דנה לוי', role: 'קצינת קשר', unit: 'חטיבה 7', email: 'dana.levi@idf.il', date: '12.01.2025', need: 'צורך בתקשורת מוצפנת בשטח מנותק', ready: true },
    { name: 'רס"ן אמיר כהן', role: 'קצין לוגיסטיקה', unit: 'פיקוד הצפון', email: 'amir.cohen@idf.il', date: '18.01.2025', need: 'תחליף למערכת ישנה שאינה מאובטחת', ready: false },
    { name: 'סרן מיכל גל', role: 'קצינת מבצעים', unit: 'גדוד 51', email: 'michal.gal@idf.il', date: '02.02.2025', need: 'מענה לתרחיש ניתוק תקשורת', ready: true }
  ], totalCount: 14, unitCount: 7, readyCount: 3, firstDate: 'ינואר 2024' },
  9: { people: [
    { name: 'סא"ל רן אביטל', role: 'קצין מבצעים', unit: 'חטיבה 933', email: 'ran.avital@idf.il', date: '05.02.2026', need: 'תצפית מתמשכת מעל ציר תנועה', ready: true },
    { name: 'רס"ן שירה נבון', role: 'קצינת מודיעין', unit: 'עוצבה 36', email: 'shira.navon@idf.il', date: '19.02.2026', need: 'השלמת תמונת מודיעין ברמת פלוגה', ready: true },
    { name: 'סרן יונתן ברוך', role: 'קצין אמל"ח', unit: 'גדוד 51', email: 'yonatan.baruch@idf.il', date: '02.03.2026', need: 'תחליף לאמצעי תצפית קיים', ready: false },
    { name: 'רס"ן אורי מלכה', role: 'קצין הדרכה', unit: 'בה"ד 20', email: 'uri.malka@idf.il', date: '11.03.2026', need: 'הכשרת מפעילים ביחידות', ready: true }
  ], totalCount: 18, unitCount: 9, readyCount: 6, firstDate: 'מאי 2025' }
};
export function buildGenericWhoInterested(item) {
  const n = Math.min(item.interestedCount, 6);
  const people = [];
  for (let i = 0; i < n; i++) {
    const idx = item.id * 5 + i;
    people.push({ name: NAME_POOL[idx % NAME_POOL.length], role: ROLE_POOL[idx % ROLE_POOL.length], unit: UNIT_POOL[idx % UNIT_POOL.length], email: 'contact' + (idx % 97) + '@idf.il', date: DATE_POOL[idx % DATE_POOL.length], need: NEED_POOL[idx % NEED_POOL.length], ready: idx % 3 === 0 });
  }
  const unitCount = new Set(people.map(p => p.unit)).size;
  const readyCount = people.filter(p => p.ready).length;
  return { people, totalCount: item.interestedCount, unitCount, readyCount, firstDate: DATE_POOL[DATE_POOL.length - 1] };
}
export function getWhoInterested(item) { return WHO_INTERESTED_DETAIL[item.id] || buildGenericWhoInterested(item); }
