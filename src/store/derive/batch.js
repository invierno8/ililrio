/** ייבוא אצווה: מצב הקובץ, דוח הבדיקה, שורות שנפסלו וכפילויות. */
export function deriveBatch(s, store) {
  const batch = s.batch;
  const report = batch.report;

  return {
    batchInvalidFile: batch.invalidState,
    batchInvalidReason: 'הקובץ מכיל עמודות שאינן תואמות לתבנית הנדרשת',
    batchNoFile: !batch.fileName && !batch.checked,
    batchHasFile: !!batch.fileName && !batch.checked,
    batchShowUpload: !batch.checked && !batch.invalidState,
    batchShowReport: batch.checked && !!report,
    batchFileName: batch.fileName,
    batchUploadedAt: '19.08.2026 · 10:32',
    batchStatChips: report
      ? [report.total + ' שורות בקובץ', report.valid + ' תקינות', report.rejected.length + ' נפסלו', report.duplicates.length + ' כפולות']
      : [],
    batchValidSummary: report ? report.valid + ' שורות עברו בדיקה ומוכנות לייבוא.' : '',
    batchRejectedCount: report ? report.rejected.length : 0,
    batchRejectedEmpty: (report ? report.rejected.length : 0) === 0,
    batchHasRejected: (report ? report.rejected.length : 0) > 0,
    batchRejectedRows: report
      ? report.rejected.map((r) => ({
          rowNum: r.row,
          field: r.field,
          valueDisplay: r.value || '(ריק)',
          reason: r.reason,
          correction: batch.corrections[r.row] || '',
          onCorrectionChange: (e) => store.setBatchCorrection(r.row, e.target.value),
        }))
      : [],
    batchDuplicateCount: report ? report.duplicates.length : 0,
    batchDuplicatesEmpty: (report ? report.duplicates.length : 0) === 0,
    batchDuplicateRows: report ? report.duplicates : [],
    batchConfirmOpen: batch.confirmOpen,
    batchImportedFlash: batch.importedFlash,

    batchSelectFile: store.batchSelectFile,
    batchCheckFile: store.batchCheckFile,
    batchToggleInvalidDemo: store.batchToggleInvalidDemo,
    batchReset: store.batchReset,
    batchRecheck: store.batchRecheck,
    batchApproveClick: store.batchApproveClick,
    batchConfirmCancel: store.batchConfirmCancel,
    batchConfirmApprove: store.batchConfirmApprove,
  };
}
