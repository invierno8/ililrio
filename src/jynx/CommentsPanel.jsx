import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Search, CheckCircle2, Pencil, Trash2, CornerDownRight, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { elementForComment } from './useHoverTarget.js';
import { sameScreen, screenOf, personaOf } from './route.js';
import JynxSuggestionBadge, { isJynxAuthor } from './JynxSuggestionBadge.jsx';
import { sectionsFor, defaultGroupName, AUTO_JYNX_GROUP } from './grouping.js';
import DrawingOverlay from './DrawingOverlay.jsx';

/* ==================================================================
   פאנל ההערות. התוכן והפילטרים הם של commando (overlay/CommentsPanel.jsx)
   — פתוח/טופל, רק שלי, המסך הזה מול הכול, וחיפוש חופשי; ריחוף על פריט
   מדליק הילה על האלמנט שעליו נכתב, וקליק קופץ אליו.

   מה ששונה מהמקור, לבקשה מפורשת: זה מגירה מעוגנת לצד המסך ולא כרטיס צף
   וגריר. המגירה גם דוחפת את הדמו הצידה (ראו body.jynx-side-open ב-
   theme.css) במקום לכסות אותו, כך ששום דבר באתר לא מוסתר בזמן שהיא פתוחה.
   ================================================================== */

