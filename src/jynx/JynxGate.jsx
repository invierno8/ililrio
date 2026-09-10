import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Eye, EyeOff, MessageSquare, GripVertical, GripHorizontal, X, Loader2, Target, Users } from 'lucide-react';
import { useRio } from '../store/index.js';
import { useIsNarrow } from '../components/DesktopOnly.jsx';
import { jynxConfigured, jynxLogin, jynxLogout, fetchMe, fetchComments, submitAnnotation, editAnnotation, resolveAnnotation, replyToAnnotation, deleteAnnotation } from './devApi.js';
import { useDraggableFab } from './useDraggableFab.js';
import { useKeepInViewport } from './useKeepInViewport.js';
import JynxBubbleContent from './JynxBubbleContent.jsx';
import DevOverlay from './DevOverlay.jsx';
import CommentsPanel from './CommentsPanel.jsx';
import GreetingMenu from './GreetingMenu.jsx';
import UsersPanel from './UsersPanel.jsx';
import HotkeyHint from './HotkeyHint.jsx';
import { useHotkeyModifier, MODIFIERS } from './hotkey.js';
import './theme.css';

/* ==================================================================
   השער של Jynx — הגרסה של DevAuthGate.jsx מ-commando, בלי מה שאינו הערות:
   בלי בורר תפקיד/חטיבה, בלי ציור, בלי אזכורים ובלי תור פעולות.

   מי שיש לו משתמש נכנס ומעיר; מי שאין לו רואה את אותה בועה נעולה בדיוק כמו
   שם. אין מצב "נשמר אצלי בדפדפן" — החוט משותף או שאינו קיים.
   ================================================================== */

const DEFAULT_TOOLBAR_ORDER = ['overlay', 'comments', 'markers', 'users'];
const TOOLBAR_ORIENTATION_KEY = 'jynx-toolbar-orientation';
const OVERLAY_ON_KEY = 'jynx-overlay-on';
const MARKERS_ON_KEY = 'jynx-markers-on';

const SHORTCUT_LABELS = { overlay: 'Hover overlay', comments: 'Comments panel', markers: 'Status dots', users: 'Users' };
const POLL_MS = 6000;

function loadFlag(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === 'true';
  } catch { return fallback; }
}

const SCREEN_LABELS = {
  catalog: 'Catalog', 'item-detail': 'Item', 'my-follows': 'My follows', notifications: 'Notifications',
  'my-items': 'My items', 'add-item': 'Add item', 'my-tasks': 'My tasks', users: 'Users',
  'approvers-group': 'Approvers', 'p4-user-detail': 'User card', 'role-transfer': 'Role transfer',
  'managed-lists': 'Managed lists', 'activity-log': 'Activity log', 'entry-gate': 'Entry gate',
};

