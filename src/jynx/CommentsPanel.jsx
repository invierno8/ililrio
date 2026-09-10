import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Search, CheckCircle2, Pencil, Trash2, CornerDownRight, ChevronDown, ChevronRight, Sparkles, Filter, Users } from 'lucide-react';
import { elementForComment } from './useHoverTarget.js';
import { sameScreen, screenOf, personaOf } from './route.js';
import JynxSuggestionBadge, { isJynxAuthor } from './JynxSuggestionBadge.jsx';
import { sectionsFor, ARRANGEMENTS, NEW_GROUP_NAME, AUTO_JYNX_GROUP } from './grouping.js';
import DrawingOverlay from './DrawingOverlay.jsx';

/* ==================================================================
   פאנל ההערות. התוכן והפילטרים הם של commando (overlay/CommentsPanel.jsx)
   — פתוח/טופל, רק שלי, המסך הזה מול הכול, וחיפוש חופשי; ריחוף על פריט
   מדליק הילה על האלמנט שעליו נכתב, וקליק קופץ אליו.

   מה ששונה מהמקור, לבקשה מפורשת: זה מגירה מעוגנת לצד המסך ולא כרטיס צף
   וגריר. המגירה גם דוחפת את הדמו הצידה (ראו body.jynx-side-open ב-
   theme.css) במקום לכסות אותו, כך ששום דבר באתר לא מוסתר בזמן שהיא פתוחה.
   ================================================================== */

