// מאגרי שמות, יחידות ותאריכים לבניית נתוני הדגמה, ופרופיל המשתמש הנוכחי.
export const NAME_POOL = ['סרן דנה לוי','רס"ן עומר כהן','סגן מור אביטן','רס"ר יובל שרון','סרן נועה גל','סגן אלון פרץ','רב"ט שירה מזרחי','טוראי עידן ברק','סרן גיל שחר','רס"ן טל אשכנזי'];
export const UNIT_POOL = ['יחידה 8200','זרוע אמל"ח','חטיבה 401','אוגדה 162','פיקוד הצפון','פיקוד הדרום','חיל האוויר','חיל הים'];
export const DATE_POOL = ['01.2026','02.2026','03.2026','04.2026','11.2025','12.2025'];

export const ROLE_POOL = ['קצין אמל"ח', 'קצינת פיתוח', 'קצין לוגיסטיקה', 'קצינת מבצעים', 'קצין תקשוב'];
export const NEED_POOL = ['נדרש לצורך תרגיל קרוב', 'מחליף ציוד קיים שאינו עומד בדרישות', 'נבחן כפתרון להשלמת פער תפעולי'];

export const BODY_OPTIONS = ['זרוע אמל"ח'];
export const OWNER_POOL = ['רס"ן יעל כהן', 'סגן רועי דגן', 'רס"ן דורון שדה', 'ד"ר נעם פלד', 'סרן הדר וייס', 'סגן עדי לביא', 'רס"ן גיא פישר', 'סרן מאיה כץ', 'רס"ן עידו שרעבי', 'סגן תמר בן חיים'];
export const REFRESH_POOL = ['רבעוני', 'חצי שנתי', 'שנתי'];

export const CURRENT_USER = 'רס"ן אבי כרמי';
export const CURRENT_PROFILE = { name: CURRENT_USER, role: 'קצין אמל"ח', unit: 'פיקוד הצפון', email: 'avi.carmi@idf.il', phone: '050-1112233' };

export function buildInterested(id, count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const idx = id * 3 + i;
    list.push({ name: NAME_POOL[idx % NAME_POOL.length], unit: UNIT_POOL[idx % UNIT_POOL.length], date: DATE_POOL[idx % DATE_POOL.length] });
  }
  return list;
}
