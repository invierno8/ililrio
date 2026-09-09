import { BODY_OPTIONS, CURRENT_USER } from './people.js';

// שדות טופס הפריט: מה חובה, איך קוראים לשדה, ואיך נראה טופס ריק.
export const REQUIRED_FIELDS = ['name', 'fullDesc', 'body', 'owner', 'classification', 'availabilityStatus', 'refreshRate'];
export const FIELD_LABELS = { name: 'שם הפריט', fullDesc: 'תיאור מלא', body: 'גוף אחראי', owner: 'בעל הפריט', classification: 'רמת סיווג', availabilityStatus: 'סטטוס זמינות', refreshRate: 'קצב רענון', contactPerson: 'איש קשר', procurementRoute: 'מסלול הזמנה' };

export function emptyForm() {
  return {
    name: '', mekat: '', shortDesc: '', fullDesc: '',
    body: BODY_OPTIONS[0], owner: '', classification: '', axisType: '', axisDomain: '', tags: [],
    limitations: '', experience: '', trials: [],
    media: [], links: [],
    availabilityStatus: '', contactPerson: '', procurementRoute: '',
    refreshRate: '', responsibleEntry: CURRENT_USER,
    attributes: [],
    returnNote: ''
  };
}
