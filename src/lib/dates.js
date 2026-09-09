// תאריכים במערכת נכתבים כ-DD.MM.YYYY. הפונקציה ממירה אותם למספר בר-השוואה.
export function parseDMY(d) {
  if (!d) return 0;
  const p = d.split('.');
  return p.length === 3 ? (+p[2]) * 10000 + (+p[1]) * 100 + (+p[0]) : 0;
}
