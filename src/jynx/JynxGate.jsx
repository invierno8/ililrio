import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Eye, EyeOff, MessageSquare, GripVertical, GripHorizontal, X, Loader2, Target, Users, Pencil } from 'lucide-react';
import { useRio } from '../store/index.js';
import { useIsNarrow } from '../components/DesktopOnly.jsx';
import {
  jynxConfigured, jynxLogin, jynxLogout, fetchMe, fetchThread, submitAnnotation, editAnnotation,
  resolveAnnotation, replyToAnnotation, deleteAnnotation, setCommentGroup, createGroup, renameGroup, deleteGroup,
} from './devApi.js';
import { useDraggableFab } from './useDraggableFab.js';
import { useKeepInViewport } from './useKeepInViewport.js';
import JynxBubbleContent from './JynxBubbleContent.jsx';
import DevOverlay from './DevOverlay.jsx';
import CommentsPanel from './CommentsPanel.jsx';
import GreetingMenu from './GreetingMenu.jsx';
import UsersPanel from './UsersPanel.jsx';
import HotkeyHint from './HotkeyHint.jsx';
import { useHotkeyModifier, hotkeySymbol, isPlainKey, plainKeyOf } from './hotkey.js';
import { screenOf, personaOf } from './route.js';
import './theme.css';

/* ==================================================================
   השער של Jynx — הגרסה של DevAuthGate.jsx מ-commando, בלי מה שאינו הערות:
   בלי בורר תפקיד/חטיבה, בלי ציור, בלי אזכורים ובלי תור פעולות.

   מי שיש לו משתמש נכנס ומעיר; מי שאין לו רואה את אותה בועה נעולה בדיוק כמו
   שם. אין מצב "נשמר אצלי בדפדפן" — החוט משותף או שאינו קיים.
   ================================================================== */

const DEFAULT_TOOLBAR_ORDER = ['overlay', 'draw', 'comments', 'markers', 'users'];

/** ארבע המשבצות של לוח הציור, כמו ב-commando. */
const JYNX_DRAW_COLORS = [
  { name: 'Jynx purple', value: '#9B82FF' },
  { name: 'Red', value: '#E85A4D' },
  { name: 'Amber', value: '#E6A93C' },
  { name: 'Green', value: '#35E08F' },
];
const DRAW_COLOR_KEY = 'jynx-draw-color';
const TOOLBAR_ORIENTATION_KEY = 'jynx-toolbar-orientation';
const OVERLAY_ON_KEY = 'jynx-overlay-on';
const MARKERS_ON_KEY = 'jynx-markers-on';

