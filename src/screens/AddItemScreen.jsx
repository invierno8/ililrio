import React from 'react';
import { Badge, Button, Input, Modal, Select } from '../design-system/index.js';
/** הוספת פריטים: טופס הפריט וייבוא אצווה. */
export default function AddItemScreen({ v }) {
  const {
    addAttributeRow, addItemTabBatchStyle, addItemTabFormStyle, addLinkRow, addMediaFile, addTrialRow,
    attrFieldOptions, axisDomainOptions, axisTypeOptions, batchApproveClick, batchCheckFile,
    batchConfirmApprove, batchConfirmCancel, batchConfirmOpen, batchDuplicateCount, batchDuplicateRows,
    batchDuplicatesEmpty, batchFileName, batchHasFile, batchHasRejected, batchImportedFlash,
    batchInvalidFile, batchInvalidReason, batchNoFile, batchRecheck, batchRejectedCount, batchRejectedEmpty,
    batchRejectedRows, batchReset, batchSelectFile, batchShowReport, batchShowUpload, batchStatChips,
    batchToggleInvalidDemo, batchUploadedAt, batchValidSummary, bodyOptionsForForm, classificationOptions,
    closeFormPreview, contactRequiredMark, docTypeOptions, fieldErrorStyle, form, formAttributeRows,
    formErrors, formHasErrors, formIsReturned, formPreviewBody, formPreviewContact, formPreviewFullDesc,
    formPreviewHasExperience, formPreviewHasLimitations, formPreviewHasTags, formPreviewMekat,
    formPreviewName, formPreviewOpen, formPreviewOwner, formPreviewProcurement, formPreviewRefresh,
    formPreviewStatus, formPreviewStatusVariant, formPreviewTags, formSavedFlash, inputPlainStyle,
    isAddItemScreen, isBatchImportScreen, isItemFormScreen, isP3Persona, itemFormTitle, linkRows,
    mediaRows, noop, onFormAvailabilityStatusChange, onFormAxisDomainChange, onFormAxisTypeChange,
    onFormBodyChange, onFormClassificationChange, onFormContactPersonChange, onFormExperienceChange,
    onFormFullDescBlur, onFormFullDescChange, onFormLimitationsChange, onFormMekatChange, onFormNameBlur,
    onFormNameChange, onFormOwnerChange, onFormProcurementRouteBlur, onFormProcurementRouteChange,
    onFormRefreshRateChange, onFormResponsibleEntryChange, onFormShortDescChange, onTagInputChange,
    onTagInputKeyDown, openFormPreview, ownerOptionsForForm, p3AuthLabel, procurementRequiredMark,
    refreshOptionsForForm, responsibleOptionsForForm, saveDraftForm, setAddItemTabBatch, setAddItemTabForm,
    statusSelectOptions, submitButtonLabel, submitForm, tagChips, tagInput, textareaStyle,
    textareaTallStyle, todayDate, toggleP3CanPublish, trialRows,
  } = v;
  return (
    <>
      {/* ADD ITEM (P2) */}
      {isAddItemScreen && (<>
        <div>
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '0' }}>
            <button onClick={setAddItemTabForm} style={addItemTabFormStyle}>טופס פריט</button>
            <button onClick={setAddItemTabBatch} style={addItemTabBatchStyle}>ייבוא אצווה</button>
          </div>

          {isItemFormScreen && (<>
            <div style={{ paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>{itemFormTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {formSavedFlash && (<><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>נשמר</span></>)}
                  {isP3Persona && (<><span onClick={toggleP3CanPublish} style={{ fontSize: '10.5px', color: 'var(--text-muted)', cursor: 'pointer' }}>{p3AuthLabel}</span></>)}
                  <Button variant="secondary" size="sm" onClick={openFormPreview}>תצוגה מקדימה</Button>
                  <Button variant="secondary" size="sm" onClick={saveDraftForm}>שמור טיוטה</Button>
                  <Button variant="primary" size="sm" onClick={submitForm}>{submitButtonLabel}</Button>
                </div>
              </div>

              {formPreviewOpen && (<>
                <Modal open={formPreviewOpen} onClose={closeFormPreview} title="תצוגה מקדימה" description="כפי שיוצג בעמוד הפריט" size="lg">
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{formPreviewName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <Badge variant={formPreviewStatusVariant} size="sm">{formPreviewStatus}</Badge>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>מק"ט: {formPreviewMekat}</span>
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '16px' }}>{formPreviewFullDesc}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '16px', fontSize: '13px' }}>
                    <div><span style={{ color: 'var(--text-secondary)' }}>גוף אחראי: </span>{formPreviewBody}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>בעל הפריט: </span>{formPreviewOwner}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>איש קשר: </span>{formPreviewContact}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>קצב רענון: </span>{formPreviewRefresh}</div>
                  </div>
                  {formPreviewHasTags && (<><div style={{ fontSize: '13px', marginBottom: '10px' }}><b>תגיות: </b>{formPreviewTags}</div></>)}
                  {formPreviewHasLimitations && (<><div style={{ fontSize: '13px', background: 'var(--surface)', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px' }}><b>מגבלות: </b>{form.limitations}</div></>)}
                  {formPreviewHasExperience && (<><div style={{ fontSize: '13px', background: 'var(--surface)', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px' }}><b>ניסיון שנצבר: </b>{form.experience}</div></>)}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>מסלול הזמנה: {formPreviewProcurement}</div>
                </Modal>
              </>)}

              <div style={{ maxWidth: '720px', paddingBottom: '60px' }}>
                {formIsReturned && (
                  <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '14px 16px', fontSize: '12.5px', marginBottom: '20px' }}>הפריט הוחזר עם הערה: {form.returnNote}</div>
                )}
                {formHasErrors && (
                  <div style={{ background: 'var(--tw-red-50)', border: '1px solid var(--tw-red-200)', borderRadius: '8px', padding: '12px 16px', fontSize: '12.5px', color: 'var(--tw-red-700)', marginBottom: '20px' }}>נמצאו שגיאות בטופס. יש להשלים את השדות המסומנים לפני שליחה לפרסום.</div>
                )}

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '22px', marginBottom: '22px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>זיהוי</div>
                  <Input label="שם הפריט" required={true} value={form.name} onChange={onFormNameChange} onBlur={onFormNameBlur} error={formErrors.name} size="sm" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px', marginTop: '14px' }}>
                    <Input label="מק&quot;ט" value={form.mekat} onChange={onFormMekatChange} helperText="מספר קטלוגי ייחודי" size="sm" />
                    <Input label="תיאור קצר" value={form.shortDesc} onChange={onFormShortDescChange} helperText="משפט אחד המזהה את הפריט ברשימת תוצאות" size="sm" />
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>תיאור מלא <span style={{ color: 'var(--tw-red-600)' }}>*</span></label>
                    <textarea value={form.fullDesc} onChange={onFormFullDescChange} onBlur={onFormFullDescBlur} style={textareaTallStyle}></textarea>
                    {formErrors.fullDesc && (<><div style={fieldErrorStyle}>{formErrors.fullDesc}</div></>)}
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>תמונה ראשית</label>
                    <div style={{ border: '1.5px dashed var(--tw-gray-300)', borderRadius: '8px', padding: '26px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12.5px' }}>גרור תמונה לכאן או לחץ להעלאה</div>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '22px', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}><span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700' }}>שיוך וסיווג</span><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', lineHeight: '1', padding: '4px 8px', border: '1px dashed var(--border)', borderRadius: '9999px', background: 'var(--surface)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>הצעה · ממצא 1</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                    <Select label="גוף אחראי *" options={bodyOptionsForForm} value={form.body} onChange={onFormBodyChange} error={formErrors.body} size="sm" />
                    <Select label="בעל הפריט *" options={ownerOptionsForForm} value={form.owner} onChange={onFormOwnerChange} placeholder="בחר בעל פריט" error={formErrors.owner} hint="האדם החתום על התוכן" size="sm" />
                    <Select label="רמת סיווג *" options={classificationOptions} value={form.classification} onChange={onFormClassificationChange} placeholder="בחר רמת סיווג" error={formErrors.classification} hint="הצעה · ממצא 1" size="sm" />
                    <Select label="ציר סוג האמצעי" options={axisTypeOptions} value={form.axisType} onChange={onFormAxisTypeChange} placeholder="בחר" hint="הצעה · ממצא 5" size="sm" />
                    <Select label="ציר זירה או תחום" options={axisDomainOptions} value={form.axisDomain} onChange={onFormAxisDomainChange} placeholder="בחר" hint="הצעה · ממצא 5" size="sm" />
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>תגיות</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', border: '1px solid var(--tw-slate-300)', borderRadius: '8px', padding: '8px 10px' }}>
                      {(tagChips || []).map((tag, tagIdx) => (<React.Fragment key={tagIdx}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--surface)', borderRadius: '14px', padding: '3px 6px 3px 10px', fontSize: '12px' }}>{tag.label}<button onClick={tag.onRemove} style={{ width: '14px', height: '14px', borderRadius: '50%', border: 'none', background: 'var(--tw-gray-200)', cursor: 'pointer', fontSize: '9px', padding: '0' }}>✕</button></span>
                      </React.Fragment>))}
                      <input value={tagInput} onChange={onTagInputChange} onKeyDown={onTagInputKeyDown} placeholder="הקלד לחיפוש תגית" style={{ flex: '1 1 100px', minWidth: '100px', border: 'none', outline: 'none', fontSize: '13px', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '22px', marginBottom: '22px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>מאפיינים</div>
                  {(formAttributeRows || []).map((attr, attrIdx) => (<React.Fragment key={attrIdx}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ flex: '0 0 220px' }}><Select options={attrFieldOptions} value={attr.field} onChange={attr.onFieldChange} placeholder="בחר שדה" size="sm" /></div>
                      <div style={{ flex: '1 1 auto' }}><input value={attr.value} onChange={attr.onValueChange} placeholder="ערך" style={inputPlainStyle} /></div>
                      <a onClick={attr.onRemove} style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: '0', paddingTop: '9px' }}>הסר</a>
                    </div>
                  </React.Fragment>))}
                  <a onClick={addAttributeRow} style={{ fontSize: '12.5px', cursor: 'pointer' }}>+ הוסף שדה</a>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>מצאי שדות המאפיינים טרם הוכרע</div>
                </div>

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '22px', marginBottom: '22px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>מגבלות וניסיון</div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>מגבלות</label>
                    <textarea value={form.limitations} onChange={onFormLimitationsChange} style={textareaStyle}></textarea>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>מה הפריט אינו מסוגל לעשות</div>
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>ניסיון שנצבר</label>
                    <textarea value={form.experience} onChange={onFormExperienceChange} style={textareaStyle}></textarea>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>ניסיון מבצעי או ניסיוני שנצבר</div>
                  </div>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '8px' }}>רשומות ניסוי</label>
                  {(trialRows || []).map((trial, trialIdx) => (<React.Fragment key={trialIdx}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: '8px' }}>
                        <Input label="מבצע הניסוי *" value={trial.performer} onChange={trial.onPerformerChange} size="sm" />
                        <Input label="מועד *" type="date" value={trial.date} onChange={trial.onDateChange} max={todayDate} size="sm" />
                        <Input label="תנאים" value={trial.conditions} onChange={trial.onConditionsChange} size="sm" />
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>ממצא</label>
                          <textarea value={trial.finding} onChange={trial.onFindingChange} style={textareaStyle}></textarea>
                        </div>
                      </div>
                      <a onClick={trial.onRemove} style={{ fontSize: '11.5px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'block', textAlign: 'left' }}>הסר רשומה</a>
                    </div>
                  </React.Fragment>))}
                  <a onClick={addTrialRow} style={{ fontSize: '12.5px', cursor: 'pointer' }}>+ הוסף רשומת ניסוי</a>
                </div>

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '22px', marginBottom: '22px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>חומרים</div>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>תמונות וסרטונים</label>
                  <div onClick={addMediaFile} style={{ border: '1.5px dashed var(--tw-gray-300)', borderRadius: '8px', padding: '22px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer', marginBottom: '10px' }}>גרור קבצים או לחץ להעלאה</div>
                  {(mediaRows || []).map((m, mIdx) => (<React.Fragment key={mIdx}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '48px', height: '36px', flexShrink: '0', borderRadius: '5px', background: 'var(--tw-gray-100)' }}></div>
                        <div style={{ flex: '1 1 160px' }}><input value={m.name} onChange={m.onNameChange} style={inputPlainStyle} /></div>
                        <div style={{ flex: '0 0 140px' }}><Select options={classificationOptions} value={m.classification} onChange={m.onClassificationChange} placeholder="סיווג" size="sm" /></div>
                        <a onClick={m.onRemove} style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: '0' }}>הסר</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div onClick={m.onSetMain} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: '0', whiteSpace: 'nowrap' }}>
                          <span style={m.mainRadioStyle}></span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>תמונה ראשית</span>
                        </div>
                        <div style={{ flex: '1 1 auto' }}><input value={m.description} onChange={m.onDescriptionChange} placeholder="תיאור קצר לתמונה/סרטון" style={inputPlainStyle} /></div>
                      </div>
                    </div>
                  </React.Fragment>))}
                  <div style={{ marginTop: '16px', marginBottom: '10px' }}><label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block' }}>מסמכים</label></div>
                  <div style={{ marginBottom: '10px' }}><Button variant="secondary" size="sm" onClick={addLinkRow}>הוסף קישור מנמ"ה</Button></div>
                  {(linkRows || []).map((l, lIdx) => (<React.Fragment key={lIdx}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input value={l.link} onChange={l.onLinkChange} placeholder="קישור מנמ&quot;ה" style={inputPlainStyle} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <input value={l.name} onChange={l.onNameChange} placeholder="שם המסמך" style={inputPlainStyle} />
                        <Select options={docTypeOptions} value={l.docType} onChange={l.onDocTypeChange} placeholder="סוג מסמך" size="sm" />
                        <Select options={classificationOptions} value={l.classification} onChange={l.onClassificationChange} placeholder="סיווג" size="sm" />
                      </div>
                      <a onClick={l.onRemove} style={{ fontSize: '11.5px', cursor: 'pointer', color: 'var(--text-secondary)', textAlign: 'left' }}>הסר</a>
                    </div>
                  </React.Fragment>))}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ממשק נמ"ה — אופן הקישור טרם הוכרע</div>
                </div>

                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '22px', marginBottom: '22px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>זמינות ופנייה</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                    <Select label="סטטוס זמינות *" options={statusSelectOptions} value={form.availabilityStatus} onChange={onFormAvailabilityStatusChange} placeholder="בחר סטטוס" error={formErrors.availabilityStatus} size="sm" />
                    <Select label={`${'איש קשר'}${contactRequiredMark}`} options={ownerOptionsForForm} value={form.contactPerson} onChange={onFormContactPersonChange} placeholder="בחר איש קשר" error={formErrors.contactPerson} hint="חובה כאשר הפריט זמין" size="sm" />
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>מסלול הזמנה{procurementRequiredMark}</label>
                    <textarea value={form.procurementRoute} onChange={onFormProcurementRouteChange} onBlur={onFormProcurementRouteBlur} style={textareaStyle}></textarea>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>כיצד ניתן להזמין את הפריט</div>
                    {formErrors.procurementRoute && (<><div style={fieldErrorStyle}>{formErrors.procurementRoute}</div></>)}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>תחזוקה</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                    <Select label="קצב רענון *" options={refreshOptionsForForm} value={form.refreshRate} onChange={onFormRefreshRateChange} placeholder="בחר קצב" error={formErrors.refreshRate} hint="ערכי קצב הרענון טרם הוכרעו" size="sm" />
                    <Select label="מזין אחראי" options={responsibleOptionsForForm} value={form.responsibleEntry} onChange={onFormResponsibleEntryChange} hint="מי יקבל תזכורות רענון" size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </>)}

          {isBatchImportScreen && (<>
            <div style={{ paddingTop: '20px', maxWidth: '820px', paddingBottom: '50px' }}>
              {batchInvalidFile && (<>
                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>הקובץ אינו תואם לתבנית. לא נבדקה שורה.</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>סיבה: {batchInvalidReason}</div>
                  <Button variant="primary" size="sm" onClick={batchReset}>העלה קובץ חדש</Button>
                </div>
              </>)}

              {batchShowUpload && (<>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '600px' }}>הורד את תבנית הקובץ, מלא אותה מחוץ למערכת, והעלה אותה לבדיקה. הדוח מופק לפני שנקלטת שורה כלשהי.</div>
                <div style={{ marginBottom: '20px' }}><Button variant="secondary" size="sm" onClick={noop}>הורד תבנית</Button></div>
                {batchNoFile && (
                  <div onClick={batchSelectFile} style={{ border: '1.5px dashed var(--tw-gray-300)', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px' }}>גרור קובץ או לחץ להעלאה</div>
                )}
                {batchHasFile && (<>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 18px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{batchFileName}</span>
                    <Button variant="primary" size="sm" onClick={batchCheckFile}>בדוק קובץ</Button>
                  </div>
                </>)}
                <div style={{ marginTop: '16px' }}><span onClick={batchToggleInvalidDemo} style={{ fontSize: '10.5px', color: 'var(--text-muted)', cursor: 'pointer' }}>הדגמה: קובץ לא תואם לתבנית</span></div>
              </>)}

              {batchShowReport && (<>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{batchFileName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>הועלה ב-{batchUploadedAt}</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(batchStatChips || []).map((chip, chipIdx) => (<React.Fragment key={chipIdx}>
                      <span style={{ border: '1px solid var(--border)', borderRadius: '20px', padding: '6px 14px', fontSize: '12.5px', fontWeight: '600' }}>{chip}</span>
                    </React.Fragment>))}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>שורות תקינות</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{batchValidSummary}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>שורות שנפסלו ({batchRejectedCount})</div>
                  {batchRejectedEmpty && (<><div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>אין שורות שנפסלו.</div></>)}
                  {(batchRejectedRows || []).map((row, rowIdx) => (<React.Fragment key={rowIdx}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', width: '56px', flexShrink: '0' }}>שורה {row.rowNum}</div>
                      <div style={{ width: '120px', flexShrink: '0', fontSize: '12px', fontWeight: '700' }}>{row.field}</div>
                      <div style={{ width: '120px', flexShrink: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>{row.valueDisplay}</div>
                      <div style={{ flex: '1 1 160px', fontSize: '12px', color: 'var(--tw-amber-700)' }}>{row.reason}</div>
                      <input value={row.correction} onChange={row.onCorrectionChange} placeholder="ערך מתוקן" style={{ flex: '1 1 140px', height: '32px', border: '1px solid var(--tw-slate-300)', borderRadius: '6px', padding: '0 10px', fontSize: '12.5px', fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                  </React.Fragment>))}
                  {batchHasRejected && (<><Button variant="secondary" size="sm" onClick={batchRecheck}>בדוק שוב</Button></>)}
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>שורות כפולות ({batchDuplicateCount})</div>
                  {batchDuplicatesEmpty && (<><div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>אין שורות כפולות.</div></>)}
                  {(batchDuplicateRows || []).map((d, dIdx) => (<React.Fragment key={dIdx}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px', fontSize: '12.5px' }}>
                      <b>{d.name}</b> — תואם ל: {d.matched}
                    </div>
                  </React.Fragment>))}
                </div>

                {batchConfirmOpen && (<>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ fontSize: '12.5px' }}>ייבוא השורות התקינות יפרסם אותן לקטלוג. להמשיך?</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" size="sm" onClick={batchConfirmCancel}>ביטול</Button>
                      <Button variant="primary" size="sm" onClick={batchConfirmApprove}>ייבא</Button>
                    </div>
                  </div>
                </>)}
                {batchImportedFlash && (
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>הייבוא בוצע בהצלחה.</div>
                )}
                {batchConfirmOpen && (<></>)}
                <Button variant="primary" onClick={batchApproveClick}>ייבא שורות תקינות</Button>
              </>)}
            </div>
          </>)}
        </div>
      </>)}
    </>
  );
}