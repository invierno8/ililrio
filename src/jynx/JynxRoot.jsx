import React, { useEffect, useMemo, useState } from 'react';
import { useRio } from '../store/index.js';
import { useIsNarrow } from '../components/DesktopOnly.jsx';
import { useJynx, jynx, newId } from './store.js';
import { isShared } from './api.js';
import JynxFab from './JynxFab.jsx';
import SignIn from './SignIn.jsx';
import CommentsPanel from './CommentsPanel.jsx';
import { CommentMode, CommentMarkers } from './CommentLayer.jsx';
import './jynx.css';

/**
 * Jynx מעל RIO: בועה צפה, מצב הערה, סימונים על המסך וחוט משותף. היא לא נוגעת
 * במצב של RIO — רק קוראת ממנו באיזה מסך אנחנו, כדי שכל הערה תדע איפה נאמרה.
 */

const SCREEN_LABELS = {
  catalog: 'קטלוג',
  'item-detail': 'מסך פריט',
  'my-follows': 'המעקבים שלי',
  notifications: 'מרכז התראות',
  'my-items': 'הפריטים שלי',
  'add-item': 'הוספת פריטים',
  'my-tasks': 'המשימות שלי',
  users: 'משתמשים',
  'approvers-group': 'קבוצת המאשרים',
  'p4-user-detail': 'כרטיס משתמש',
  'role-transfer': 'העברת תפקיד',
  'managed-lists': 'רשימות מנוהלות',
  'activity-log': 'יומן פעולות',
  'entry-gate': 'שער הכניסה',
};

export default function JynxRoot() {
  const { state } = useRio();
  const isNarrow = useIsNarrow();
  const { comments, user, status, error } = useJynx();

  const [commentMode, setCommentMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [markersOn, setMarkersOn] = useState(true);
  const [focusId, setFocusId] = useState(null);
  const [mood, setMood] = useState('idle');
  const [flash, setFlash] = useState('');

  const route = `${state.currentPersona}:${state.activeScreenId}`;
  const routeLabel = `${SCREEN_LABELS[state.activeScreenId] || state.activeScreenId} · ${state.currentPersona}`;

  const routeComments = useMemo(() => comments.filter((c) => c.route === route), [comments, route]);

  // מצב הפנים: מתעוררת בהתחברות, חושבת כשמסנכרנים, מודיעה על תקלה.
  useEffect(() => {
    if (status === 'error') { setMood('error'); return undefined; }
    if (status === 'connecting' && user) { setMood('thinking'); return undefined; }
    if (flash) {
      setMood('success');
      const t = setTimeout(() => { setFlash(''); setMood('idle'); }, 2200);
      return () => clearTimeout(t);
    }
    setMood('idle');
    return undefined;
  }, [status, user, flash]);

  // קיצור: J מדליק ומכבה את מצב ההערה, Escape מכבה.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if (typing) return;
      if (e.key === 'Escape' && commentMode) setCommentMode(false);
      if ((e.key === 'j' || e.key === 'J') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!user) { setSignInOpen(true); return; }
        setCommentMode((on) => !on);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commentMode, user]);

  const requireUser = (then) => {
    if (!user) { setSignInOpen(true); return; }
    then();
  };

  const submitComment = ({ body, anchor }) => {
    jynx.add({
      id: newId(),
      createdAt: new Date().toISOString(),
      author: user,
      route,
      anchor,
      body,
      resolved: false,
      replies: [],
    });
    setFlash(user.name);
  };

  // במסך צר מוצגת הודעת "מחשב בלבד" במקום האפליקציה, ואין על מה להעיר.
  if (isNarrow) return null;

  return (
    <div className="jynx-root">
      <CommentMode
        active={commentMode && !!user}
        onSubmit={submitComment}
        onTyping={() => setMood('typing')}
      />

      {markersOn && !panelOpen && (
        <CommentMarkers
          comments={routeComments}
          onOpen={(c) => { setFocusId(c.id); setPanelOpen(true); }}
        />
      )}

      {panelOpen && (
        <CommentsPanel
          comments={comments}
          user={user}
          route={route}
          routeLabel={routeLabel}
          focusId={focusId}
          onFocus={setFocusId}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {signInOpen && (
        <SignIn
          anchor={{ right: 16, bottom: 76 }}
          error={error}
          onCancel={() => setSignInOpen(false)}
          onSubmit={async (name, password) => {
            setMood('waking');
            const res = await jynx.login(name, password);
            if (res.ok) { setSignInOpen(false); setFlash(name); }
            else setMood('error');
          }}
        />
      )}

      <JynxFab
        mood={mood}
        welcomeName={flash}
        errorText={error}
        onClick={() => (user ? setToolbarOpen((v) => !v) : setSignInOpen(true))}
      >
        {(at) => toolbarOpen && user && (
          <div className="jynx-toolbar" style={{ right: at.right, bottom: at.bottom }}>
            <button
              type="button"
              className={'jynx-tool' + (commentMode ? ' jynx-tool-on' : '')}
              onClick={() => requireUser(() => setCommentMode((v) => !v))}
              title="לחצו על משהו במסך כדי להעיר עליו (⌘J)"
            >
              {commentMode ? 'מצב הערה פעיל' : 'השאר הערה'}
            </button>
            <button
              type="button"
              className={'jynx-tool' + (panelOpen ? ' jynx-tool-on' : '')}
              onClick={() => setPanelOpen((v) => !v)}
            >
              החוט
              <span className="jynx-tool-count">{comments.filter((c) => !c.resolved).length}</span>
            </button>
            <button
              type="button"
              className={'jynx-tool' + (markersOn ? ' jynx-tool-on' : '')}
              onClick={() => setMarkersOn((v) => !v)}
            >
              סימונים
            </button>
            <span className={'jynx-status jynx-status-' + (status === 'shared' ? 'shared' : status === 'error' ? 'error' : 'local')}>
              <span className="jynx-status-dot" />
              {status === 'shared' ? 'משותף' : status === 'error' ? 'לא נשמר' : isShared ? 'מתחבר' : 'מקומי'}
            </span>
            <button type="button" className="jynx-tool" onClick={() => { jynx.logout(); setToolbarOpen(false); setCommentMode(false); }}>
              {user.name} · יציאה
            </button>
          </div>
        )}
      </JynxFab>
    </div>
  );
}
