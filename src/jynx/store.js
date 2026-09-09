import { useSyncExternalStore } from 'react';
import { api, isShared } from './api.js';

/**
 * חוט ההערות המשותף, כפי שהוא נראה מהדפדפן.
 *
 * הכתיבה אופטימית — ההערה עולה על המסך מיד — ואחריה סנכרון מהשירות, כך ששאר
 * המעירים רואים אותה בלי לרענן. כשהחלון פעיל מסנכרנים כל כמה שניות; כשהוא
 * מוסתר מפסיקים, כדי לא להעיר את השירות לחינם.
 */

const POLL_MS = 6000;

let state = { comments: [], user: null, status: isShared ? 'connecting' : 'local', error: '' };
const listeners = new Set();
let pollTimer = null;

function set(patch) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
}

const getSnapshot = () => state;

function subscribe(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
    if (!listeners.size) stopPolling();
  };
}

function startPolling() {
  if (pollTimer || !isShared) return;
  pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible' && state.user) refresh();
  }, POLL_MS);
}
function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}

async function refresh() {
  try {
    const comments = await api.list();
    set({ comments, status: isShared ? 'shared' : 'local', error: '' });
  } catch (err) {
    if (err.code === 401) { set({ user: null, status: isShared ? 'connecting' : 'local' }); return; }
    set({ status: 'error', error: err.message });
  }
}

/** מריצים פעם אחת כשה-UI עולה: משחזרים סשן קיים ומושכים את החוט. */
async function init() {
  const me = await api.me();
  if (me && me.user) {
    set({ user: me.user });
    await refresh();
    startPolling();
  } else {
    set({ status: isShared ? 'connecting' : 'local' });
  }
}

let started = false;
function ensureStarted() {
  if (started) return;
  started = true;
  init();
}

async function write(optimistic, action) {
  optimistic();
  try {
    await action();
    if (state.status === 'error') set({ status: isShared ? 'shared' : 'local', error: '' });
  } catch (err) {
    set({ status: 'error', error: err.message });
  }
  if (isShared) refresh();
}

export const jynx = {
  ensureStarted,
  refresh,

  async login(name, password) {
    try {
      const { user } = await api.login(name, password);
      set({ user, error: '' });
      await refresh();
      startPolling();
      return { ok: true };
    } catch (err) {
      set({ error: err.message });
      return { ok: false, error: err.message };
    }
  },

  async logout() {
    await api.logout();
    stopPolling();
    set({ user: null, comments: [], status: isShared ? 'connecting' : 'local' });
  },

  add(comment) {
    return write(
      () => set({ comments: [...state.comments, comment] }),
      () => api.create(comment),
    );
  },

  addReply(id, reply) {
    const target = state.comments.find((c) => c.id === id);
    const replies = [...((target && target.replies) || []), reply];
    return write(
      () => set({ comments: state.comments.map((c) => (c.id === id ? { ...c, replies } : c)) }),
      () => api.update(id, { replies }),
    );
  },

  setResolved(id, resolved) {
    return write(
      () => set({ comments: state.comments.map((c) => (c.id === id ? { ...c, resolved } : c)) }),
      () => api.update(id, { resolved }),
    );
  },

  remove(id) {
    return write(
      () => set({ comments: state.comments.filter((c) => c.id !== id) }),
      () => api.remove(id),
    );
  },
};

export function useJynx() {
  ensureStarted();
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function newId(prefix = 'c') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
