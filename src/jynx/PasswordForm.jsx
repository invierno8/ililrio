import React, { useState } from 'react';
import { changePassword } from './devApi.js';

/**
 * החלפת סיסמה. אותו טופס משרת שני מצבים: משתמש שמחליף את שלו ומאשר בסיסמה
 * הנוכחית, ומנהל שמחליף למישהו אחר ואינו צריך לדעת אותה.
 *
 * הסיסמה היא הזהות שנכנסים איתה, ולכן השרת דוחה סיסמה שכבר שייכת למישהו —
 * שני אנשים עם אותה סיסמה היו נכנסים לאותו חשבון. השגיאה מוצגת כאן כמו שהיא.
 */
export default function PasswordForm({ user, asAdmin, onDone }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit() {
    if (!newPassword.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      await changePassword(user.id, { currentPassword, newPassword: newPassword.trim() });
      setDone(true);
      setCurrentPassword('');
      setNewPassword('');
      if (onDone) onDone();
      setTimeout(() => setDone(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="jynx-pw-form">
      <span className="jynx-pw-note">
        {asAdmin ? `Set a new password for ${user.name}` : 'Change your password'}
      </span>
      {!asAdmin && (
        <input
          type="password" placeholder="Current password" value={currentPassword}
          onChange={(e) => { setCurrentPassword(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
      )}
      <input
        type="password" placeholder="New password" value={newPassword}
        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <span className="jynx-pw-note">
        The password is how Jynx knows who you are, so no two people can share one.
      </span>
      {error && <span className="dev-login-error">{error}</span>}
      {done && <span className="jynx-pw-ok">Password changed.</span>}
      <div className="comments-edit-actions">
        <button type="button" className="primary" onClick={submit} disabled={!newPassword.trim() || busy}>
          {busy ? '...' : 'Save password'}
        </button>
      </div>
    </div>
  );
}