export default function JynxGate() {
  const { state } = useRio();
  const isNarrow = useIsNarrow();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);

  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loginPhase, setLoginPhase] = useState('idle'); // idle | thinking | success | error
  const [error, setError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [pendingWelcomeName, setPendingWelcomeName] = useState('');

  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [toolbarOrientation, setToolbarOrientation] = useState(() => {
    try { return localStorage.getItem(TOOLBAR_ORIENTATION_KEY) === 'vertical' ? 'vertical' : 'horizontal'; } catch { return 'horizontal'; }
  });
  const [overlayOn, setOverlayOn] = useState(() => loadFlag(OVERLAY_ON_KEY, true));
  const [markersOn, setMarkersOn] = useState(() => loadFlag(MARKERS_ON_KEY, true));
  const [commentsOn, setCommentsOn] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  // ההעדפה נשמרת לפי המשתמש, לא לפי הדפדפן — מי שמחליף מקש משנה רק לעצמו.
  const [hotkey, setHotkey] = useHotkeyModifier(user?.id);

  const lockedFab = useDraggableFab('jynx-locked-fab-pos');
  const toolbarFab = useDraggableFab('jynx-toolbar-pos');
  const loginPanelRef = useRef(null);
  useKeepInViewport(loginPanelRef, loginOpen, 8, [error]);

  const route = `${state.currentPersona}:${state.activeScreenId}`;

  useEffect(() => { try { localStorage.setItem(OVERLAY_ON_KEY, String(overlayOn)); } catch { /* ignore */ } }, [overlayOn]);
  useEffect(() => { try { localStorage.setItem(MARKERS_ON_KEY, String(markersOn)); } catch { /* ignore */ } }, [markersOn]);

  // שחזור סשן קיים. השירות ב-Render נרדם אחרי חוסר פעילות, ולכן הבועה מציגה
  // "Waking up…" עם ספינר במקום להיעלם בשקט עד שהוא חוזר.
  useEffect(() => {
    let cancelled = false;
    fetchMe().then((me) => {
      if (cancelled) return;
      setUser(me);
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setComments(await fetchComments());
    } catch (e) {
      if (e.code === 401) setUser(null);
    }
  }, []);

  // סנכרון רציף — כך ששני אנשים על אותו מסך רואים אחד את ההערות של השני בלי
  // לרענן. כשהחלון מוסתר לא מושכים, כדי לא להעיר את השירות לחינם.
  useEffect(() => {
    if (!user) return undefined;
    refresh();
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, POLL_MS);
    return () => clearInterval(t);
  }, [user, refresh]);

  const toolbarOrder = DEFAULT_TOOLBAR_ORDER.filter((id) => id !== 'users' || (user && user.isAdmin));

  // מקשי 1..N מפעילים את כפתורי הסרגל לפי סדרם בפועל, כמו במקור.
  useEffect(() => {
    if (!user) return undefined;
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if (typing) return;
      const idx = Number(e.key) - 1;
      if (!Number.isInteger(idx) || idx < 0 || idx >= toolbarOrder.length) return;
      e.preventDefault();
      const id = toolbarOrder[idx];
      if (id === 'overlay') setOverlayOn((v) => !v);
      if (id === 'comments') setCommentsOn((v) => !v);
      if (id === 'markers') setMarkersOn((v) => !v);
      if (id === 'users') setUsersOpen((v) => !v);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user, toolbarOrder]);

  function toggleOrientation() {
    const next = toolbarOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    setToolbarOrientation(next);
    try { localStorage.setItem(TOOLBAR_ORIENTATION_KEY, next); } catch { /* ignore */ }
  }

  async function login() {
    if (!password.trim() || loginPhase === 'thinking') return;
    setLoginPhase('thinking');
    setError('');
    try {
      const me = await jynxLogin(password);
      setPendingWelcomeName(me.name);
      setLoginPhase('success');
      setTimeout(() => {
        setUser(me);
        setLoginOpen(false);
        setToolbarOpen(true);
        setLoginPhase('idle');
        setPassword('');
      }, 900);
    } catch (e) {
      setError(e.message || 'Sign in failed');
      setLoginPhase('error');
    }
  }

  function logout() {
    jynxLogout();
    setUser(null);
    setComments([]);
    setToolbarOpen(false);
    setCommentsOn(false);
    setUsersOpen(false);
  }

  /**
   * מיזוג לפי מזהה, ולא דחיפה לסוף. שמירת הערה כוללת commit ל-GitHub ולכן
   * לוקחת כמה שניות, והפולינג של שש השניות נוחת באמצע — השרת כבר מחזיק את
   * ההערה, אבל התשובה ל-POST עוד לא חזרה. דחיפה עיוורת הייתה מוסיפה אותה
   * פעם שנייה, וזו הייתה הכפילות שכל הערה סבלה ממנה.
   */
  const mergeComment = (saved) => setComments((prev) => (
    prev.some((c) => c.id === saved.id) ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved]
  ));

  async function handleSubmit(payload) {
    mergeComment(await submitAnnotation(payload));
  }
  async function handleResolve(a, resolved) {
    setComments((prev) => prev.map((c) => (c.id === a.id ? { ...c, resolved } : c)));
    await resolveAnnotation(a.id, resolved).catch(() => refresh());
  }
  async function handleDelete(a) {
    setComments((prev) => prev.filter((c) => c.id !== a.id));
    await deleteAnnotation(a.id).catch(() => refresh());
  }
  async function handleEdit(a, comment) {
    setComments((prev) => prev.map((c) => (c.id === a.id ? { ...c, comment } : c)));
    await editAnnotation(a.id, comment).catch(() => refresh());
  }
  async function handleReply(a, body) {
    const saved = await replyToAnnotation(a.id, body).catch(() => null);
    if (saved) mergeComment(saved);
    else refresh();
  }

  // במסך צר הדמו עצמו מוחלף בהודעת "מחשב בלבד" — אין על מה להעיר.
  if (isNarrow) return null;

  if (checking) {
    return (
      <div className="dev-fab-wrap jynx-chrome jynx-ui" style={{ right: lockedFab.pos.right, bottom: lockedFab.pos.bottom }}>
        <div className="dev-fab dev-fab-locked jynx-thinking-pulse" title="Jynx is waking her server up — this can take up to ~30s on a cold start">
          <Loader2 size={13} className="dev-fab-waking-spinner" />
          <JynxBubbleContent mood="waking" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="dev-fab-wrap jynx-chrome jynx-ui"
        style={{ right: lockedFab.pos.right, bottom: lockedFab.pos.bottom }}
        tabIndex={-1}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget) && loginPhase !== 'thinking' && loginPhase !== 'success') setLoginOpen(false); }}
      >
        {loginOpen && (
          <div ref={loginPanelRef} className="dev-fab-panel dev-only dev-login-panel">
            <span className="dev-only-tag">JYNX — Sign in to comment</span>
            {!jynxConfigured ? (
              <div className="dev-login-error">No Jynx service configured for this build.</div>
            ) : (
              <>
                <label className="env-strip-identity">
                  <span>Password</span>
                  <input
                    type="password" value={password} autoFocus
                    onChange={(e) => { setPassword(e.target.value); if (loginPhase === 'error') setLoginPhase('idle'); }}
                    onKeyDown={(e) => e.key === 'Enter' && login()}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    disabled={loginPhase === 'thinking' || loginPhase === 'success'}
                  />
                </label>
                {error && <div className="dev-login-error">{error}</div>}
                <button type="button" className="dev-login-submit" onClick={login} disabled={!password.trim() || loginPhase === 'thinking' || loginPhase === 'success'}>
                  {loginPhase === 'thinking' ? <Loader2 size={13} className="dev-login-spinner" /> : 'Sign in'}
                </button>
              </>
            )}
          </div>
        )}
        <button
          type="button"
          ref={lockedFab.sizeRef}
          className={'dev-fab dev-fab-locked' + (loginPhase === 'thinking' ? ' jynx-thinking-pulse' : ' jynx-breathe')}
          onClick={() => { if (!lockedFab.consumeWasDragged()) setLoginOpen((v) => !v); }}
          {...lockedFab.dragHandlers}
          title="Sign in to leave comments — draggable"
        >
          <Lock size={13} />
          <JynxBubbleContent
            mood={loginPhase !== 'idle' ? loginPhase : (passwordFocused ? 'typing' : 'idle')}
            welcomeName={pendingWelcomeName}
            errorText={error}
          />
        </button>
      </div>
    );
  }

  const openCount = comments.filter((c) => !c.resolved).length;
  const shortcuts = toolbarOrder.map((id, i) => ({ num: i + 1, label: SHORTCUT_LABELS[id] || id }));

  const TOOLBAR_ITEM_NODES = {
    overlay: (
      <button type="button" className="dev-toolbar-icon-btn" data-devblock="jynx-toolbar-overlay-toggle" onClick={() => setOverlayOn((v) => !v)} title={overlayOn ? 'Turn off hover overlay' : 'Turn on hover overlay'}>
        {overlayOn ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>
    ),
    comments: (
      <button type="button" className={'dev-toolbar-icon-btn' + (commentsOn ? ' active' : '')} data-devblock="jynx-toolbar-comments-toggle" onClick={() => setCommentsOn((v) => !v)} title={commentsOn ? 'Hide the comments panel' : 'Show all comments'}>
        <MessageSquare size={13} />
      </button>
    ),
    markers: (
      <button type="button" className={'dev-toolbar-icon-btn' + (markersOn ? ' active' : '')} data-devblock="jynx-toolbar-markers-toggle" onClick={() => setMarkersOn((v) => !v)} title={markersOn ? 'Hide comment status dots' : 'Show comment status dots'}>
        <Target size={13} />
      </button>
    ),
    users: user.isAdmin ? (
      <button type="button" className={'dev-toolbar-icon-btn' + (usersOpen ? ' active' : '')} data-devblock="jynx-toolbar-users-toggle" onClick={() => setUsersOpen((v) => !v)} title="Who can comment — admins only">
        <Users size={13} />
      </button>
    ) : null,
  };

  return (
    <>
      <DevOverlay
        hoverOn={overlayOn}
        markersOn={markersOn}
        route={route}
        comments={comments}
        currentUser={user}
        hotkey={hotkey}
        onSubmit={handleSubmit}
        onResolve={handleResolve}
        onDelete={handleDelete}
      />

      {commentsOn && (
        <CommentsPanel
          comments={comments}
          route={route}
          routeLabel={SCREEN_LABELS[state.activeScreenId] || state.activeScreenId}
          hotkeySymbol={MODIFIERS[hotkey].symbol}
          currentUser={user}
          onClose={() => setCommentsOn(false)}
          onResolve={handleResolve}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onReply={handleReply}
        />
      )}

      {usersOpen && user.isAdmin && <UsersPanel onClose={() => setUsersOpen(false)} />}

      {toolbarOpen ? (
        <div className="dev-fab-toolbar-wrap" style={{ right: toolbarFab.pos.right, bottom: toolbarFab.pos.bottom }}>
          <div
            ref={toolbarFab.sizeRef}
            className={'dev-fab-toolbar jynx-chrome jynx-ui' + (toolbarOrientation === 'vertical' ? ' vertical' : '')}
            {...toolbarFab.dragHandlers}
          >
            <button type="button" className="dev-toolbar-grip" onClick={toggleOrientation} title={`Switch to ${toolbarOrientation === 'horizontal' ? 'vertical' : 'horizontal'} menu (click here — drag anywhere else on the bar to move it)`}>
              {toolbarOrientation === 'vertical' ? <GripHorizontal size={15} /> : <GripVertical size={15} />}
            </button>
            {toolbarOrder.map((id, i) => (
              TOOLBAR_ITEM_NODES[id] && (
                <div key={id} className="jynx-toolbar-item">
                  <span className="jynx-toolbar-key-badge">{i + 1}</span>
                  {TOOLBAR_ITEM_NODES[id]}
                </div>
              )
            ))}
            <GreetingMenu user={user} shortcuts={shortcuts} hotkeySymbol={MODIFIERS[hotkey].symbol} onLogout={logout} />
            <button type="button" className="dev-toolbar-icon-btn" data-devblock="jynx-toolbar-collapse-btn" onClick={() => setToolbarOpen(false)} title="Collapse to the Jynx bubble">
              <X size={13} />
            </button>
          </div>
          <HotkeyHint modifier={hotkey} onChange={setHotkey} />
        </div>
      ) : (
        <div className="dev-fab-wrap jynx-chrome jynx-ui" style={{ right: toolbarFab.pos.right, bottom: toolbarFab.pos.bottom }}>
          <button
            type="button"
            ref={toolbarFab.sizeRef}
            className="dev-fab jynx-breathe dev-fab-collapsed"
            onClick={() => { if (!toolbarFab.consumeWasDragged()) setToolbarOpen(true); }}
            {...toolbarFab.dragHandlers}
            title="Expand the Jynx toolbar — draggable"
          >
            <JynxBubbleContent mood="idle" />
            {openCount > 0 && <span className="dev-fab-collapsed-badge">{openCount > 9 ? '9+' : openCount}</span>}
          </button>
        </div>
      )}
    </>
  );
}