const ARRANGE_KEY = 'jynx-comments-arrange';

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
  // סינון לקבוצה או לכותב — תמיד מבקשה מפורשת (אייקון המשפך או שם הכותב),
  // אף פעם לא מלחיצה על כותרת קבוצה: קליק על כותרת פותח וסוגר, וזה הכול.
  const [focus, setFocus] = useState(null); // { kind: 'group'|'author', id, label }
  // איך מסודרת הרשימה: none / groups / user. נשמר, כי זו העדפת קריאה.
  const [arrange, setArrange] = useState(() => {
    try { return localStorage.getItem(ARRANGE_KEY) || 'groups'; } catch { return 'groups'; }
  });
  const [collapsed, setCollapsed] = useState({});
  const [dragId, setDragId] = useState(null);
  // גם ref וגם state: ה-state צובע את השורה, אבל dragover חייב להחליט אם
  // לאפשר שחרור באותו רגע — ועדכון state עדיין לא הוחל אז. בלי ה-ref
  // preventDefault לא נקרא, הדפדפן מסרב לשחרור, ואירוע drop כלל לא נורה.
  const dragIdRef = useRef(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [renamingGroup, setRenamingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    try { localStorage.setItem(ARRANGE_KEY, arrange); } catch { /* אחסון חסום */ }
  }, [arrange]);

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

  const { sections, loose } = useMemo(() => sectionsFor(shown, groups, arrange), [shown, groups, arrange]);

  /**
   * גרירת הערה על אחרת יוצרת קבוצה; על כותרת קבוצה מצרפת אליה. קבוצה חדשה
   * נולדת עם שם זמני ועם התיבה פתוחה והטקסט מסומן — כי כל הנקודה היא לתת לה
   * שם, ולא לחפש אחר כך איפה משנים אותו. אם הרשימה הייתה מסודרת אחרת,
   * המתג עובר ל"קבוצות", אחרת הקבוצה שזה עתה נוצרה לא הייתה נראית בכלל.
   */
  const handleDropOnComment = async (target, sourceId) => {
    const source = comments.find((c) => c.id === (sourceId || dragIdRef.current));
    dragIdRef.current = null;
    setDragId(null);
    setDropTarget(null);
    if (!source || source.id === target.id) return;
    const targetGroup = target.groupId;
    if (targetGroup) {
      onMoveToGroup(source, targetGroup);
      setArrange('groups');
      return;
    }
    const group = await onGroup(NEW_GROUP_NAME, [target.id, source.id]);
    setArrange('groups');
    if (group) {
      setCollapsed((c) => ({ ...c, [group.id]: false }));
      setRenamingGroup(group.id);
      setGroupName(group.name);
    }
  };

  const handleDropOnGroup = (groupId, sourceId) => {
    const source = comments.find((c) => c.id === (sourceId || dragIdRef.current));
    dragIdRef.current = null;
    setDragId(null);
    setDropTarget(null);
    if (!source || groupId === AUTO_JYNX_GROUP) return;
    onMoveToGroup(source, groupId);
    setArrange('groups');
  };

  const commitRename = (id) => {
    const name = groupName.trim();
    if (name) onRenameGroup(id, name);
    setRenamingGroup(null);
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

        {/* איך לסדר את הרשימה. מתג גלוי, כי הסידור שייך למי שקורא: "קבוצות"
            הוא מה שהמשתמש בנה בעצמו, "משתמש" מסדר לפי מי שכתב, ו"ללא" מחזיר
            לרשימה אחת. כיבוי אינו מוחק דבר — הקבוצות ממתינות במקומן. */}
        <div className="comments-sidebar-filters comments-arrange-row">
          <span className="comments-arrange-label">Group by</span>
          <div className="pill-tabs">
            {ARRANGEMENTS.map((a) => (
              <button
                key={a.id} type="button"
                className={'pill-tab' + (arrange === a.id ? ' active' : '')}
                onClick={() => setArrange(a.id)}
                title={a.id === 'groups' ? 'Your own groups — drag one comment onto another to make one'
                  : a.id === 'user' ? 'A section per person who commented'
                  : 'One flat list, newest first'}
              >
                {a.id === 'user' && <Users size={10} />}
                {a.label}
              </button>
            ))}
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
              <Filter size={10} />
              Only {focus.kind === 'author' ? `${focus.label}'s comments` : focus.label}
            </span>
            <button type="button" className="comments-focus-clear" onClick={() => setFocus(null)}>
              Show all
            </button>
          </div>
        )}

        <div className="comments-sidebar-list">
          {sections.map((section) => (
            <div
              key={section.id}
              className={'comments-group' + (dropTarget === section.id ? ' comments-group-drop' : '')}
              onDragOver={(e) => {
                if (section.kind !== 'manual' || !dragIdRef.current) return;
                e.preventDefault();
                setDropTarget(section.id);
              }}
              onDragLeave={() => setDropTarget((t) => (t === section.id ? null : t))}
              onDrop={(e) => { e.preventDefault(); handleDropOnGroup(section.id, e.dataTransfer.getData('text/plain')); }}
            >
              <div className="comments-group-head">
                {renamingGroup === section.id ? (
                  <input
                    className="comments-group-rename" autoFocus value={groupName}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setGroupName(e.target.value)}
                    onBlur={() => { commitRename(section.id); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(section.id);
                      if (e.key === 'Escape') setRenamingGroup(null);
                    }}
                  />
                ) : (
                  // הכותרת כולה פותחת וסוגרת. קודם היא סיננה, וקליק תמים
                  // העלים את כל שאר ההערות בלי שיהיה ברור מה קרה.
                  <button
                    type="button"
                    className={'comments-group-name' + (section.kind === 'auto' ? ' comments-group-name-auto' : '')}
                    onClick={() => setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))}
                    title={collapsed[section.id] ? 'Open this group' : 'Close this group'}
                  >
                    {collapsed[section.id] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    {section.kind === 'auto' && <Sparkles size={10} />}
                    {section.kind === 'user' && <Users size={10} />}
                    <span className="comments-group-name-text">{section.name}</span>
                  </button>
                )}

                <span className="comments-group-count">{section.items.length}</span>

                <button
                  type="button" className="comments-group-action"
                  title={`Show only ${section.name}`}
                  onClick={() => setFocus(section.kind === 'user'
                    ? { kind: 'author', id: section.author, label: section.author }
                    : { kind: 'group', id: section.id, label: section.name })}
                >
                  <Filter size={10} />
                </button>

                {section.kind === 'manual' && (
                  <>
                    <button type="button" className="comments-group-action" title="Rename this group"
                      onClick={() => { setRenamingGroup(section.id); setGroupName(section.name); }}>
                      <Pencil size={10} />
                    </button>
                    <button type="button" className="comments-group-action" title="Take the group apart — the comments stay"
                      onClick={() => onUngroup(section.id)}>
                      <X size={10} />
                    </button>
                  </>
                )}
              </div>

              {!collapsed[section.id] && section.items.map((a) => renderComment(a, { inAutoGroup: section.kind === 'auto' }))}
            </div>
          ))}

          {loose.map((a) => renderComment(a))}
        </div>
      </div>
    </>,
    document.body,
  );

  /** שורת הערה אחת — משמשת גם בתוך קבוצה וגם מחוצה לה. */
  function renderComment(a, { inAutoGroup = false } = {}) {
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
                    {isJynxAuthor(a) && !inAutoGroup && <JynxSuggestionBadge />}
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
