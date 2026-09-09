import { BODY_OPTIONS, OWNER_POOL, REFRESH_POOL, NAME_POOL, CURRENT_USER } from '../../data/people.js';
import { AXIS_TYPE_VALUES, AXIS_DOMAIN_VALUES, DOC_TYPE_VALUES, ATTR_SCHEMA, STATUS_VARIANT } from '../../data/taxonomy.js';
import { emptyForm } from '../../data/form.js';
import { toOpts, underlineTabStyle } from './shared.js';

/** טופס הפריט (P2/P3): שדות, שורות חוזרות, ולידציה ותצוגה מקדימה. */
export function deriveItemForm(s, store) {
  const isAddItemScreen = s.activeScreenId === 'add-item';
  const form = s.itemForm || emptyForm();
  const isP3Persona = s.currentPersona === 'P3';

  const attrFieldNames = (s.itemForm && ATTR_SCHEMA[s.itemForm.axisType])
    || Array.from(new Set(Object.keys(ATTR_SCHEMA).flatMap((k) => ATTR_SCHEMA[k])));

  const tagChips = (form.tags || []).map((t, i) => ({ label: t, onRemove: () => store.removeTag(i) }));

  const trialRows = (form.trials || []).map((t, i) => ({
    performer: t.performer, date: t.date, conditions: t.conditions, finding: t.finding,
    onPerformerChange: (e) => store.updateTrialField(i, 'performer', e.target.value),
    onDateChange: (e) => store.updateTrialField(i, 'date', e.target.value),
    onConditionsChange: (e) => store.updateTrialField(i, 'conditions', e.target.value),
    onFindingChange: (e) => store.updateTrialField(i, 'finding', e.target.value),
    onRemove: () => store.removeTrialRow(i),
  }));

  const formAttributeRows = (form.attributes || []).map((a, i) => ({
    field: a.field, value: a.value,
    onFieldChange: (v) => store.updateAttributeField(i, 'field', v),
    onValueChange: (e) => store.updateAttributeField(i, 'value', e.target.value),
    onRemove: () => store.removeAttributeRow(i),
  }));

  const mediaRows = (form.media || []).map((m, i) => ({
    name: m.name, classification: m.classification, description: m.description,
    mainRadioStyle: { width: '13px', height: '13px', borderRadius: '50%', border: m.isMain ? '4px solid var(--tw-neutral-900)' : '1.5px solid var(--tw-neutral-400)', flexShrink: 0 },
    onNameChange: (e) => store.updateMediaField(i, 'name', e.target.value),
    onClassificationChange: (v) => store.updateMediaField(i, 'classification', v),
    onDescriptionChange: (e) => store.updateMediaField(i, 'description', e.target.value),
    onSetMain: () => store.setMediaMain(i),
    onRemove: () => store.removeMediaFile(i),
  }));

  const linkRows = (form.links || []).map((l, i) => ({
    link: l.link, name: l.name, docType: l.docType, classification: l.classification,
    onLinkChange: (e) => store.updateLinkField(i, 'link', e.target.value),
    onNameChange: (e) => store.updateLinkField(i, 'name', e.target.value),
    onDocTypeChange: (v) => store.updateLinkField(i, 'docType', v),
    onClassificationChange: (v) => store.updateLinkField(i, 'classification', v),
    onRemove: () => store.removeLinkRow(i),
  }));

  return {
    addItemTabFormStyle: underlineTabStyle(s.addItemTab === 'form'),
    addItemTabBatchStyle: underlineTabStyle(s.addItemTab === 'batch'),
    setAddItemTabForm: () => store.setAddItemTab('form'),
    setAddItemTabBatch: () => store.setAddItemTab('batch'),
    isItemFormScreen: isAddItemScreen && s.addItemTab !== 'batch',
    isBatchImportScreen: isAddItemScreen && s.addItemTab === 'batch',

    itemFormTitle: s.formMode === 'edit' ? 'עריכת פריט' : 'הוספת פריט',
    submitButtonLabel: (isP3Persona && !s.p3CanPublish) ? 'שלח לאישור' : 'שלח לפרסום',
    formHasErrors: s.formSubmitAttempted && Object.keys(s.formErrors).length > 0,
    formSavedFlash: s.formSavedFlash,
    openFormPreview: store.openFormPreview,
    closeFormPreview: store.closeFormPreview,
    saveDraftForm: store.saveDraftForm,
    submitForm: store.submitForm,
    openItemFormNew: store.openItemFormNew,

    form,
    formErrors: s.formSubmitAttempted ? s.formErrors : {},
    formIsReturned: s.formMode === 'returned',
    bodyOptionsForForm: toOpts(Array.from(new Set([...BODY_OPTIONS, form.body].filter(Boolean)))),
    ownerOptionsForForm: toOpts(Array.from(new Set([...OWNER_POOL, form.owner].filter(Boolean)))),
    refreshOptionsForForm: toOpts(Array.from(new Set([...REFRESH_POOL, form.refreshRate].filter(Boolean)))),
    responsibleOptionsForForm: toOpts(Array.from(new Set([CURRENT_USER, ...NAME_POOL].filter(Boolean)))),
    axisTypeOptions: toOpts(AXIS_TYPE_VALUES),
    axisDomainOptions: toOpts(AXIS_DOMAIN_VALUES),
    docTypeOptions: toOpts(DOC_TYPE_VALUES),
    attrFieldOptions: toOpts(attrFieldNames),
    contactRequiredMark: form.availabilityStatus === 'זמין' ? ' *' : '',
    procurementRequiredMark: form.availabilityStatus === 'זמין' ? ' *' : '',
    todayDate: '2026-08-19',

    tagChips,
    tagInput: s.tagInput,
    onTagInputChange: store.onTagInputChange,
    onTagInputKeyDown: store.onTagInputKeyDown,
    trialRows,
    addTrialRow: store.addTrialRow,
    formAttributeRows,
    addAttributeRow: store.addAttributeRow,
    mediaRows,
    addMediaFile: store.addMediaFile,
    linkRows,
    addLinkRow: store.addLinkRow,

    onFormNameChange: (e) => store.setFormField('name', e.target.value),
    onFormNameBlur: () => store.validateFormField('name'),
    onFormMekatChange: (e) => store.setFormField('mekat', e.target.value),
    onFormShortDescChange: (e) => store.setFormField('shortDesc', e.target.value),
    onFormFullDescChange: (e) => store.setFormField('fullDesc', e.target.value),
    onFormFullDescBlur: () => store.validateFormField('fullDesc'),
    onFormBodyChange: (v) => store.setFormField('body', v),
    onFormBodyBlur: () => store.validateFormField('body'),
    onFormOwnerChange: (v) => store.setFormField('owner', v),
    onFormOwnerBlur: () => store.validateFormField('owner'),
    onFormClassificationChange: (v) => store.setFormField('classification', v),
    onFormClassificationBlur: () => store.validateFormField('classification'),
    onFormAxisTypeChange: (v) => store.setFormField('axisType', v),
    onFormAxisDomainChange: (v) => store.setFormField('axisDomain', v),
    onFormAvailabilityStatusChange: (v) => store.setFormField('availabilityStatus', v),
    onFormAvailabilityStatusBlur: () => store.validateFormField('availabilityStatus'),
    onFormContactPersonChange: (v) => store.setFormField('contactPerson', v),
    onFormContactPersonBlur: () => store.validateFormField('contactPerson'),
    onFormProcurementRouteChange: (e) => store.setFormField('procurementRoute', e.target.value),
    onFormProcurementRouteBlur: () => store.validateFormField('procurementRoute'),
    onFormRefreshRateChange: (v) => store.setFormField('refreshRate', v),
    onFormRefreshRateBlur: () => store.validateFormField('refreshRate'),
    onFormResponsibleEntryChange: (v) => store.setFormField('responsibleEntry', v),
    onFormLimitationsChange: (e) => store.setFormField('limitations', e.target.value),
    onFormExperienceChange: (e) => store.setFormField('experience', e.target.value),

    formPreviewOpen: s.formPreviewOpen,
    formPreviewName: form.name || '(ללא שם)',
    formPreviewStatus: form.availabilityStatus || '—',
    formPreviewStatusVariant: STATUS_VARIANT[form.availabilityStatus] || 'neutral',
    formPreviewMekat: form.mekat || '—',
    formPreviewFullDesc: form.fullDesc || '—',
    formPreviewBody: form.body || '—',
    formPreviewOwner: form.owner || '—',
    formPreviewContact: form.contactPerson || '—',
    formPreviewRefresh: form.refreshRate || '—',
    formPreviewProcurement: form.procurementRoute || '—',
    formPreviewHasTags: (form.tags || []).length > 0,
    formPreviewTags: (form.tags || []).join(', '),
    formPreviewHasLimitations: !!form.limitations,
    formPreviewHasExperience: !!form.experience,
  };
}
