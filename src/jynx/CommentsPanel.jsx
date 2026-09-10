import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Search, CheckCircle2, Pencil, Trash2, CornerDownRight } from 'lucide-react';
import { elementForComment } from './useHoverTarget.js';
import DrawingOverlay from './DrawingOverlay.jsx';

/* ==================================================================
   פאנל ההערות. התוכן והפילטרים הם של commando (overlay/CommentsPanel.jsx)
   — פתוח/טופל, רק שלי, המסך הזה מול הכול, וחיפוש חופשי; ריחוף על פריט
   מדליק הילה על האלמנט שעליו נכתב, וקליק קופץ אליו.

   מה ששונה מהמקור, לבקשה מפורשת: זה מגירה מעוגנת לצד המסך ולא כרטיס צף
   וגריר. המגירה גם דוחפת את הדמו הצידה (ראו body.jynx-side-open ב-
   theme.css) במקום לכסות אותו, כך ששום דבר באתר לא מוסתר בזמן שהיא פתוחה.
   ================================================================== */

export default function CommentsPanel({ comments, route, currentUser, hotkeySymbol = 'Ctrl', onClose, onResolve, onDelete, onEdit, onReply }) {
  const [statusFilter, setStatusFilter] = useState('open');
  const [scope, setScope] = useState('page');
  const [mineOnly, setMineOnly] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // כל עוד המגירה פתוחה, הדמו מצטמצם ברוחב שלה במקום להיות מכוסה.
  useEffect(() => {
    document.body.classList.add('jynx-side-open');
    return () => document.body.classList.remove('jynx-side-open');
  }, []);

  const keywordNeedle = keywordFilter.trim().toLowerCase();
  const shown = useMemo(() => {
    return comments
      .filter((a) => (statusFilter === 'open' ? !a.resolved : a.resolved))
      .filter((a) => (scope === 'page' ? a.route === route : true))
      .filter((a) => (!mineOnly || (currentUser && a.authorId === currentUser.id)))
      .filter((a) => (!keywordNeedle
        || a.comment.toLowerCase().includes(keywordNeedle)
        || (a.targetLabel || '').toLowerCase().includes(keywordNeedle)
        || (a.authorName || '').toLowerCase().includes(keywordNeedle)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments, statusFilter, scope, mineOnly, keywordNeedle, route, currentUser]);

  const rectFor = (a) => {
    const el = elementForComment(a);
    return el && document.contains(el) ? el.getBoundingClientRect() : null;
  };

  const jumpTo = (a) => {
    const el = elementForComment(a);
    if (!el || !document.contains(el)) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFlashId(a.id);
    setTimeout(() => setFlashId((f) => (f === a.id ? null : f)), 1600);
  };

  const hoveredRect = hoveredId ? rectFor(shown.find((a) => a.id === hoveredId)) : null;
  const flashRect = flashId ? rectFor(shown.find((a) => a.id === flashId)) : null;

  return createPortal(
    <>
      {/* הילות על העמוד החי — עזר ריחוף בלבד, אף פעם לא יעד תקין להערה. */}
      <div className="dev-overlay-ignore jynx-ui">
        {hoveredRect && (
          <div className="comments-panel-highlight" style={{ top: hoveredRect.top, left: hoveredRect.left, width: hoveredRect.width, height: hoveredRect.height }} />
        )}
        {flashRect && (
          <div className="comments-panel-highlight comments-panel-flash" style={{ top: flashRect.top, left: flashRect.left, width: flashRect.width, height: flashRect.height }} />
        )}
      </div>

      <div className="comments-sidebar comments-sidebar-docked jynx-chrome jynx-ui" data-devblock="jynx-comments-panel">
        <div className="comments-sidebar-head">
          <span className="comments-sidebar-title"><MessageSquare size={13} /> Comments</span>
          <button type="button" className="comments-sidebar-collapse" onClick={onClose} title="Close">
            <X size={13} />
          </button>
        </div>

        <div className="comments-sidebar-filters">
          <div className="pill-tabs">
            <button type="button" className={'pill-tab' + (statusFilter === 'open' ? ' active' : '')} onClick={() => setStatusFilter('open')}>Open</button>
            <button type="button" className={'pill-tab' + (statusFilter === 'done' ? ' active' : '')} onClick={() => setStatusFilter('done')}>Done</button>
          </div>
          <button type="button" className={'comments-mine-toggle' + (mineOnly ? ' active' : '')} onClick={() => setMineOnly((v) => !v)}>Just me</button>
        </div>

        <div className="comments-sidebar-filters comments-sidebar-scope-row">
          <div className="pill-tabs">
            <button type="button" className={'pill-tab' + (scope === 'page' ? ' active' : '')} onClick={() => setScope('page')}>This screen</button>
            <button type="button" className={'pill-tab' + (scope === 'all' ? ' active' : '')} onClick={() => setScope('all')}>All screens</button>
          </div>
        </div>

        <div className="comments-sidebar-search-row">
          <div className="comments-sidebar-search-box">
            <Search size={12} />
            <input value={keywordFilter} placeholder="Filter by keyword..." onChange={(e) => setKeywordFilter(e.target.value)} />
            {keywordFilter && (
              <button type="button" onClick={() => setKeywordFilter('')} title="Clear keyword filter"><X size={12} /></button>
            )}
          </div>
        </div>

        {shown.length === 0 && (
          <div className="comments-sidebar-empty">
            No {statusFilter} comments {scope === 'all' ? 'anywhere' : 'on this screen'}
            {(keywordNeedle || mineOnly) ? ' matching these filters' : ''}.
            <br />
            Hold {hotkeySymbol} and click anything on the page to leave one.
          </div>
        )}

        <div className="comments-sidebar-list">
          {shown.map((a) => {
            const replies = a.replies || [];
            const mine = currentUser && a.authorId === currentUser.id;
            const canEdit = mine;
            const canDelete = mine || (currentUser && currentUser.isAdmin);
            const otherPage = scope === 'all' && a.route && a.route !== route;
            const isEditing = editingId === a.id;
            return (
              <div key={a.id} className="comments-sidebar-item-wrap">
                <div
                  className={'comments-sidebar-item' + (otherPage ? ' comments-sidebar-item-other-page' : '')}
                  onMouseEnter={() => !otherPage && setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId((h) => (h === a.id ? null : h))}
                  onClick={() => !isEditing && !otherPage && jumpTo(a)}
                >
                  <span className="comments-sidebar-item-target">
                    {a.targetKind === 'text' && <span className="comments-kind-badge">text</span>}
                    {otherPage && <span className="comments-route-badge">{a.route}</span>}
                    {a.targetLabel}
                    {a.resolved && <span className="comments-done-badge"><CheckCircle2 size={10} /> Done</span>}
                  </span>

                  {isEditing ? (
                    <div className="comments-edit-box" onClick={(e) => e.stopPropagation()}>
                      <textarea autoFocus rows={3} value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <div className="comments-edit-actions">
                        <button type="button" onClick={() => { setEditingId(null); setEditText(''); }}>Cancel</button>
                        <button
                          type="button" className="primary" disabled={!editText.trim()}
                          onClick={() => { onEdit(a, editText.trim()); setEditingId(null); setEditText(''); }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comments-sidebar-item-comment">
                      {a.comment}
                      {canEdit && (
                        <button
                          type="button" className="comments-edit-btn" title="Edit your comment"
                          onClick={(e) => { e.stopPropagation(); setEditingId(a.id); setEditText(a.comment); }}
                        >
                          <Pencil size={11} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button" className="comments-edit-btn comments-delete-self-btn" title="Delete this comment"
                          onClick={(e) => { e.stopPropagation(); onDelete(a); }}
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </p>
                  )}

                  {a.drawing && <span className="comments-drawing-badge">✏️ drawing — hover to see it on the page</span>}
                  {hoveredId === a.id && a.drawing && <DrawingOverlay drawing={a.drawing} />}
                  {replies.length > 0 && (
                    <div className="comments-reply-list">
                      {replies.map((r) => (
                        <div key={r.id} className="comments-reply">
                          <p className="comments-reply-body">{r.body}</p>
                          <span className="comments-reply-meta">{r.authorName} · {new Date(r.createdAt).toLocaleString('en-US')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="comments-sidebar-item-meta">
                    <span className="jynx-author-link">{a.authorName}</span>
                    {' · '}{new Date(a.createdAt).toLocaleString('en-US')}
                  </span>

                  {replyingId === a.id ? (
                    <div className="comments-edit-box" onClick={(e) => e.stopPropagation()}>
                      <textarea autoFocus rows={2} placeholder="Reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                      <div className="comments-edit-actions">
                        <button type="button" onClick={() => { setReplyingId(null); setReplyText(''); }}>Cancel</button>
                        <button
                          type="button" className="primary" disabled={!replyText.trim()}
                          onClick={() => { onReply(a, replyText.trim()); setReplyingId(null); setReplyText(''); }}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="comments-edit-actions" style={{ justifyContent: 'flex-start' }}>
                      <button type="button" className="comments-reply-btn" onClick={(e) => { e.stopPropagation(); setReplyingId(a.id); setReplyText(''); }}>
                        <CornerDownRight size={11} /> Reply
                      </button>
                      <button type="button" className="comments-reply-btn" onClick={(e) => { e.stopPropagation(); onResolve(a, !a.resolved); }}>
                        {a.resolved ? 'Reopen' : 'Mark done'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>,
    document.body,
  );
}