const SHORTCUT_LABELS = { overlay: 'Hover overlay', draw: 'Drawing', comments: 'Comments panel', markers: 'Status dots', users: 'Users' };
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
  // store נדרש כדי לקחת את המשתמש למסך שעליו נכתבה הערה.
  const { state, store } = useRio();
  const isNarrow = useIsNarrow();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [groups, setGroups] = useState([]);

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
  const [drawMode, setDrawMode] = useState(false);
  const [drawColor, setDrawColor] = useState(() => {
    try { return localStorage.getItem(DRAW_COLOR_KEY) || JYNX_DRAW_COLORS[0].value; } catch { return JYNX_DRAW_COLORS[0].value; }
  });
  // ההעדפה נשמרת לפי המשתמש, לא לפי הדפדפן — מי שמחליף מקש משנה רק לעצמו.
  const [hotkey, setHotkey] = useHotkeyModifier(user?.id);

  // ברירת המחדל מוזחת שמאלה מהפינה: תפריט הצד של RIO תופס 176px בימין, ובדיוק
  // שם יושבים מחליף הפרסונות וכרטיס המשתמש — בועה בפינה הייתה מכסה אותם.
  // מרגע שגוררים, המיקום הנשמר הוא שקובע.
  const DEFAULT_FAB_POS = { right: 200, bottom: 20 };
  const lockedFab = useDraggableFab('jynx-locked-fab-pos', DEFAULT_FAB_POS);
  const drawPaletteFab = useDraggableFab('jynx-draw-palette-pos', { right: 200, bottom: 130 });
  const toolbarFab = useDraggableFab('jynx-toolbar-pos', DEFAULT_FAB_POS);
  const loginPanelRef = useRef(null);
  useKeepInViewport(loginPanelRef, loginOpen, 8, [error]);

  // המסך בלבד. הפרסונה נשמרת בנפרד, כדי שהיא לא תחלק את החוט לארבעה
  // חוטים שאיש אינו רואה את כולם — ראו route.js.
  const route = state.activeScreenId;
  const routeItemId = state.activeScreenId === 'item-detail' ? state.selectedItemId : null;

  /**
   * לוקח את המשתמש למסך שעליו נכתבה הערה, גם אם הוא בפרסונה אחרת. אחרי
   * המעבר המסך נטען מחדש (יש שלד קצר), ולכן מי שקורא לזה ממתין להופעת
   * האלמנט לפני שהוא גולל אליו — ראו CommentsPanel.
   */
  const goToCommentRoute = useCallback((comment) => {
    const screenId = screenOf(comment.route);
    if (!screenId) return;
    const persona = personaOf(comment);
    if (persona && persona !== state.currentPersona) store.switchPersona(persona);
    if (screenId === 'item-detail' && comment.routeItemId != null) {
      store.openItem(comment.routeItemId);
    } else {
      store.setState({ activeScreenId: screenId });
    }
  }, [state.currentPersona, store]);

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

  /**
   * חותמת השינוי המקומי האחרון. הפולינג של שש השניות ותשובת הכתיבה מתחרים
   * זה בזה: משיכה שיצאה לדרך לפני שינוי מקומי חוזרת עם המצב שלפניו, ואם היא
   * נוחתת אחריו היא מוחקת אותו מהמסך — וזה מה שיצר קבוצה כפולה מגרירה אחת.
   * לכן תשובה כזו נזרקת; המשיכה הבאה ממילא תביא את המצב המלא.
   */
  const lastLocalWrite = useRef(0);
  const markLocalWrite = () => { lastLocalWrite.current = Date.now(); };

  const refresh = useCallback(async () => {
    const startedAt = Date.now();
    try {
      const thread = await fetchThread();
      if (lastLocalWrite.current > startedAt) return;
      setComments(thread.comments);
      setGroups(thread.groups);
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
      // אם המשתמש בחר ספרה כמקש ההערה, היא שייכת לו ולא לסרגל.
      if (isPlainKey(hotkey) && String(e.key).toLowerCase() === plainKeyOf(hotkey)) return;
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
      if (id === 'draw') setDrawMode((v) => !v);
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
    setGroups([]);
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
    markLocalWrite();
    mergeComment(await submitAnnotation(payload));
    markLocalWrite();
  }
  async function handleResolve(a, resolved) {
    markLocalWrite();
    setComments((prev) => prev.map((c) => (c.id === a.id ? { ...c, resolved } : c)));
    await resolveAnnotation(a.id, resolved).catch(() => refresh());
    markLocalWrite();
  }
  async function handleDelete(a) {
    markLocalWrite();
    setComments((prev) => prev.filter((c) => c.id !== a.id));
    await deleteAnnotation(a.id).catch(() => refresh());
    markLocalWrite();
  }
  async function handleEdit(a, comment) {
    markLocalWrite();
    setComments((prev) => prev.map((c) => (c.id === a.id ? { ...c, comment } : c)));
    await editAnnotation(a.id, comment).catch(() => refresh());
    markLocalWrite();
  }
  // קיבוץ: כל פעולה מעדכנת מיד על המסך, ואז מסתנכרנת מהשירות.
  /** מיזוג לפי מזהה, כמו בהערות — אף פעם לא דחיפה עיוורת לסוף. */
  const mergeGroup = (saved) => setGroups((prev) => (
    prev.some((g) => g.id === saved.id) ? prev.map((g) => (g.id === saved.id ? saved : g)) : [...prev, saved]
  ));

  async function handleGroup(name, commentIds) {
    markLocalWrite();
    const group = await createGroup(name, commentIds).catch(() => null);
    markLocalWrite();
    if (!group) { refresh(); return; }
    mergeGroup(group);
    setComments((prev) => prev.map((c) => (commentIds.includes(c.id) ? { ...c, groupId: group.id } : c)));
  }
  async function handleMoveToGroup(comment, groupId) {
    markLocalWrite();
    setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, groupId } : c)));
    await setCommentGroup(comment.id, groupId).catch(() => refresh());
    markLocalWrite();
  }
  async function handleRenameGroup(id, name) {
    markLocalWrite();
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
    await renameGroup(id, name).catch(() => refresh());
    markLocalWrite();
  }
  async function handleUngroup(id) {
    markLocalWrite();
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setComments((prev) => prev.map((c) => (c.groupId === id ? { ...c, groupId: null } : c)));
    await deleteGroup(id).catch(() => refresh());
    markLocalWrite();
  }

  async function handleReply(a, body) {
    markLocalWrite();
    const saved = await replyToAnnotation(a.id, body).catch(() => null);
    markLocalWrite();
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
    draw: (
      <button type="button" className={'dev-toolbar-icon-btn' + (drawMode ? ' active' : '')} data-devblock="jynx-toolbar-draw-toggle" onClick={() => setDrawMode((v) => !v)} title={drawMode ? 'Turn off drawing' : `Turn on drawing — hold ${hotkeySymbol(hotkey)} and drag on the page`}>
        <Pencil size={13} />
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
        drawMode={drawMode}
        drawColor={drawColor}
        route={route}
        routePersona={state.currentPersona}
        routeItemId={routeItemId}
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
          groups={groups}
          route={route}
          routeLabel={SCREEN_LABELS[state.activeScreenId] || state.activeScreenId}
          hotkeySymbol={hotkeySymbol(hotkey)}
          currentUser={user}
          onNavigate={goToCommentRoute}
          onClose={() => setCommentsOn(false)}
          onResolve={handleResolve}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onReply={handleReply}
          onGroup={handleGroup}
          onMoveToGroup={handleMoveToGroup}
          onRenameGroup={handleRenameGroup}
          onUngroup={handleUngroup}
        />
      )}

      {usersOpen && user.isAdmin && <UsersPanel onClose={() => setUsersOpen(false)} />}

      {drawMode && (
        <div
          ref={drawPaletteFab.sizeRef}
          className="jynx-draw-palette jynx-chrome jynx-ui"
          style={{ right: drawPaletteFab.pos.right, bottom: drawPaletteFab.pos.bottom }}
          {...drawPaletteFab.dragHandlers}
          title={`Hold ${hotkeySymbol(hotkey)} and drag on the page to draw · release and drag again to add another stroke · Esc to finish and comment`}
        >
          {JYNX_DRAW_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={'jynx-draw-swatch' + (drawColor === c.value ? ' active' : '')}
              style={{ background: c.value }}
              onClick={() => {
                setDrawColor(c.value);
                try { localStorage.setItem(DRAW_COLOR_KEY, c.value); } catch { /* אחסון חסום */ }
              }}
              title={c.name}
            />
          ))}
        </div>
      )}
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
            <GreetingMenu user={user} shortcuts={shortcuts} hotkeySymbol={hotkeySymbol(hotkey)} onLogout={logout} />
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
