import { ITEMS } from './items.js';
import { AXIS_TYPE_VALUES, AXIS_DOMAIN_VALUES, CLASSIFICATION_VALUES, DOC_TYPE_VALUES } from './taxonomy.js';

// נתוני מסכי המפעיל: משתמשים, רשימות מנוהלות, שער הכניסה ויומן הפעולות.
export const P4_PERMISSION_OPTIONS = ['בעל פריט', 'מזין תוכן', 'מפעיל', 'צרכן מבצעי'];
export const P4_USERS_SEED = [
  { id: 'u1', name: 'רס"ן אבי כרמי', orgId: '4471982', orgRole: 'קצין אמל"ח', body: 'פיקוד הצפון', email: 'avi.carmi@idf.il', phone: '050-1112233', role: 'צרכן מבצעי', body2: '', status: 'active', classification: '', approverId: '', isApprover: false, directPublish: false },
  { id: 'u2', name: 'רס"ן יעל כהן', orgId: '5512034', orgRole: 'קצינת אמל"ח', body: 'מפא"ת', email: 'yael.cohen@idf.il', phone: '050-2223344', role: 'בעל פריט', status: 'active', classification: '', approverId: '', isApprover: true, directPublish: false },
  { id: 'u3', name: 'סגן רועי דגן', orgId: '6023981', orgRole: 'קצין פיתוח', body: 'זרוע אמל"ח', email: 'roi.dagan@idf.il', phone: '050-3334455', role: 'בעל פריט', status: 'active', classification: '', approverId: '', isApprover: false, directPublish: false },
  { id: 'u4', name: 'רס"ר טל אשכנזי', orgId: '3390221', orgRole: 'מזין תוכן', body: 'חט"ל', email: 'tal.ashkenazi@idf.il', phone: '050-4445566', role: 'מזין תוכן', status: 'active', classification: '', approverId: 'u2', isApprover: false, directPublish: false },
  { id: 'u5', name: 'סרן נועה גל', orgId: '7745103', orgRole: 'מזינת תוכן', body: 'מפא"ת', email: 'noa.gal@idf.il', phone: '050-5556677', role: 'מזין תוכן', status: 'active', classification: '', approverId: 'u2', isApprover: false, directPublish: true },
  { id: 'u6', name: 'רס"ן דורון שדה', orgId: '2287556', orgRole: 'קצין מפעיל מערכת', body: 'אג"ת', email: 'doron.sade@idf.il', phone: '050-6667788', role: 'מפעיל', status: 'active', classification: '', approverId: '', isApprover: true, directPublish: false },
  { id: 'u8', name: 'סרן מאיה כץ', orgId: '9120344', orgRole: 'קצינת אמל"ח אווירי', body: 'זרוע אמל"ח', email: 'maya.katz@idf.il', phone: '050-8889900', role: 'בעל פריט', status: 'active', classification: '', approverId: '', isApprover: false, directPublish: false },
  { id: 'u9', name: 'רס"ן עידו שרעבי', orgId: '4478215', orgRole: 'קצין תקשוב', body: 'זרוע אמל"ח', email: 'ido.sharabi@idf.il', phone: '050-9900112', role: 'בעל פריט', status: 'active', classification: '', approverId: '', isApprover: false, directPublish: false },
  { id: 'u10', name: 'סגן תמר בן חיים', orgId: '5566773', orgRole: 'מזינת תוכן', body: 'מפא"ת', email: 'tamar.benhaim@idf.il', phone: '050-1234567', role: 'מזין תוכן', status: 'active', classification: '', approverId: 'u2', isApprover: false, directPublish: false },
  { id: 'u7', name: 'סגן עדי לביא', orgId: '8814720', orgRole: 'קצינת תיאום', body: 'זרוע אמל"ח', email: 'adi.lavi@idf.il', phone: '050-7778899', role: 'בעל פריט', status: 'disabled', classification: '', approverId: '', isApprover: false, directPublish: false }
];
export const P4_BODY_OPTIONS_LIST = Array.from(new Set(P4_USERS_SEED.map(u => u.body)));

