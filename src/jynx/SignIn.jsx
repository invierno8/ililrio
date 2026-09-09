import React, { useEffect, useRef, useState } from 'react';
import { isShared } from './api.js';
import { ADMIN_NAMES } from './roles.js';

/**
 * הכניסה ל-Jynx. שם, וסיסמה אם צריך. Tom ו-ilil הם מנהלים — הם רואים ומוחקים
 * הכול; כל שאר המעירים מגיבים ומנהלים את ההערות שהם עצמם השאירו.
 */
export default function SignIn({ anchor, onSubmit, onCancel, error }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { if (nameRef.current) nameRef.current.focus(); }, []);

  const isAdminName = ADMIN_NAMES.includes(name.trim().toLowerCase());
  // בשירות המשותף תמיד מציגים שדה סיסמה: למנהלים הוא חובה, ולמעירים הוא
  // נדרש רק אם הוגדרה סיסמה בשירות — והדפדפן אינו יודע מה הוגדר שם.
  const needsPassword = isShared;

  const submit = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    await onSubmit(name.trim(), password);
    setBusy(false);
  };

  return (
    <div className="jynx-card" style={anchor}>
      <div className="jynx-card-title">מי מעיר?</div>
      <div className="jynx-card-sub">
        {isShared
          ? 'ההערות משותפות לכולם ונשמרות ברפו. השם מופיע לצד כל הערה שתשאירו.'
          : 'שירות ההערות עדיין לא מחובר, ולכן ההערות יישמרו רק בדפדפן הזה.'}
      </div>
      <input
        ref={nameRef}
        className="jynx-input"
        placeholder="השם שלך"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      {needsPassword && (
        <input
          className="jynx-input"
          type="password"
          placeholder={isAdminName ? 'סיסמת מנהל' : 'סיסמה'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        />
      )}
      {isAdminName && <div className="jynx-card-sub">נכנס כמנהל.</div>}
      {error && <div className="jynx-card-sub" style={{ color: 'var(--jynx-red)' }}>{error}</div>}
      <div className="jynx-card-row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="jynx-btn jynx-btn-ghost" onClick={onCancel}>ביטול</button>
        <button type="button" className="jynx-btn jynx-btn-primary" onClick={submit} disabled={!name.trim() || busy}>
          {busy ? '…' : 'כניסה'}
        </button>
      </div>
    </div>
  );
}