export default function CommentsPanel({ comments, groups = [], route, currentUser, hotkeySymbol = 'Ctrl', onNavigate, onClose, onResolve, onDelete, onEdit, onReply, onGroup, onUngroup, onRenameGroup, onMoveToGroup }) {
  const [statusFilter, setStatusFilter] = useState('open');
  // ברירת המחדל היא הכול, לא המסך הנוכחי: מי שנכנס אמור לראות מיד שיש חוט,
  // ולא מסך ריק רק מפני שההערות נכתבו במקום אחר.
  const [scope, setScope] = useState('all');
  const [mineOnly, setMineOnly] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  // סינון לקבוצה או לכותב, מהקלקה על כותרת קבוצה או על שם. null = הכול.
  const [focus, setFocus] = useState(null); // { kind: 'group'|'author', id, label }
  const [collapsed, setCollapsed] = useState({});
  const [dragId, setDragId] = useState(null);
  // גם ref וגם state: ה-state צובע את השורה, אבל dragover חייב להחליט אם
  // לאפשר שחרור באותו רגע — ועדכון state עדיין לא הוחל אז. בלי ה-ref
  // preventDefault לא נקרא, הדפדפן מסרב לשחרור, ואירוע drop כלל לא נורה.
  const dragIdRef = useRef(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [renamingGroup, setRenamingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');

  // כל עוד המגירה פתוחה, הדמו מצטמצם ברוחב שלה במקום להיות מכוסה.
  useEffect(() => {
    document.body.classList.add('jynx-side-open');
    return () => document.body.classList.remove('jynx-side-open');
  }, []);

  const keywordNeedle = keywordFilter.trim().toLowerCase();
  const shown = useMemo(() => {
    return comments
      .filter((a) => (statusFilter === 'open' ? !a.resolved : a.resolved))
      .filter((a) => (scope === 'page' ? sameScreen(a.route, route) : true))
      .filter((a) => (!mineOnly || (currentUser && a.authorId === currentUser.id)))
      .filter((a) => (!keywordNeedle
        || a.comment.toLowerCase().includes(keywordNeedle)
        || (a.targetLabel || '').toLowerCase().includes(keywordNeedle)
        || (a.authorName || '').toLowerCase().includes(keywordNeedle)))
      .filter((a) => {
        if (!focus) return true;
        if (focus.kind === 'author') return a.authorName === focus.id;
        return (a.groupId || (isJynxAuthor(a) ? AUTO_JYNX_GROUP : null)) === focus.id;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments, statusFilter, scope, mineOnly, keywordNeedle, route, currentUser, focus]);

  const { sections, loose } = useMemo(() => sectionsFor(shown, groups), [shown, groups]);

  /** גרירת הערה על אחרת יוצרת קבוצה; על כותרת קבוצה מצרפת אליה. */
  const handleDropOnComment = (target, sourceId) => {
    const source = comments.find((c) => c.id === (sourceId || dragIdRef.current));
    dragIdRef.current = null;
    setDragId(null);
    setDropTarget(null);
    if (!source || source.id === target.id) return;
    const targetGroup = target.groupId;
    if (targetGroup) {
      onMoveToGroup(source, targetGroup);
      return;
    }
    onGroup(defaultGroupName([target, source]), [target.id, source.id]);
  };

  const handleDropOnGroup = (groupId, sourceId) => {
    const source = comments.find((c) => c.id === (sourceId || dragIdRef.current));
    dragIdRef.current = null;
    setDragId(null);
    setDropTarget(null);
    if (!source || groupId === AUTO_JYNX_GROUP) return;
    onMoveToGroup(source, groupId);
  };

  const rectFor = (a) => {
    const el = elementForComment(a);
    return el && document.contains(el) ? el.getBoundingClientRect() : null;
  };

  /**
   * לוקח את המשתמש אל האלמנט שההערה נכתבה עליו — גם כשהוא במסך אחר: קודם
   * עוברים למסך (ולפרסונה) של ההערה, ואז ממתינים שהאלמנט יופיע. המעבר אינו
   * מיידי, כי המסך נטען עם שלד קצר, ולכן מנסים שוב כל 120ms במקום לגלול אל
   * מה שעדיין לא קיים ולהיכשל בשקט.
   */
  const flash = (a) => {
    setFlashId(a.id);
    setTimeout(() => setFlashId((f) => (f === a.id ? null : f)), 1600);
  };

  const jumpTo = (a) => {
    const here = elementForComment(a);
    if (here && document.contains(here) && sameScreen(a.route, route)) {
      here.scrollIntoView({ block: 'center', behavior: 'smooth' });
      flash(a);
      return;
    }
    if (onNavigate) onNavigate(a);
    let attempts = 24;
    const tick = () => {
      const el = elementForComment(a);
      if (el && document.contains(el)) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        flash(a);
        return;
      }
      attempts -= 1;
      if (attempts > 0) setTimeout(tick, 120);
    };
    setTimeout(tick, 160);
  };

  const byId = (id) => comments.find((a) => a.id === id);
  const hoveredRect = hoveredId ? rectFor(byId(hoveredId)) : null;
  const flashRect = flashId ? rectFor(byId(flashId)) : null;

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
            <button type="button" className={'pill-tab' + (scope === 'page' ? ' active' : '')} onClick={() => setScope('page')}>
              This screen ({comments.filter((a) => sameScreen(a.route, route)).length})
            </button>
            <button type="button" className={'pill-tab' + (scope === 'all' ? ' active' : '')} onClick={() => setScope('all')}>
              All screens ({comments.length})
            </button>
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

        {focus && (
          <div className="comments-focus-row">
            <span className="comments-focus-chip">
              {focus.kind === 'author' ? 'By ' : ''}{focus.label}
              <button type="button" onClick={() => setFocus(null)} title="Show everything again"><X size={11} /></button>
            </span>
          </div>
        )}

        <div className="comments-sidebar-list">
          {sections.map((section) => (
            <div
              key={section.id}
              className={'comments-group' + (dropTarget === section.id ? ' comments-group-drop' : '')}
              onDragOver={(e) => {
                if (section.auto || !dragIdRef.current) return;
                e.preventDefault();
                setDropTarget(section.id);
              }}
              onDragLeave={() => setDropTarget((t) => (t === section.id ? null : t))}
              onDrop={(e) => { e.preventDefault(); handleDropOnGroup(section.id, e.dataTransfer.getData('text/plain')); }}
            >
              <div className="comments-group-head">
                <button
                  type="button" className="comments-group-toggle"
                  onClick={() => setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))}
                  title={collapsed[section.id] ? 'Expand' : 'Collapse'}
                >
                  {collapsed[section.id] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </button>

                {renamingGroup === section.id ? (
                  <input
                    className="comments-group-rename" autoFocus value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    onBlur={() => { if (groupName.trim()) onRenameGroup(section.id, groupName.trim()); setRenamingGroup(null); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { if (groupName.trim()) onRenameGroup(section.id, groupName.trim()); setRenamingGroup(null); }
                      if (e.key === 'Escape') setRenamingGroup(null);
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className={'comments-group-name' + (section.auto ? ' comments-group-name-auto' : '')}
                    onClick={() => setFocus({ kind: 'group', id: section.id, label: section.name })}
                    title="Show only this group"
                  >
                    {section.auto && <Sparkles size={10} />}
                    {section.name}
                  </button>
                )}

                <span className="comments-group-count">{section.items.length}</span>

                {!section.auto && (
                  <>
                    <button type="button" className="comments-group-action" title="Rename group"
                      onClick={() => { setRenamingGroup(section.id); setGroupName(section.name); }}>
                      <Pencil size={10} />
                    </button>
                    <button type="button" className="comments-group-action" title="Ungroup — the comments stay"
                      onClick={() => onUngroup(section.id)}>
                      <X size={10} />
                    </button>
                  </>
                )}
              </div>

              {!collapsed[section.id] && section.items.map((a) => renderComment(a))}
            </div>
          ))}

          {loose.map((a) => renderComment(a))}
        </div>
      </div>
    </>,
    document.body,
  );

  /** שורת הערה אחת — משמשת גם בתוך קבוצה וגם מחוצה לה. */
  function renderComment(a) {
    const replies = a.replies || [];
    const mine = currentUser && a.authorId === currentUser.id;
    const canEdit = mine;
    const canDelete = mine || (currentUser && currentUser.isAdmin);
    const otherPage = scope === 'all' && a.route && !sameScreen(a.route, route);
    const isEditing = editingId === a.id;
    return (
      <div key={a.id} className="comments-sidebar-item-wrap">
                <div
                  className={'comments-sidebar-item'
                    + (otherPage ? ' comments-sidebar-item-other-page' : '')
                    + (dragId === a.id ? ' comments-sidebar-item-dragging' : '')
                    + (dropTarget === a.id ? ' comments-sidebar-item-drop' : '')}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', a.id);
                    dragIdRef.current = a.id;
                    setDragId(a.id);
                  }}
                  onDragEnd={() => { dragIdRef.current = null; setDragId(null); setDropTarget(null); }}
                  onDragOver={(e) => {
                    if (!dragIdRef.current || dragIdRef.current === a.id) return;
                    e.preventDefault();
                    setDropTarget(a.id);
                  }}
                  onDragLeave={() => setDropTarget((t) => (t === a.id ? null : t))}
                  onDrop={(e) => { e.preventDefault(); handleDropOnComment(a, e.dataTransfer.getData('text/plain')); }}
                  title="Drag onto another comment to group them"
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId((h) => (h === a.id ? null : h))}
                  onClick={() => !isEditing && jumpTo(a)}
                >
                  <span className="comments-sidebar-item-target">
                    {isJynxAuthor(a) && <JynxSuggestionBadge />}
                    {a.targetKind === 'text' && <span className="comments-kind-badge">text</span>}
                    {otherPage && <span className="comments-route-badge" title="On another screen — click to go there">{screenOf(a.route)}</span>}
                    {personaOf(a) && <span className="comments-route-badge" title="Written while viewing as this persona">{personaOf(a)}</span>}
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
                    <span
                      className="jynx-author-link" role="button" tabIndex={0}
                      title={`Show only what ${a.authorName} wrote`}
                      onClick={(e) => { e.stopPropagation(); setFocus({ kind: 'author', id: a.authorName, label: a.authorName }); }}
                    >
                      {a.authorName}
                    </span>
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
  }
}