export const MANAGED_LISTS_SEED = [
  { id: 'body', name: 'גוף אחראי', gap: null, values: [
    { name: 'מפא"ת', usage: 3, active: true }, { name: 'זרוע אמל"ח', usage: 3, active: true },
    { name: 'חט"ל', usage: 2, active: true }, { name: 'אג"ת', usage: 1, active: true }
  ] },
  { id: 'axisType', name: 'ציר סוג האמצעי', gap: 'ערכים משוערים. ממצא 5', values: AXIS_TYPE_VALUES.map(v => ({ name: v, usage: ITEMS.filter(it => it.type === v).length, active: true })) },
  { id: 'axisDomain', name: 'ציר זירה או תחום', gap: 'ערכים משוערים. ממצא 5', values: AXIS_DOMAIN_VALUES.map(v => ({ name: v, usage: ITEMS.filter(it => it.domain === v).length, active: true })) },
  { id: 'classification', name: 'רמת סיווג', gap: 'ערכים משוערים. ממצא 1', values: CLASSIFICATION_VALUES.map(v => ({ name: v, usage: ITEMS.filter(it => it.classification === v).length, active: true })) },
  { id: 'docType', name: 'סוג מסמך', gap: 'ערכים משוערים. ממצא 54', values: DOC_TYPE_VALUES.map(v => ({ name: v, usage: ITEMS.filter(it => (it.attachments || []).some(a => a.docType === v)).length, active: true })) },
  { id: 'refreshRate', name: 'קצב רענון', gap: null, values: [
    { name: 'רבעוני', usage: 4, active: true }, { name: 'חצי שנתי', usage: 2, active: true }, { name: 'שנתי', usage: 2, active: true }
  ] }
];

export const GATE_RULES_SEED = [
  { id: 1, name: 'התחברות דרך ספק זהות ארגוני', checkType: 'אימות זהות בכניסה למערכת', requiredValue: '', failureMsg: 'לא ניתן לאמת את זהותך. פנה לגורם התמיכה הארגוני.', active: true, changedLabel: '' },
  { id: 2, name: 'בדיקת סיווג מול קבוצת AD', checkType: 'התאמת רמת סיווג בכניסה', requiredValue: '', failureMsg: 'רמת הסיווג שלך אינה תואמת את דרישות המערכת.', active: true, changedLabel: '' },
  { id: 3, name: 'אישור תנאי שימוש', checkType: 'אישור חד פעמי בכניסה ראשונה', requiredValue: '', failureMsg: 'יש לאשר את תנאי השימוש כדי להמשיך.', active: false, changedLabel: 'שונה לאחרונה ב-04.2026' }
];

export const LOG_ROWS_SEED = [
  { id: 1, dateTime: '19.08.2026 · 08:12', user: 'רס"ן יעל כהן', action: 'אישור פרסום פריט', entity: 'מערכת מיגון רכב קל', result: 'הצליח' },
  { id: 2, dateTime: '18.08.2026 · 16:40', user: 'רס"ר טל אשכנזי', action: 'שליחת פריט לאישור', entity: 'כלי סיוע לסגל פיקוד', result: 'הצליח' },
  { id: 3, dateTime: '18.08.2026 · 11:05', user: 'רס"ן דורון שדה', action: 'השבתת משתמש', entity: 'סגן עדי לביא', result: 'הצליח' },
  { id: 4, dateTime: '17.08.2026 · 09:50', user: 'סרן נועה גל', action: 'ייבוא אצווה', entity: '18 שורות', result: 'הצליח חלקית' },
  { id: 5, dateTime: '16.08.2026 · 14:22', user: 'רס"ן דורון שדה', action: 'הוספת חבר לקבוצת מאשרים', entity: 'רס"ן דורון שדה', result: 'הצליח' },
  { id: 6, dateTime: '15.08.2026 · 10:03', user: 'רס"ן יעל כהן', action: 'החזרת פריט עם הערה', entity: 'ציוד איסוף אותות שדה', result: 'הצליח' },
  { id: 7, dateTime: '20.03.2026 · 09:15', user: 'סגן תמר בן חיים', action: 'שליחת פריט לאישור', entity: 'מערכת גילוי ונטרול רחפנים', result: 'הצליח' },
  { id: 8, dateTime: '20.03.2026 · 11:48', user: 'סרן מאיה כץ', action: 'אישור פרסום פריט', entity: 'רחפן תצפית פלוגתי', result: 'הצליח' },
  { id: 9, dateTime: '21.03.2026 · 08:05', user: 'רס"ן דורון שדה', action: 'הוספת בעל פריט', entity: 'רס"ן עידו שרעבי', result: 'הצליח' }
];
export const TAGS_SEED = Array.from(new Set(ITEMS.flatMap(it => it.tags || []))).map(name => ({ name, usage: ITEMS.filter(it => (it.tags || []).includes(name)).length, active: true }));
