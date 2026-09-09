/** ייבוא אצווה: בחירת קובץ, בדיקה, תיקון שורות ואישור. */
export function attachBatchActions(store) {
  store.setAddItemTab = (tab) => store.setState({ addItemTab: tab });
  store.batchSelectFile = () => store.setState(s => ({ batch: { ...s.batch, fileName: 'ייבוא_אמצעים_מרץ.xlsx' } }));
  store.batchCheckFile = () => store.setState(s => ({ batch: { ...s.batch, checked: true, report: { total: 18, valid: 14, rejected: [
    { row: 4, field: 'רמת סיווג', value: 'סודי ביותר', reason: 'ערך אינו ברשימה' },
    { row: 9, field: 'שם הפריט', value: '', reason: 'שדה חובה ריק' },
    { row: 15, field: 'קצב רענון', value: 'כל שבוע', reason: 'ערך אינו ברשימה' }
  ], duplicates: [
    { name: 'מערכת תקשורת מוצפנת ניידת', matched: 'מערכת תקשורת מוצפנת ניידת (מק"ט CM-3311)' }
  ] } } }));
  store.batchToggleInvalidDemo = () => store.setState(s => ({ batch: { ...s.batch, invalidState: !s.batch.invalidState } }));
  store.batchReset = () => store.setState({ batch: { fileName: null, checked: false, report: null, invalidState: false, corrections: {}, confirmOpen: false, importedFlash: false } });
  store.setBatchCorrection = (row, val) => store.setState(s => ({ batch: { ...s.batch, corrections: { ...s.batch.corrections, [row]: val } } }));
  store.batchRecheck = () => store.setState(s => {
    const report = s.batch.report;
    const corrections = s.batch.corrections;
    let fixedCount = 0;
    const stillRejected = report.rejected.filter(r => {
      const fixed = (corrections[r.row] || '').trim() !== '';
      if (fixed) fixedCount++;
      return !fixed;
    });
    return { batch: { ...s.batch, report: { ...report, valid: report.valid + fixedCount, rejected: stillRejected }, corrections: {} } };
  });
  store.batchApproveClick = () => store.setState(s => ({ batch: { ...s.batch, confirmOpen: true } }));
  store.batchConfirmCancel = () => store.setState(s => ({ batch: { ...s.batch, confirmOpen: false } }));
  store.batchConfirmApprove = () => store.setState(s => ({ batch: { ...s.batch, confirmOpen: false, importedFlash: true } }));
}
