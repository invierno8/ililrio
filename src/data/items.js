import { buildInterested } from './people.js';
import { STATUS_INFO, STATUS_VARIANT } from './taxonomy.js';

// פריטי הקטלוג. RAW_ITEMS הוא המקור, ITEMS מוסיף ברירות מחדל ושדות נגזרים.
export const RAW_ITEMS = [
  {
    id: 1, name: 'מערכת מיגון רכב קל', body: 'מפא"ת',
    desc: 'מערכת הגנה משולבת לרכבים קלים בפעילות מבצעית.',
    status: 'זמין', type: 'אמצעי מיגון והגנה', domain: 'יבשה',
    classification: 'שמור', interestedCount: 7, tags: ['מיגון', 'ניוד'],
    mekat: 'MG-1042', updated: '12.03.2026', owner: 'רס"ן יעל כהן',
    contact: 'סרן איתי בר', contactRole: 'קצין אמל"ח',
    procurement: 'פנייה לקצין הצטיידות עם מק"ט ומספר יחידה',
    limitations: 'אינה מותאמת לרכבים בעלי גג פתוח. ההתקנה מוציאה את הרכב משירות ליומיים.',
    experience: 'הותקנה בשלוש חטיבות. הצוותים מדווחים על ירידה בשדה הראייה הצדי.',
    attributes: [
      { label: 'רמת ההגנה', value: 'דרגה ב' },
      { label: 'משקל', value: '145 ק"ג לרכב' },
      { label: 'שטח כיסוי', value: 'תא נוסעים ודלתות' },
      { label: 'תנאי אחסון', value: 'מחסן מקורה, ללא דרישת בקרת אקלים' }
    ],
    trials: [
      { name: 'ניסוי ירי', date: 'מרץ 2025', outcome: 'עמד בדרישות בכל זוויות הפגיעה' },
      { name: 'ניסוי ניידות', date: 'יולי 2025', outcome: 'ירידה של 8% בטווח הנסיעה' }
    ],
    attachments: [
      { ext: 'PDF', name: 'מפרט מיגון רכב קל', docType: 'מפרט טכני', desc: 'מבנה הערכה ורשימת החלקים.', classification: 'שמור' },
      { ext: 'PDF', name: 'דוח ניסוי ירי', docType: 'דוח ניסוי', desc: 'תוצאות מלאות של סבב הניסוי במרץ 2025.', classification: 'סודי' },
      { ext: 'DOCX', name: 'הנחיות התקנה ליחידה', docType: 'הוראות הפעלה', desc: 'שלבי ההתקנה וזמני ההשבתה הצפויים.', classification: 'בלמ"ס' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'רכב מוגן בפריסה מבצעית.' },
      { type: 'image', badge: 'IMG', desc: 'מבט על ערכת הדלת המוגנת.' },
      { type: 'video', badge: 'VID', desc: 'תיעוד תהליך ההתקנה.' }
    ]
  },
  {
    id: 2, name: 'ציוד איסוף אותות שדה', body: 'זרוע אמל"ח',
    desc: 'ציוד ניוד לאיסוף וניתוח אותות אלקטרומגנטיים בשטח.',
    status: 'בפיתוח', type: 'אמצעי חישה ואיסוף', domain: 'סייבר ותקשוב',
    classification: 'סודי', interestedCount: 2, tags: ['מודיעין', 'חישה', 'ניוד'],
    mekat: 'SG-2087', updated: '02.02.2026', owner: 'סגן רועי דגן',
    contact: 'רס"ן מיכל אור', contactRole: 'קצינת פיתוח',
    procurement: 'פנייה לגורם הפיתוח האחראי בזרוע',
    limitations: 'הפעולה דורשת מפעיל מוסמך. אינו פועל בתנועה.',
    experience: 'נבחן בשני תרגילי גדוד. זמן ההתכוננות ארוך מהמתוכנן.',
    attributes: [
      { label: 'טווח גילוי', value: 'עד 4 ק"מ בתנאי שטח פתוח' },
      { label: 'תחום קליטה', value: 'רחב, לפי הגדרת המפעיל' },
      { label: 'זמן התכוננות', value: '25 דקות' },
      { label: 'צריכת הספק', value: 'סוללה נטענת, 6 שעות עבודה' },
      { label: 'ממשק פלט', value: 'ייצוא לתחנת ניתוח' }
    ],
    trials: [{ name: 'ניסוי שדה ראשון', date: 'נובמבר 2025', outcome: 'זיהוי תקין, זמן התכוננות חורג' }],
    attachments: [
      { ext: 'PDF', name: 'מסמך אפיון ראשוני', docType: 'מפרט טכני', desc: 'תיאור היכולת בשלב הפיתוח הנוכחי.', classification: 'סודי' },
      { ext: 'PPTX', name: 'מצגת סטטוס פיתוח', docType: 'מצגת יצרן', desc: 'מצב הפרויקט ואבני הדרך הקרובות.', classification: 'שמור' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'הערכה במצב נשיאה.' },
      { type: 'image', badge: 'IMG', desc: 'ממשק המפעיל.' }
    ]
  },
  {
    id: 3, name: 'מערכת תקשורת מוצפנת ניידת', body: 'חט"ל',
    desc: 'מערכת תקשורת קולית ונתונים מוצפנת לפריסה ניידת.',
    status: 'זמין', type: 'אמצעי תקשוב ותקשורת', domain: 'רב-זירתי',
    classification: 'סודי', interestedCount: 14, tags: ['תקשורת', 'ניוד'],
    mekat: 'CM-3311', updated: '28.02.2026', owner: 'רס"ן דורון שדה',
    contact: 'סא"ל דוד לוי', contactRole: 'קצין אמל"ח זרועי',
    procurement: 'פנייה לקצין הצטיידות הזרועי עם מק"ט ומספר יחידה',
    limitations: 'אינה תואמת לתשתיות ישנות מדור ג. מחייבת הכשרה של שלושה ימים לפחות.',
    experience: 'נבדקה בתרגיל רמת אוגדה ועמדה בדרישות בתנאי לחץ.',
    attributes: [
      { label: 'סוג ההצפנה', value: 'הצפנת חומרה מאושרת' },
      { label: 'מספר ערוצים', value: '8 ערוצים במקביל' },
      { label: 'טווח קשר', value: 'עד 30 ק"מ עם ממסר' },
      { label: 'מקור מתח', value: 'סוללה נטענת או מתח רכב' },
      { label: 'משקל', value: '9 ק"ג כולל אנטנה' }
    ],
    trials: [
      { name: 'ניסוי א', date: 'ינואר 2024', outcome: 'עמד בדרישות' },
      { name: 'ניסוי ב', date: 'יוני 2024', outcome: 'נכשל בתנאי גשם, תוקן' }
    ],
    attachments: [
      { ext: 'PDF', name: 'מצגת טכנית', docType: 'מצגת יצרן', desc: 'סקירת היכולת והרכיבים.', classification: 'שמור' },
      { ext: 'DOCX', name: 'כתב עבודה', docType: 'כתב עבודה', desc: 'היקף האספקה וההדרכה.', classification: 'בלמ"ס' },
      { ext: 'PDF', name: 'נספח בטיחות קרינה', docType: 'נספח בטיחות', desc: 'מרחקי בטיחות בהפעלה ממושכת.', classification: 'בלמ"ס' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'המערכת בפריסה מבצעית.' },
      { type: 'image', badge: 'IMG', desc: 'ממשק ההפעלה מקרוב.' },
      { type: 'video', badge: 'VID', desc: 'הדגמת תהליך ההפעלה השלם.' },
      { type: 'image', badge: 'IMG', desc: 'ערכת הנשיאה.' }
    ]
  },
  {
    id: 4, name: 'חיישן זיהוי חום', body: 'מפא"ת',
    desc: 'חיישן זיהוי מרחוק מבוסס הדמיה תרמית.',
    status: 'ממתין לתקצוב', type: 'אמצעי חישה ואיסוף', domain: 'יבשה',
    classification: 'שמור', interestedCount: 1, tags: ['חישה', 'מודיעין'],
    mekat: 'HS-4420', updated: '05.01.2026', owner: 'ד"ר נעם פלד',
    contact: 'רס"ן איתן צור', contactRole: 'קצין מו"פ',
    procurement: 'ממתין לאישור תקציבי בטרם פתיחת מסלול הזמנה',
    limitations: 'ביצועי הגילוי יורדים בערפל ובגשם. אינו מבחין בין מקורות חום סמוכים.',
    experience: 'לא תועד',
    attributes: [
      { label: 'טווח גילוי', value: 'עד 1.5 ק"מ, אדם בשטח פתוח' },
      { label: 'תחום קליטה', value: 'תרמי ארוך גל' },
      { label: 'זמן התכוננות', value: '4 דקות' },
      { label: 'צריכת הספק', value: '12 שעות בסוללה אחת' },
      { label: 'ממשק פלט', value: 'וידאו לתצוגה ניידת' }
    ],
    trials: [],
    attachments: [
      { ext: 'PDF', name: 'הצעת מו"פ', docType: 'מפרט טכני', desc: 'תיאור הרעיון ובקשת התקצוב.', classification: 'שמור' }
    ],
    gallery: [{ type: 'image', badge: 'IMG', desc: 'אב טיפוס במעבדה.' }]
  },
  {
    id: 5, name: 'כלי סיוע לסגל פיקוד', body: 'אג"ת',
    desc: 'כלי תמיכת החלטה לחדרי מצב ופיקוד ושליטה.',
    status: 'בפיתוח', type: 'מערכת תומכת החלטה', domain: 'רב-זירתי',
    classification: 'סודי', interestedCount: 5, tags: ['תיאום', 'תקשורת'],
    mekat: 'CS-5561', updated: '19.02.2026', owner: 'סרן הדר וייס',
    contact: 'רס"ן אורי נחמיאס', contactRole: 'קצין מערכות מידע',
    procurement: 'פנייה לגורם הפיתוח באגף התקשוב',
    limitations: 'פועל ברשת הארגונית בלבד. אין גרסה ניידת.',
    experience: 'בשימוש בשני חדרי מצב כפיילוט. המשוב מצביע על עומס מסך.',
    attributes: [
      { label: 'סוג הפריסה', value: 'שרת ארגוני מרכזי' },
      { label: 'משתמשים במקביל', value: 'עד 40' },
      { label: 'ממשקים למערכות', value: 'שתי מערכות מצב קיימות' },
      { label: 'דרישות תשתית', value: 'עמדת קצה סטנדרטית' }
    ],
    trials: [{ name: 'פיילוט חדר מצב', date: 'דצמבר 2025', outcome: 'שימוש רציף, נדרשה הפחתת שדות בתצוגה' }],
    attachments: [
      { ext: 'PDF', name: 'מסמך דרישות', docType: 'מפרט טכני', desc: 'הדרישות התפקודיות של הכלי.', classification: 'שמור' },
      { ext: 'DOCX', name: 'סיכום פיילוט', docType: 'דוח ניסוי', desc: 'ממצאי השימוש בשני חדרי המצב.', classification: 'סודי' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'מסך תמונת המצב.' },
      { type: 'image', badge: 'IMG', desc: 'עמדת עבודה בחדר מצב.' }
    ]
  },
  {
    id: 6, name: 'מערכת ניהול חירום', body: 'חט"ל',
    desc: 'מערכת לניהול אירועי חירום ותיאום כוחות הצלה.',
    status: 'זמין', type: 'מערכת תומכת החלטה', domain: 'יבשה',
    classification: 'שמור', interestedCount: 9, tags: ['חירום', 'תיאום'],
    mekat: 'EM-6674', updated: '01.03.2026', owner: 'רס"ן שרון מזור',
    contact: 'סרן יובל רם', contactRole: 'קצין חירום ומוכנות',
    procurement: 'פנייה לקצין הצטיידות עם מק"ט ומספר יחידה',
    limitations: 'אינה מחליפה מוקד טלפוני. תלויה בקישוריות רציפה.',
    experience: 'הופעלה בשלושה אירועי אמת ובתרגיל פיקודי.',
    attributes: [
      { label: 'סוג הפריסה', value: 'שרת ארגוני עם גישת דפדפן' },
      { label: 'משתמשים במקביל', value: 'עד 200' },
      { label: 'ממשקים למערכות', value: 'מערכת התרעה פיקודית' },
      { label: 'דרישות תשתית', value: 'רשת ארגונית בלבד' }
    ],
    trials: [{ name: 'תרגיל פיקודי', date: 'אוקטובר 2025', outcome: 'עמדה בעומס, נדרש שיפור בדיווח שדה' }],
    attachments: [
      { ext: 'PDF', name: 'מדריך מפעיל', docType: 'הוראות הפעלה', desc: 'הפעלה שוטפת וניהול אירוע.', classification: 'בלמ"ס' },
      { ext: 'PDF', name: 'דוח תרגיל פיקודי', docType: 'דוח ניסוי', desc: 'תוצאות התרגיל והמלצות.', classification: 'שמור' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'מסך ניהול האירוע.' },
      { type: 'video', badge: 'VID', desc: 'הדגמת פתיחת אירוע ותיאום כוחות.' }
    ]
  },
  {
    id: 7, name: 'פלטפורמת תיאום כוחות', body: 'זרוע אמל"ח',
    desc: 'פלטפורמה משותפת לתיאום תמונת מצב בין זרועות.',
    status: 'בפיתוח', type: 'אמצעי תקשוב ותקשורת', domain: 'רב-זירתי',
    classification: 'סודי', interestedCount: 3, tags: ['תיאום', 'מודיעין'],
    mekat: 'FC-7789', updated: '22.01.2026', owner: 'סגן עדי לביא',
    contact: 'רס"ן בן ששון', contactRole: 'קצין תיאום זרועי',
    procurement: 'פנייה לגורם הפיתוח האחראי בזרוע',
    limitations: 'הפעולה מותנית בהסכמי שיתוף בין הזרועות. אין תמיכה בסיווג הגבוה מסודי.',
    experience: 'נבחנה בתרגיל דו-זרועי אחד.',
    attributes: [
      { label: 'סוג ההצפנה', value: 'הצפנת תווך ארגונית' },
      { label: 'מספר ערוצים', value: 'לפי הגדרת האירוע' },
      { label: 'טווח קשר', value: 'תלוי תשתית' },
      { label: 'מקור מתח', value: 'תשתית קבועה' },
      { label: 'משקל', value: 'אינו רלוונטי' }
    ],
    trials: [{ name: 'תרגיל דו-זרועי', date: 'ספטמבר 2025', outcome: 'תמונת מצב משותפת הוצגה, נדרש קיצור זמן העדכון' }],
    attachments: [
      { ext: 'PDF', name: 'מסמך ארכיטקטורה', docType: 'מפרט טכני', desc: 'מבנה הפלטפורמה והממשקים.', classification: 'סודי' },
      { ext: 'PPTX', name: 'מצגת לגורמי הזרוע', docType: 'מצגת יצרן', desc: 'סקירה לקראת החלטת המשך.', classification: 'שמור' }
    ],
    gallery: [{ type: 'image', badge: 'IMG', desc: 'תצוגת התיאום המשותפת.' }]
  },
  {
    id: 8, name: 'אמצעי סיור אווירי קטן', body: 'מפא"ת',
    desc: 'כלי טיס זעיר לסיור ואיסוף מודיעין טקטי ברמת הצוות.',
    status: 'זמין', type: 'כלי טיס בלתי מאויש', domain: 'אוויר',
    classification: 'שמור', interestedCount: 11, tags: ['רחפנות', 'אוויר', 'מודיעין'],
    mekat: 'AR-8890', updated: '15.03.2026', owner: 'רס"ן גיא פישר',
    contact: 'סרן מאיה כץ', contactRole: 'קצינת אמל"ח אווירי',
    procurement: 'פנייה לקצין הצטיידות עם מק"ט ומספר יחידה',
    limitations: 'אינו פועל ברוח חזקה. הטיסה מוגבלת לקו ראייה.',
    experience: 'בשימוש נרחב בפעילות שוטפת. שיעור התקלות עולה בקור.',
    attributes: [
      { label: 'משקל המראה', value: '1.1 ק"ג' },
      { label: 'סיבולת אוויר', value: '35 דקות' },
      { label: 'טווח שליטה', value: '5 ק"מ' },
      { label: 'מטען מנשא', value: 'מצלמה יומית ולילית' },
      { label: 'זמן הכנה להמראה', value: '3 דקות' },
      { label: 'תנאי רוח מרביים', value: 'עד 25 קמ"ש' }
    ],
    trials: [
      { name: 'ניסוי קבלה', date: 'פברואר 2024', outcome: 'עמד בדרישות' },
      { name: 'ניסוי בתנאי קור', date: 'ינואר 2025', outcome: 'ירידה של 20% בסיבולת' }
    ],
    attachments: [
      { ext: 'PDF', name: 'מפרט כלי הטיס', docType: 'מפרט טכני', desc: 'נתוני הכלי והמטען.', classification: 'שמור' },
      { ext: 'PDF', name: 'הוראות הפעלה לצוות', docType: 'הוראות הפעלה', desc: 'הכנה, המראה, נחיתה וטיפול שוטף.', classification: 'בלמ"ס' },
      { ext: 'PDF', name: 'נספח בטיחות טיסה', docType: 'נספח בטיחות', desc: 'מגבלות הפעלה ומרחקי בטיחות.', classification: 'בלמ"ס' },
      { ext: 'DOCX', name: 'דוח ניסוי בתנאי קור', docType: 'דוח ניסוי', desc: 'ממצאי הניסוי בינואר 2025.', classification: 'שמור' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'הכלי במצב מוכן להמראה.' },
      { type: 'image', badge: 'IMG', desc: 'ערכת הנשיאה והשלט.' },
      { type: 'video', badge: 'VID', desc: 'המראה ונחיתה בשטח פתוח.' }
    ]
  },
  {
    id: 9, name: 'רחפן תצפית פלוגתי', body: 'זרוע אמל"ח',
    desc: 'רחפן רב-להבי לתצפית מתמשכת מעל אזור פעילות פלוגתי.',
    status: 'זמין', type: 'כלי טיס בלתי מאויש', domain: 'אוויר',
    classification: 'שמור', interestedCount: 18, tags: ['רחפנות', 'אוויר', 'מודיעין'],
    mekat: 'DR-9101', updated: '20.03.2026', owner: 'סרן מאיה כץ',
    contact: 'רס"ן ליאור אדרי', contactRole: 'קצין אמל"ח אווירי',
    procurement: 'פנייה לקצין הצטיידות עם מק"ט ומספר יחידה',
    limitations: 'ההפעלה מחייבת מפעיל שעבר הסמכה. אינו פועל בגשם.',
    experience: 'בשימוש בשלוש חטיבות. הצוותים מבקשים ערכת סוללות מורחבת.',
    attributes: [
      { label: 'משקל המראה', value: '2.4 ק"ג' },
      { label: 'סיבולת אוויר', value: '45 דקות' },
      { label: 'טווח שליטה', value: '8 ק"מ' },
      { label: 'מטען מנשא', value: 'מצלמה יומית, לילית ומד טווח' },
      { label: 'זמן הכנה להמראה', value: '5 דקות' },
      { label: 'תנאי רוח מרביים', value: 'עד 35 קמ"ש' }
    ],
    trials: [
      { name: 'ניסוי קבלה', date: 'מאי 2025', outcome: 'עמד בדרישות הסיבולת והטווח' },
      { name: 'ניסוי הפעלה מבצעית', date: 'אוגוסט 2025', outcome: 'איכות התצפית תקינה, נדרש שיפור בזמן ההטענה' }
    ],
    attachments: [
      { ext: 'PDF', name: 'מפרט טכני רחפן תצפית', docType: 'מפרט טכני', desc: 'נתוני הכלי, המטענים והתחנה הקרקעית.', classification: 'שמור' },
      { ext: 'PDF', name: 'הוראות הפעלה למפעיל', docType: 'הוראות הפעלה', desc: 'הכנה, בדיקות לפני טיסה ונהלי חירום.', classification: 'בלמ"ס' },
      { ext: 'PDF', name: 'נספח בטיחות והפרדת מרחב', docType: 'נספח בטיחות', desc: 'תיאום גובה ומרחק מכוחות.', classification: 'שמור' },
      { ext: 'DOCX', name: 'דוח ניסוי הפעלה מבצעית', docType: 'דוח ניסוי', desc: 'ממצאי הסבב באוגוסט 2025.', classification: 'סודי' },
      { ext: 'PPTX', name: 'מצגת יצרן', docType: 'מצגת יצרן', desc: 'סקירת המשפחה והאבזור הנלווה.', classification: 'בלמ"ס' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'הרחפן במצב מוכן להמראה.' },
      { type: 'image', badge: 'IMG', desc: 'תחנת השליטה הניידת.' },
      { type: 'image', badge: 'IMG', desc: 'ערכת הנשיאה השלמה.' },
      { type: 'video', badge: 'VID', desc: 'רצף המראה, תצפית ונחיתה.' }
    ]
  },
  {
    id: 10, name: 'תחנת בקרה ניידת לרחפנים', body: 'זרוע אמל"ח',
    desc: 'תחנת שליטה ניידת המפעילה כמה רחפנים ומרכזת את תמונת התצפית.',
    status: 'זמין', type: 'אמצעי תקשוב ותקשורת', domain: 'אוויר',
    classification: 'סודי', interestedCount: 8, tags: ['תקשורת', 'תיאום'],
    mekat: 'GC-1022', updated: '11.03.2026', owner: 'רס"ן עידו שרעבי',
    contact: 'סרן מאיה כץ', contactRole: 'קצינת אמל"ח אווירי',
    procurement: 'פנייה לקצין הצטיידות הזרועי עם מק"ט ומספר יחידה',
    limitations: 'תומכת בדגמי הרחפנים המאושרים בלבד. אינה פועלת ממתח רכב.',
    experience: 'בשימוש במפקדות גדוד. ההתקנה בשטח נמשכת יותר מהמתוכנן.',
    attributes: [
      { label: 'סוג ההצפנה', value: 'הצפנת קו שליטה' },
      { label: 'מספר ערוצים', value: '4 כלים במקביל' },
      { label: 'טווח קשר', value: 'עד 8 ק"מ, תלוי כלי' },
      { label: 'מקור מתח', value: 'גנרטור או חיבור קבוע' },
      { label: 'משקל', value: '22 ק"ג' }
    ],
    trials: [{ name: 'ניסוי הפעלה מרובת כלים', date: 'יוני 2025', outcome: 'שליטה בארבעה כלים ללא הפרעה' }],
    attachments: [
      { ext: 'PDF', name: 'מפרט התחנה', docType: 'מפרט טכני', desc: 'רכיבי התחנה והדגמים הנתמכים.', classification: 'סודי' },
      { ext: 'PDF', name: 'הוראות התקנה והפעלה', docType: 'הוראות הפעלה', desc: 'פריסה בשטח וחיבור לכלים.', classification: 'שמור' },
      { ext: 'DOCX', name: 'דוח ניסוי מרובה כלים', docType: 'דוח ניסוי', desc: 'תוצאות הסבב ביוני 2025.', classification: 'סודי' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'התחנה פרוסה בשטח.' },
      { type: 'image', badge: 'IMG', desc: 'מסך השליטה מקרוב.' }
    ]
  },
  {
    id: 11, name: 'מערכת גילוי ונטרול רחפנים', body: 'מפא"ת',
    desc: 'מערכת לגילוי כלי טיס בלתי מאוישים עוינים ולנטרולם במרחב מוגן.',
    status: 'בפיתוח', type: 'אמצעי חישה ואיסוף', domain: 'אוויר',
    classification: 'סודי ביותר', interestedCount: 21, tags: ['נגד רחפנות', 'רחפנות', 'חישה'],
    mekat: 'CD-1147', updated: '18.03.2026', owner: 'סגן תמר בן חיים',
    contact: 'רס"ן איתן צור', contactRole: 'קצין מו"פ',
    procurement: 'פנייה לגורם הפיתוח האחראי במפא"ת',
    limitations: 'ההפעלה כפופה לאישור תיאום מרחב אווירי. אינה מבחינה בין כלים ידידותיים לעוינים ללא הזנת נתונים מוקדמת.',
    experience: 'נבחנת באתר ניסויים. תוצאות הגילוי עקביות, שלב הנטרול בבחינה.',
    attributes: [
      { label: 'טווח גילוי', value: 'בבחינה' },
      { label: 'תחום קליטה', value: 'רדאר ואמצעי בקרת ספקטרום' },
      { label: 'זמן התכוננות', value: '30 דקות' },
      { label: 'צריכת הספק', value: 'חיבור קבוע נדרש' },
      { label: 'ממשק פלט', value: 'תמונת מצב אווירית מקומית' }
    ],
    trials: [
      { name: 'ניסוי גילוי', date: 'פברואר 2026', outcome: 'גילוי עקבי בכל סבבי הבדיקה' },
      { name: 'ניסוי נטרול', date: 'מרץ 2026', outcome: 'טרם הושלם' }
    ],
    attachments: [
      { ext: 'PDF', name: 'מסמך אפיון מערכת', docType: 'מפרט טכני', desc: 'ארכיטקטורת הגילוי והנטרול.', classification: 'סודי ביותר' },
      { ext: 'PDF', name: 'סקר סיכוני הפעלה', docType: 'סקר סיכונים', desc: 'השפעה על מערכות סמוכות ותיאום נדרש.', classification: 'סודי' },
      { ext: 'DOCX', name: 'דוח ניסוי גילוי', docType: 'דוח ניסוי', desc: 'ממצאי סבב פברואר 2026.', classification: 'סודי' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'עמדת הגילוי באתר הניסויים.' },
      { type: 'image', badge: 'IMG', desc: 'תצוגת תמונת המצב האווירית.' }
    ]
  },
  {
    id: 12, name: 'רחפן אספקה לוגיסטית', body: 'חט"ל',
    desc: 'רחפן להובלת מטענים קלים לכוחות בשטח שאין אליהם גישה קרקעית זמינה.',
    status: 'ממתין לתקצוב', type: 'כלי טיס בלתי מאויש', domain: 'יבשה',
    classification: 'שמור', interestedCount: 12, tags: ['רחפנות', 'לוגיסטיקה', 'אוויר'],
    mekat: 'DL-1288', updated: '07.03.2026', owner: 'רס"ן גיא פישר',
    contact: 'סרן יובל רם', contactRole: 'קצין לוגיסטיקה',
    procurement: 'ממתין לאישור תקציבי בטרם פתיחת מסלול הזמנה',
    limitations: 'משקל המטען מגביל את הטווח. הנחיתה מחייבת שטח פנוי מסומן.',
    experience: 'הודגם בתרגיל אספקה אחד ברמת גדוד.',
    attributes: [
      { label: 'משקל המראה', value: '14 ק"ג כולל מטען' },
      { label: 'סיבולת אוויר', value: '25 דקות במטען מלא' },
      { label: 'טווח שליטה', value: '12 ק"מ' },
      { label: 'מטען מנשא', value: 'עד 5 ק"ג' },
      { label: 'זמן הכנה להמראה', value: '8 דקות' },
      { label: 'תנאי רוח מרביים', value: 'עד 30 קמ"ש' }
    ],
    trials: [{ name: 'הדגמת אספקה', date: 'ינואר 2026', outcome: 'ארבע טיסות אספקה הושלמו, נדרש סימון נחיתה ברור' }],
    attachments: [
      { ext: 'PDF', name: 'הצעה תקציבית', docType: 'כתב עבודה', desc: 'היקף הרכש המבוקש ולוח הזמנים.', classification: 'שמור' },
      { ext: 'PPTX', name: 'מצגת הדגמת אספקה', docType: 'מצגת יצרן', desc: 'סיכום ההדגמה בינואר 2026.', classification: 'בלמ"ס' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'הרחפן עם תא המטען.' },
      { type: 'video', badge: 'VID', desc: 'טיסת אספקה והנחתת מטען.' }
    ]
  },
  {
    id: 13, name: 'אפוד מיגון אישי דור חדש', body: 'חט"ל',
    desc: 'אפוד מיגון אישי בעל משקל מופחת ותצורה מודולרית.',
    status: 'זמין', type: 'אמצעי מיגון והגנה', domain: 'יבשה',
    classification: 'בלמ"ס', interestedCount: 6, tags: ['מיגון', 'ניוד'],
    mekat: 'PV-1355', updated: '25.02.2026', owner: 'רס"ן יעל כהן',
    contact: 'סרן איתי בר', contactRole: 'קצין אמל"ח',
    procurement: 'פנייה לקצין הצטיידות עם מק"ט ומספר יחידה',
    limitations: 'התצורה המורחבת מוסיפה משקל ניכר. אינו מתאים ללוחמים מתחת למידה מסוימת.',
    experience: 'חולק לשתי חטיבות. המשוב על הנוחות חיובי.',
    attributes: [
      { label: 'רמת ההגנה', value: 'דרגה ג בתצורה מלאה' },
      { label: 'משקל', value: '8.2 ק"ג בתצורת בסיס' },
      { label: 'שטח כיסוי', value: 'חזה, גב וצידיים' },
      { label: 'תנאי אחסון', value: 'מחסן יבש, ללא חשיפה לשמש' }
    ],
    trials: [{ name: 'ניסוי בליסטי', date: 'נובמבר 2025', outcome: 'עמד בדרישות בכל הלוחות' }],
    attachments: [
      { ext: 'PDF', name: 'מפרט האפוד', docType: 'מפרט טכני', desc: 'תצורות, מידות ומשקלים.', classification: 'בלמ"ס' },
      { ext: 'PDF', name: 'אישור התאמה', docType: 'אישור התאמה', desc: 'אישור עמידה בתקן ההגנה.', classification: 'בלמ"ס' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'האפוד בתצורת בסיס.' },
      { type: 'image', badge: 'IMG', desc: 'התצורה המורחבת.' }
    ]
  },
  {
    id: 14, name: 'ערכת טיפול קדמי מתקדמת', body: 'חט"ל',
    desc: 'ערכת ציוד רפואי לטיפול ראשוני בנקודת הפגיעה.',
    status: 'זמין', type: 'ציוד לוגיסטי ורפואי', domain: 'יבשה',
    classification: 'בלמ"ס', interestedCount: 4, tags: ['רפואה', 'לוגיסטיקה'],
    mekat: 'MK-1490', updated: '03.03.2026', owner: 'סרן הדר וייס',
    contact: 'רס"ן נועה שלו', contactRole: 'קצינת רפואה',
    procurement: 'פנייה לקצין הצטיידות עם מק"ט ומספר יחידה',
    limitations: 'השימוש מותנה בהסמכה רפואית. חיי מדף מוגבלים לחלק מהפריטים.',
    experience: 'בשימוש שוטף בחוליות רפואה. נדרש מעקב תפוגה הדוק.',
    attributes: [
      { label: 'מספר יחידות בערכה', value: '32 פריטים' },
      { label: 'משקל', value: '4.6 ק"ג' },
      { label: 'חיי מדף', value: '24 חודשים לפריט הקצר ביותר' },
      { label: 'תנאי אחסון', value: 'טמפרטורה מבוקרת' }
    ],
    trials: [],
    attachments: [
      { ext: 'PDF', name: 'רשימת תכולה', docType: 'מפרט טכני', desc: 'פירוט הפריטים והכמויות.', classification: 'בלמ"ס' },
      { ext: 'PDF', name: 'הוראות שימוש ותפוגה', docType: 'הוראות הפעלה', desc: 'שימוש, החלפה ומעקב תפוגה.', classification: 'בלמ"ס' }
    ],
    gallery: [{ type: 'image', badge: 'IMG', desc: 'הערכה פתוחה עם התכולה.' }]
  },
  {
    id: 15, name: 'אמצעי ניווט בסביבה ללא קליטת לוויין', body: 'מפא"ת',
    desc: 'אמצעי ניווט לכוח רגלי ולרכב בסביבה שבה קליטת הלוויין אינה זמינה.',
    status: 'בפיתוח', type: 'אמצעי חישה ואיסוף', domain: 'רב-זירתי',
    classification: 'סודי', interestedCount: 15, tags: ['ניווט', 'ניוד', 'חישה'],
    mekat: 'NV-1533', updated: '16.03.2026', owner: 'סגן רועי דגן',
    contact: 'רס"ן מיכל אור', contactRole: 'קצינת פיתוח',
    procurement: 'פנייה לגורם הפיתוח האחראי במפא"ת',
    limitations: 'שגיאת המיקום מצטברת לאורך זמן. נדרש כיול תקופתי לנקודת ייחוס.',
    experience: 'נבחן בשני מסלולי ניסוי. הדיוק עומד בדרישה בטווחים קצרים.',
    attributes: [
      { label: 'טווח גילוי', value: 'אינו רלוונטי' },
      { label: 'תחום קליטה', value: 'חיישני תנועה וכיוון' },
      { label: 'זמן התכוננות', value: '2 דקות כולל כיול' },
      { label: 'צריכת הספק', value: '10 שעות בסוללה אחת' },
      { label: 'ממשק פלט', value: 'תצוגה אישית וייצוא מסלול' }
    ],
    trials: [
      { name: 'ניסוי מסלול רגלי', date: 'דצמבר 2025', outcome: 'שגיאה בטווח הנדרש עד 6 ק"מ' },
      { name: 'ניסוי מסלול רכוב', date: 'פברואר 2026', outcome: 'שגיאה מצטברת חורגת מעבר ל-15 ק"מ' }
    ],
    attachments: [
      { ext: 'PDF', name: 'מסמך אפיון', docType: 'מפרט טכני', desc: 'עקרון הפעולה והרכיבים.', classification: 'סודי' },
      { ext: 'DOCX', name: 'דוח שני ניסויי המסלול', docType: 'דוח ניסוי', desc: 'תוצאות דצמבר 2025 ופברואר 2026.', classification: 'סודי' },
      { ext: 'PDF', name: 'סקר סיכוני הסתמכות', docType: 'סקר סיכונים', desc: 'השלכות שגיאה מצטברת בשימוש מבצעי.', classification: 'שמור' }
    ],
    gallery: [
      { type: 'image', badge: 'IMG', desc: 'האמצעי מותקן על אפוד.' },
      { type: 'image', badge: 'IMG', desc: 'תצוגת המסלול.' }
    ]
  }
];

export const ITEMS = RAW_ITEMS.map(it => ({
  ...it,
  limitations: it.limitations || 'לא תועד',
  experience: it.experience || 'לא תועד',
  trials: it.trials || [],
  attachments: it.attachments || [],
  attributes: it.attributes || [],
  gallery: (it.gallery && it.gallery.length) ? it.gallery : [{ type: 'image', badge: 'IMG', desc: 'לא הועלתה תמונה' }],
  statusInfo: STATUS_INFO[it.status],
  statusVariant: STATUS_VARIANT[it.status],
  interested: buildInterested(it.id, it.interestedCount)
}));
