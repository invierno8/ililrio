import { ITEMS } from '../data/items.js';
import { initialState } from './state.js';
import { attachShellActions } from './actions/shell.js';
import { attachCatalogActions } from './actions/catalog.js';
import { attachDetailActions } from './actions/detail.js';
import { attachFollowsActions } from './actions/follows.js';
import { attachNotificationsActions } from './actions/notifications.js';
import { attachMyItemsActions } from './actions/myItems.js';
import { attachItemFormActions } from './actions/itemForm.js';
import { attachBatchActions } from './actions/batch.js';
import { attachMyTasksActions } from './actions/myTasks.js';
import { attachAdminActions } from './actions/admin.js';

/**
 * חנות המצב של הדמו. אין כאן שרת ואין קריאות רשת — כל המצב חי בזיכרון הדפדפן
 * ונבנה מנתוני ההדגמה שב-src/data.
 *
 * הפעולות עצמן מחולקות למודולים לפי מסך (src/store/actions), וכל מודול תולה את
 * הפעולות שלו על אותו מופע חנות, כך שפעולה יכולה לקרוא לפעולה אחרת דרך store.
 */
export class RioStore {
  constructor() {
    this.state = initialState();
    this.listeners = new Set();
    this._cachedState = null;

    attachShellActions(this);
    attachCatalogActions(this);
    attachDetailActions(this);
    attachFollowsActions(this);
    attachNotificationsActions(this);
    attachMyItemsActions(this);
    attachItemFormActions(this);
    attachBatchActions(this);
    attachMyTasksActions(this);
    attachAdminActions(this);
  }

  /** מקבל אובייקט טלאי או פונקציה (state) => טלאי, בדיוק כמו setState של React. */
  setState = (patch) => {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    if (!next) return;
    this.state = { ...this.state, ...next };
    this.listeners.forEach((fn) => fn());
  };

  getState = () => this.state;

  /** מוזרק מ-App: גלילת אזור התוכן חזרה לראש בעת מעבר מסך. */
  mainScrollEl = null;
  scrollMainToTop = () => {
    if (this.mainScrollEl) this.mainScrollEl.scrollTop = 0;
  };

  subscribe = (fn) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  // ---- עזרי מצב משותפים -----------------------------------------------------

  /** פריט הקטלוג אחרי מיזוג העריכות המקומיות שנעשו בדמו. */
  getMergedItem = (id) => {
    const base = ITEMS.find((it) => it.id === id) || ITEMS[0];
    return { ...base, ...(this.state.itemOverrides[base.id] || {}) };
  };

  getItem = (id) => this.getMergedItem(id);

  toggleSort = (stateKey, field) =>
    this.setState((s) => {
      const cur = s[stateKey] || {};
      const dir = cur.key === field ? (cur.dir === 'asc' ? 'desc' : 'asc') : 'asc';
      return { [stateKey]: { key: field, dir } };
    });

  applySort(rows, sortState, comparators, defaultKey, defaultDir) {
    const key = (sortState && sortState.key) || defaultKey;
    const dir = (sortState && sortState.dir) || defaultDir || 'asc';
    const cmp = comparators[key];
    if (!cmp) return rows;
    const sorted = [...rows].sort(cmp);
    return dir === 'desc' ? sorted.reverse() : sorted;
  }

  sortArrow(sortState, key) {
    if (!sortState || sortState.key !== key) return '';
    return sortState.dir === 'asc' ? ' ↑' : ' ↓';
  }

  /** מצב תצוגה זמני לשורה בטבלה (פתיחת אישור, טופס פנימי וכדומה). */
  getRowUI = (ns, id) => this.state.rowUI[ns + ':' + id] || {};
  setRowUI = (ns, id, patch) =>
    this.setState((s) => ({ rowUI: { ...s.rowUI, [ns + ':' + id]: { ...(s.rowUI[ns + ':' + id] || {}), ...patch } } }));

  getPendingUI = (id) => this.state.pendingUI[id] || { confirmOpen: false, noteOpen: false, noteText: '', noteError: false };
  setPendingUI = (id, patch) =>
    this.setState((s) => ({ pendingUI: { ...s.pendingUI, [id]: { ...this.getPendingUI(id), ...patch } } }));
}
