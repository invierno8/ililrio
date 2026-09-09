import { CURRENT_USER } from '../../data/people.js';
import { REQUIRED_FIELDS, FIELD_LABELS, emptyForm } from '../../data/form.js';
import { STATUS_INFO, STATUS_VARIANT } from '../../data/taxonomy.js';

/** טופס הוספת פריט ועריכתו, כולל ולידציה ותצוגה מקדימה. */
export function attachItemFormActions(store) {
  store.openItemFormNew = () => {
    store.setState({ activeScreenId: 'add-item', addItemTab: 'form', formMode: 'new', formSourceId: null, itemForm: emptyForm(), formErrors: {}, formSubmitAttempted: false, tagInput: '', expandedNavId: 'add-item' });
  };
  store.openItemFormEditPublished = (itemId) => {
    const item = store.getMergedItem(itemId);
    const form = emptyForm();
    form.name = item.name; form.mekat = item.mekat || ''; form.fullDesc = item.desc || '';
    form.body = item.body; form.owner = item.owner;
    form.availabilityStatus = item.status; form.contactPerson = item.contact; form.procurementRoute = item.procurement;
    form.limitations = item.limitations === 'לא תועד' ? '' : (item.limitations || '');
    form.experience = item.experience === 'לא תועד' ? '' : (item.experience || '');
    form.trials = (item.trials || []).map(t => ({ performer: t.name || '', date: '', conditions: '', finding: t.outcome || '' }));
    form.links = (item.attachments || []).map(a => ({ link: '', name: a.name || '', docType: '', classification: '' }));
    store.setState({ activeScreenId: 'add-item', addItemTab: 'form', formMode: 'edit', formSourceId: itemId, itemForm: form, formErrors: {}, formSubmitAttempted: false, tagInput: '', expandedNavId: 'add-item' });
  };
  store.setFormField = (key, value) => store.setState(s => ({ itemForm: { ...s.itemForm, [key]: value } }));
  store.validateFormField = (key) => {
    const f = store.state.itemForm;
    const errors = { ...store.state.formErrors };
    const conditionallyRequired = (key === 'contactPerson' || key === 'procurementRoute') && f.availabilityStatus === 'זמין';
    const required = REQUIRED_FIELDS.includes(key) || conditionallyRequired;
    const empty = !f[key] || (typeof f[key] === 'string' && f[key].trim() === '');
    if (required && empty) errors[key] = FIELD_LABELS[key] + ' הוא שדה חובה';
    else delete errors[key];
    store.setState({ formErrors: errors });
  };
  store.validateAllFormFields = () => {
    const f = store.state.itemForm;
    const errors = {};
    REQUIRED_FIELDS.forEach(key => {
      const empty = !f[key] || (typeof f[key] === 'string' && f[key].trim() === '');
      if (empty) errors[key] = FIELD_LABELS[key] + ' הוא שדה חובה';
    });
    if (f.availabilityStatus === 'זמין') {
      if (!f.contactPerson) errors.contactPerson = FIELD_LABELS.contactPerson + ' הוא שדה חובה כאשר הפריט זמין';
      if (!f.procurementRoute || f.procurementRoute.trim() === '') errors.procurementRoute = FIELD_LABELS.procurementRoute + ' הוא שדה חובה כאשר הפריט זמין';
    }
    return errors;
  };
  store.openFormPreview = () => store.setState({ formPreviewOpen: true });
  store.closeFormPreview = () => store.setState({ formPreviewOpen: false });
  store.saveDraftForm = () => {
    store.setState({ formSavedFlash: true });
    clearTimeout(store._draftFlashTimer);
    store._draftFlashTimer = setTimeout(() => store.setState({ formSavedFlash: false }), 2000);
  };
  store.submitForm = () => {
    const errors = store.validateAllFormFields();
    if (Object.keys(errors).length > 0) { store.setState({ formErrors: errors, formSubmitAttempted: true }); return; }
    store.setState(s => {
      const f = s.itemForm;
      const patch = { activeScreenId: 'my-items', activeMyItemsTab: 'items', itemForm: null, formErrors: {}, formSubmitAttempted: false, expandedNavId: null };
      if (s.formMode === 'edit' && s.formSourceId != null) {
        patch.itemOverrides = { ...s.itemOverrides, [s.formSourceId]: {
          desc: f.fullDesc, status: f.availabilityStatus, contact: f.contactPerson, procurement: f.procurementRoute,
          statusVariant: STATUS_VARIANT[f.availabilityStatus], statusInfo: STATUS_INFO[f.availabilityStatus]
        } };
      }
      return patch;
    });
  };
  store.onTagInputChange = (e) => store.setState({ tagInput: e.target.value });
  store.onTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && store.state.tagInput.trim() !== '') {
      const tag = store.state.tagInput.trim();
      store.setState(s => ({ itemForm: { ...s.itemForm, tags: [...(s.itemForm.tags || []), tag] }, tagInput: '' }));
    }
  };
  store.removeTag = (idx) => store.setState(s => ({ itemForm: { ...s.itemForm, tags: s.itemForm.tags.filter((_, i) => i !== idx) } }));
  store.addTrialRow = () => store.setState(s => ({ itemForm: { ...s.itemForm, trials: [...(s.itemForm.trials || []), { performer: '', date: '', conditions: '', finding: '' }] } }));
  store.updateTrialField = (idx, key, val) => store.setState(s => { const trials = [...s.itemForm.trials]; trials[idx] = { ...trials[idx], [key]: val }; return { itemForm: { ...s.itemForm, trials } }; });
  store.removeTrialRow = (idx) => store.setState(s => ({ itemForm: { ...s.itemForm, trials: s.itemForm.trials.filter((_, i) => i !== idx) } }));
  store.addAttributeRow = () => store.setState(s => ({ itemForm: { ...s.itemForm, attributes: [...(s.itemForm.attributes || []), { field: '', value: '' }] } }));
  store.updateAttributeField = (idx, key, val) => store.setState(s => { const attributes = [...s.itemForm.attributes]; attributes[idx] = { ...attributes[idx], [key]: val }; return { itemForm: { ...s.itemForm, attributes } }; });
  store.removeAttributeRow = (idx) => store.setState(s => ({ itemForm: { ...s.itemForm, attributes: s.itemForm.attributes.filter((_, i) => i !== idx) } }));
  store.addMediaFile = () => store.setState(s => { const media = s.itemForm.media || []; return { itemForm: { ...s.itemForm, media: [...media, { name: 'קובץ_' + (media.length + 1) + '.jpg', classification: '', description: '', isMain: media.length === 0 }] } }; });
  store.updateMediaField = (idx, key, val) => store.setState(s => { const media = [...s.itemForm.media]; media[idx] = { ...media[idx], [key]: val }; return { itemForm: { ...s.itemForm, media } }; });
  store.removeMediaFile = (idx) => store.setState(s => {
    const media = s.itemForm.media.filter((_, i) => i !== idx);
    if (!media.some(m => m.isMain) && media.length > 0) media[0] = { ...media[0], isMain: true };
    return { itemForm: { ...s.itemForm, media } };
  });
  store.setMediaMain = (idx) => store.setState(s => ({ itemForm: { ...s.itemForm, media: s.itemForm.media.map((m, i) => ({ ...m, isMain: i === idx })) } }));
  store.addLinkRow = () => store.setState(s => ({ itemForm: { ...s.itemForm, links: [...(s.itemForm.links || []), { link: '', name: '', docType: '', classification: '' }] } }));
  store.updateLinkField = (idx, key, val) => store.setState(s => { const links = [...s.itemForm.links]; links[idx] = { ...links[idx], [key]: val }; return { itemForm: { ...s.itemForm, links } }; });
  store.removeLinkRow = (idx) => store.setState(s => ({ itemForm: { ...s.itemForm, links: s.itemForm.links.filter((_, i) => i !== idx) } }));
}
