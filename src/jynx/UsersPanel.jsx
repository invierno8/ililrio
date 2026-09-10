import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, UserPlus, KeyRound } from 'lucide-react';
import { listUsers, createUser, deleteUser } from './devApi.js';
import PasswordForm from './PasswordForm.jsx';

/**
 * מי יכול להעיר. Tom ו-ilil הם מנהלים קבועים; כל שאר המעירים נוספים כאן,
 * וכל אחד מהם מקבל שם וסיסמה. מי שאינו ברשימה רואה את הבועה הנעולה בלבד.
 *
 * המקבילה ב-commando היא DevAdminUsersScreen.jsx שבתוך פאנל הניהול; כאן זה
 * חלון קטן ועצמאי, כי זה הדבר היחיד שנשאר מפאנל הניהול בגרסת ההערות.
 */
export default function UsersPanel({ onClose }) {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pwFor, setPwFor] = useState(null);

  const load = () => listUsers().then(setUsers).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim() || !password.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      await createUser(name.trim(), password.trim());
      setName('');
      setPassword('');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(u) {
    setError('');
    try {
      await deleteUser(u.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return createPortal(
    <div className="comments-sidebar jynx-chrome jynx-ui jynx-users-panel" data-devblock="jynx-users-panel">
      <div className="comments-sidebar-head">
        <span className="comments-sidebar-title"><UserPlus size={13} /> Who can comment</span>
        <button type="button" className="comments-sidebar-collapse" onClick={onClose} title="Close"><X size={13} /></button>
      </div>

      <div className="comments-sidebar-search-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
        <div className="comments-sidebar-search-box">
          <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        </div>
        <div className="comments-sidebar-search-box">
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        </div>
        <div className="comments-edit-actions">
          <button type="button" className="primary" onClick={add} disabled={!name.trim() || !password.trim() || busy}>
            {busy ? '...' : 'Add commenter'}
          </button>
        </div>
        {error && <div className="dev-login-error">{error}</div>}
      </div>

      <div className="comments-sidebar-list">
        {users.length === 0 && <div className="comments-sidebar-empty">Only the two admins so far.</div>}
        {users.map((u) => (
          <div key={u.id} className="comments-sidebar-item" style={{ cursor: 'default' }}>
            <span className="comments-sidebar-item-target">
              {u.name}
              {u.isAdmin && <span className="comments-route-badge">admin</span>}
            </span>
            <span className="comments-sidebar-item-meta">
              {u.lastSeen ? `last seen ${new Date(u.lastSeen).toLocaleDateString('en-US')}` : 'never signed in'}
            </span>
            <div className="comments-edit-actions" style={{ justifyContent: 'flex-start' }}>
              <button type="button" onClick={() => setPwFor((cur) => (cur === u.id ? null : u.id))}>
                <KeyRound size={11} /> Password
              </button>
              {!u.isAdmin && (
                <button type="button" onClick={() => remove(u)}><Trash2 size={11} /> Remove</button>
              )}
            </div>
            {pwFor === u.id && <PasswordForm user={u} asAdmin onDone={() => setPwFor(null)} />}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
