import React, { useMemo, useState } from 'react';
import { jynx, newId } from './store.js';
import { initials, timeAgo } from './roles.js';
import { resolveAnchor } from './anchor.js';

/**
 * החוט המשותף. שתי לשוניות: מה שנאמר על המסך הנוכחי, והכול. מנהל יכול לסמן
 * ולמחוק כל הערה; מעיר רגיל — רק את שלו. אין כאן תור פעולות, רק שיחה.
 */
export default function CommentsPanel({ comments, user, route, routeLabel, focusId, onClose, onFocus }) {
  const [tab, setTab] = useState('screen');
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState('');

  const shown = useMemo(() => {
    const list = tab === 'screen' ? comments.filter((c) => c.route === route) : comments;
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments, tab, route]);

  const openCount = comments.filter((c) => !c.resolved).length;

  const sendReply = (id) => {
    const body = replyText.trim();
    if (!body) return;
    jynx.addReply(id, { id: newId('r'), createdAt: new Date().toISOString(), author: user, body });
    setReplyText('');
    setReplyOpen(null);
  };

  const jumpTo = (comment) => {
    const el = resolveAnchor(comment.anchor);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (onFocus) onFocus(comment.id);
  };

  return (
    <aside className="jynx-panel">
      <div className="jynx-panel-head">
        <span className="jynx-logo">JYNX</span>
        <span className="jynx-comment-meta">{openCount} פתוחות</span>
        <button type="button" className="jynx-btn jynx-btn-ghost" style={{ marginInlineStart: 'auto' }} onClick={onClose}>סגור</button>
      </div>

      <div className="jynx-panel-tabs">
        <button type="button" className={'jynx-tool' + (tab === 'screen' ? ' jynx-tool-on' : '')} onClick={() => setTab('screen')}>
          המסך הזה
          <span className="jynx-tool-count">{comments.filter((c) => c.route === route).length}</span>
        </button>
        <button type="button" className={'jynx-tool' + (tab === 'all' ? ' jynx-tool-on' : '')} onClick={() => setTab('all')}>
          הכול
          <span className="jynx-tool-count">{comments.length}</span>
        </button>
      </div>

      <div className="jynx-panel-body">
        {tab === 'screen' && <div className="jynx-comment-meta">{routeLabel}</div>}

        {shown.length === 0 && (
          <div className="jynx-panel-empty">
            {tab === 'screen' ? 'אין עדיין הערות על המסך הזה.' : 'אין עדיין הערות.'}
            <br />
            הדליקו את מצב ההערה ולחצו על משהו במסך.
          </div>
        )}

        {shown.map((c) => {
          const mine = user && c.author && c.author.id === user.id;
          const canManage = mine || (user && user.isAdmin);
          return (
            <div key={c.id} className={'jynx-comment' + (c.resolved ? ' jynx-comment-resolved' : '')} style={focusId === c.id ? { borderColor: 'var(--jynx)' } : undefined}>
              <div className="jynx-comment-head">
                <span className="jynx-avatar">{initials(c.author && c.author.name)}</span>
                <span className="jynx-comment-author">{c.author && c.author.name}</span>
                {c.author && c.author.isAdmin && <span className="jynx-comment-meta">מנהל</span>}
                <span className="jynx-comment-meta" style={{ marginInlineStart: 'auto' }}>{timeAgo(c.createdAt)}</span>
              </div>

              <button type="button" className="jynx-target-chip" onClick={() => jumpTo(c)} title="קפוץ למקום שבו נכתבה">
                ◎ {c.anchor ? c.anchor.label : 'המסך'}
              </button>

              <div className="jynx-comment-body">{c.body}</div>

              {(c.replies || []).map((r) => (
                <div key={r.id} className="jynx-reply">
                  <div className="jynx-comment-head">
                    <span className="jynx-comment-author">{r.author && r.author.name}</span>
                    <span className="jynx-comment-meta">{timeAgo(r.createdAt)}</span>
                  </div>
                  <div className="jynx-comment-body">{r.body}</div>
                </div>
              ))}

              {replyOpen === c.id ? (
                <>
                  <textarea
                    className="jynx-textarea"
                    style={{ minHeight: '54px' }}
                    autoFocus
                    placeholder="תגובה…"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(c.id); } }}
                  />
                  <div className="jynx-comment-actions" style={{ justifyContent: 'flex-end' }}>
                    <button type="button" className="jynx-btn jynx-btn-ghost" onClick={() => { setReplyOpen(null); setReplyText(''); }}>ביטול</button>
                    <button type="button" className="jynx-btn jynx-btn-primary" onClick={() => sendReply(c.id)} disabled={!replyText.trim()}>שלח</button>
                  </div>
                </>
              ) : (
                <div className="jynx-comment-actions">
                  <button type="button" className="jynx-btn jynx-btn-ghost" onClick={() => { setReplyOpen(c.id); setReplyText(''); }}>תגובה</button>
                  <button type="button" className="jynx-btn jynx-btn-ghost" onClick={() => jynx.setResolved(c.id, !c.resolved)}>
                    {c.resolved ? 'פתח מחדש' : 'סמן כטופל'}
                  </button>
                  {canManage && (
                    <button type="button" className="jynx-btn jynx-btn-ghost jynx-btn-danger" onClick={() => jynx.remove(c.id)}>מחק</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
