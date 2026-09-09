import React from 'react';
import { Badge, Breadcrumb, Button, Checkbox, Input, Select, SpecTable } from '../design-system/index.js';
/** מסך הפריט: פרטים, גלריה, מאפיינים, ניסויים, מסמכים והבעת עניין. */
export default function ItemDetailScreen({ v }) {
  const {
    activeGalleryDesc, activeGalleryLabel, attachmentsEmpty, attributeRows, attributesEmpty,
    breadcrumbItems, cancelEdit, cancelInterestForm, chevronLeftMarkStyle, chevronRightMarkStyle,
    classificationOptions, contactInfoOpen, copyItemLink, detailActionsIdle, detailApproveCancel,
    detailApproveClick, detailApproveConfirm, detailConfirmOpen, detailNoteError, detailNoteOpen,
    detailNoteText, detailNoteToggle, detailSetNoteText, detailSubmitReturn, editDraft, editMode,
    editModeOff, existingFollowRowNum, fieldErrorStyle, galleryThumbs, goBackFromDetail, goToExistingFollow,
    goToMyFollowsFromDetail, hasAttachments, hasAttributes, hasMoreInterested, hasTrials, interestClassificationError,
    interestForm, interestNeedError, isDetailScreen, isOwnDetailContext, isPendingPreviewContext,
    nextGalleryItem, onEditDescChange, onEditStatusChange, onInterestClassificationChange,
    onInterestNeedChange, onInterestNotesChange, onInterestPhoneChange, openInterestForm, ownerInfoOpen,
    p1Profile, prevGalleryItem, saveEdit, selectedItem, shareCopiedFlash, showAllInterestedLabel,
    showAlreadyExpressedLink, showInterestButton, showInterestConfirmation, showInterestForm,
    startEdit, statusInfoOpen, statusSelectOptions, submitInterestForm, textareaStyle, toggleContactInfo,
    toggleInterestReady, toggleOwnerInfo, toggleShowAllInterested, toggleStatusInfo, trialsEmpty,
    visibleInterested,
  } = v;
  return (
    <>
      {/* ITEM DETAIL */}
      {isDetailScreen && (<>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Breadcrumb items={breadcrumbItems} onNavigate={goBackFromDetail} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', gap: '28px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px', minWidth: '0', position: 'sticky', top: '88px' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '20px', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '700', lineHeight: '1.3' }}>{selectedItem.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: '0' }}>
                    <Button variant="secondary" size="sm" onClick={copyItemLink}>שתף</Button>
                    {shareCopiedFlash && (
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>הקישור הועתק</div>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}><Badge variant="neutral" size="sm">{selectedItem.body}</Badge></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>מק"ט: <bdi dir="ltr">{selectedItem.mekat}</bdi></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>עודכן {selectedItem.updated}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                  {(selectedItem.tags || []).map((tag, tagIdx) => (<React.Fragment key={tagIdx}>
                    <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>{tag}</span>
                  </React.Fragment>))}
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>תיאור</div>
                  {editMode && (
                    <textarea value={editDraft.desc} onChange={onEditDescChange} placeholder="הוסיפו תיאור לפריט..." style={textareaStyle}></textarea>
                  )}
                  {editModeOff && (
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedItem.desc}</div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>סטטוס זמינות</span>
                    {editMode && (
                      <div style={{ maxWidth: '160px' }}><Select options={statusSelectOptions} value={editDraft.status} onChange={onEditStatusChange} size="sm" /></div>
                    )}
                    {editModeOff && (
                      <div onClick={toggleStatusInfo} style={{ cursor: 'pointer' }}><Badge variant={selectedItem.statusVariant} withDot={true} size="md">{selectedItem.status}</Badge></div>
                    )}
                  </div>
                  {statusInfoOpen && (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>{selectedItem.statusInfo}</div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>בעל הפריט</span>
                    <a onClick={toggleOwnerInfo} style={{ fontSize: '12.5px', cursor: 'pointer' }}>{selectedItem.owner}</a>
                  </div>
                  {ownerInfoOpen && (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>אימייל: placeholder@mil.example · טלפון: 03-0000000</div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingTop: '2px' }}>איש קשר</span>
                    <a onClick={toggleContactInfo} style={{ fontSize: '12.5px', cursor: 'pointer', textAlign: 'left' }}>{selectedItem.contact}<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedItem.contactRole}</span></a>
                  </div>
                  {contactInfoOpen && (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>אימייל: placeholder@mil.example · טלפון: 03-0000000</div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 0' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>מסלול הזמנה</span>
                    <span style={{ fontSize: '12px', textAlign: 'left', maxWidth: '60%' }}>{selectedItem.procurement}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
                  <a onClick={toggleShowAllInterested} style={{ fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{selectedItem.interestedCount} גורמים הביעו עניין</a>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {(visibleInterested || []).map((person, personIdx) => (<React.Fragment key={personIdx}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{person.name} · {person.unit} · {person.date}</div>
                    </React.Fragment>))}
                  </div>
                  {hasMoreInterested && (
                    <a onClick={toggleShowAllInterested} style={{ fontSize: '12px', cursor: 'pointer', display: 'inline-block', marginTop: '6px' }}>{showAllInterestedLabel}</a>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', marginTop: '18px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {showInterestButton && (
                    <button onClick={openInterestForm} className="ht-action" style={{ width: '100%', height: '48px', fontSize: '14px' }}>הבעת עניין</button>
                  )}
                  {showAlreadyExpressedLink && (
                    <a onClick={goToExistingFollow} style={{ fontSize: '13px', textAlign: 'center', padding: '6px 0', display: 'block' }}>כבר הבעת עניין בפריט זה · שורה {existingFollowRowNum}</a>
                  )}
                  {showInterestConfirmation && (
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'center', padding: '8px 0' }}>הבעת העניין נשמרה. תוכל לראות אותה ולערוך אותה ב<a onClick={goToMyFollowsFromDetail} style={{ cursor: 'pointer' }}>המעקבים שלי</a>.</div>
                  )}
                  {showInterestForm && (<>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>זיהוי</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}><span style={{ color: 'var(--text-secondary)' }}>שם המביע</span><span>{p1Profile.name}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}><span style={{ color: 'var(--text-secondary)' }}>תפקיד</span><span>{p1Profile.role}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}><span style={{ color: 'var(--text-secondary)' }}>יחידה</span><span>{p1Profile.unit}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}><span style={{ color: 'var(--text-secondary)' }}>כתובת מייל</span><span><bdi dir="ltr">{p1Profile.email}</bdi></span></div>
                          <Input label="טלפון ליצירת קשר" value={interestForm.phone} onChange={onInterestPhoneChange} helperText="ניתן לשנות לצורך רשומה זו בלבד" size="sm" />
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', margin: '-2px 0 -4px' }}>הצהרה</div>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>הצורך המבצעי <span style={{ color: 'var(--tw-red-600)' }}>*</span></label>
                          <textarea value={interestForm.need} onChange={onInterestNeedChange} placeholder="תאר את הצורך המבצעי שהפריט עונה עליו אצלך" style={textareaStyle}></textarea>
                          {interestNeedError && (<><div style={fieldErrorStyle}>{interestNeedError}</div></>)}
                        </div>
                        <div>
                          <Select label="סיווג ההצהרה *" hint="הצעה · ממצא 1" options={classificationOptions} value={interestForm.classification} onChange={onInterestClassificationChange} placeholder="בחר רמת סיווג" error={interestClassificationError} size="sm" />
                        </div>
                        <Checkbox checked={interestForm.readyForTrials} onChange={toggleInterestReady} label="יחידתי מוכנה להשתלב בניסוי או בבדיקת שדה" size="sm" />
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--tw-slate-800)', display: 'block', marginBottom: '6px' }}>הערות ואינפוט</label>
                          <textarea value={interestForm.notes} onChange={onInterestNotesChange} placeholder="מידע נוסף שיש לקחת בחשבון" style={textareaStyle}></textarea>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button onClick={submitInterestForm} className="ht-action" style={{ width: '100%', height: '48px', fontSize: '14px' }}>שלח הבעת עניין</button>
                        <Button variant="secondary" fullWidth={true} onClick={cancelInterestForm}>ביטול</Button>
                      </div>
                    </div>
                  </>)}
                  {isOwnDetailContext && (<>
                    {editMode && (<>
                      <Button variant="primary" fullWidth={true} onClick={saveEdit}>שמור שינויים</Button>
                      <Button variant="secondary" fullWidth={true} onClick={cancelEdit}>בטל</Button>
                    </>)}
                    {editModeOff && (
                      <Button variant="secondary" fullWidth={true} onClick={startEdit}>ערוך פריט</Button>
                    )}
                  </>)}
                  {isPendingPreviewContext && (<>
                    {detailConfirmOpen && (<>
                      <div style={{ fontSize: '12.5px', marginBottom: '6px' }}>לחיצה על אישור תפרסם את הפריט ותחתום עליו בשמך. להמשיך?</div>
                      <Button variant="primary" fullWidth={true} onClick={detailApproveConfirm}>אשר ופרסם</Button>
                      <Button variant="secondary" fullWidth={true} onClick={detailApproveCancel}>ביטול</Button>
                    </>)}
                    {detailNoteOpen && (<>
                      <textarea value={detailNoteText} onChange={detailSetNoteText} placeholder="הוסיפו הערה להחזרה..." style={textareaStyle}></textarea>
                      {detailNoteError && (<><div style={fieldErrorStyle}>יש להוסיף הערה לפני החזרה</div></>)}
                      <Button variant="primary" fullWidth={true} onClick={detailSubmitReturn}>שלח החזרה</Button>
                      <Button variant="secondary" fullWidth={true} onClick={detailNoteToggle}>ביטול</Button>
                    </>)}
                    {detailActionsIdle && (<>
                      <Button variant="primary" fullWidth={true} onClick={detailApproveClick}>אשר ופרסם</Button>
                      <Button variant="secondary" fullWidth={true} onClick={detailNoteToggle}>החזר עם הערה</Button>
                    </>)}
                  </>)}
                </div>
              </div>
            </div>

            <div style={{ flex: '2 1 420px', minWidth: '0' }}>
              <div style={{ width: '100%', height: '320px', borderRadius: 'var(--radius-xl)', background: 'var(--tw-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px', position: 'relative' }}>
                <span>{activeGalleryLabel}</span>
                <button onClick={prevGalleryItem} aria-label="הקודם" style={{ right: '12px' }}>
                  <span style={chevronRightMarkStyle}></span>
                </button>
                <button onClick={nextGalleryItem} aria-label="הבא" style={{ left: '12px' }}>
                  <span style={chevronLeftMarkStyle}></span>
                </button>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>{activeGalleryDesc}</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {(galleryThumbs || []).map((g, gIdx) => (<React.Fragment key={gIdx}>
                  <div onClick={g.onSelect} style={g.thumbStyle}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px' }}>{g.badge}</span>
                  </div>
                </React.Fragment>))}
              </div>

              <div style={{ padding: '22px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}><span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>מאפיינים</span><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', lineHeight: '1', padding: '4px 8px', border: '1px dashed var(--border)', borderRadius: '9999px', background: 'var(--surface)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>הצעה · ממצא 7</span></div>
                {attributesEmpty && (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>לא תועד</div>
                )}
                {hasAttributes && (
                  <SpecTable rows={attributeRows} dense={true} />
                )}
              </div>

              <div style={{ padding: '22px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>מגבלות וניסיון</div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>מגבלות</div>
                  <div style={{ fontSize: '13px', background: 'var(--surface)', borderRadius: '6px', padding: '12px' }}>{selectedItem.limitations}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>ניסיון שנצבר</div>
                  <div style={{ fontSize: '13px', background: 'var(--surface)', borderRadius: '6px', padding: '12px' }}>{selectedItem.experience}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>תוצאות ניסוי</div>
                  {trialsEmpty && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>לא תועד</div>
                  )}
                  {hasTrials && (<>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(selectedItem.trials || []).map((trial, trialIdx) => (<React.Fragment key={trialIdx}>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                          <span style={{ fontWeight: '600' }}>{trial.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{trial.date}</span>
                          <span>{trial.outcome}</span>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </>)}
                </div>
              </div>

              <div style={{ padding: '22px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}><span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>מסמכים מצורפים</span><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', lineHeight: '1', padding: '4px 8px', border: '1px dashed var(--border)', borderRadius: '9999px', background: 'var(--surface)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>הצעה · ממצא 54</span></div>
                {attachmentsEmpty && (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>לא תועד</div>
                )}
                {hasAttachments && (<>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(selectedItem.attachments || []).map((doc, docIdx) => (<React.Fragment key={docIdx}>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '700', background: 'var(--tw-neutral-900)', color: '#fff', borderRadius: '4px', padding: '3px 6px' }}>{doc.ext}</div>
                          <span style={{ fontSize: '13px', flex: '1 1 auto' }}>{doc.name}</span>
                          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '9999px', background: 'var(--surface)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{doc.classification}</span>
                          <Button variant="secondary" size="sm">הורדה</Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>{doc.docType}</span>
                          <span>{doc.desc}</span>
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </>)}
              </div>
            </div>
          </div>
        </div>
      </>)}
    </>
  );
}