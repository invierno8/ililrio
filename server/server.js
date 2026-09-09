import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { readJson, writeJson, githubEnabled } from './github.js';
import {
  login, requireUser, requireAdmin, isAdminName, userIdFor, hashPassword,
  ADMIN_NAMES, ADMIN_PASSWORDS_ARE_DEFAULT,
} from './auth.js';

/**
 * חוט ההערות המשותף של דמו RIO.
 *
 * מקור האמת הוא data/jynx-comments.json ברפו; כאן מחזיקים עותק בזיכרון כדי
 * שקריאות יהיו מיידיות, וכל שינוי נכתב לרפו מיד אחרי שהוא נכנס לעותק הזה.
 * הדיסק של Render חולף — אחרי הרדמה או פריסה מחדש הוא מתאפס — ולכן GitHub,
 * ולא הדיסק, הוא מה שמחזיק את ההערות.
 */

const COMMENTS_PATH = 'data/jynx-comments.json';
const USERS_PATH = 'data/jynx-users.json';
const PORT = process.env.PORT || 4100;

const app = express();
app.use(express.json({ limit: '256kb' }));

const allowed = (process.env.ALLOWED_ORIGINS || 'https://invierno8.github.io')
  .split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    // בלי origin = curl או בדיקה מקומית; מותר.
    if (!origin || allowed.some((a) => origin === a) || origin.startsWith('http://localhost')) return cb(null, true);
    return cb(new Error('origin not allowed'));
  },
}));

let comments = [];
let users = [];
let ready = false;

async function boot() {
  const doc = await readJson(COMMENTS_PATH, { version: 1, comments: [] });
  comments = Array.isArray(doc.comments) ? doc.comments : [];
  const roster = await readJson(USERS_PATH, { version: 1, users: [] });
  users = Array.isArray(roster.users) ? roster.users : [];
  ready = true;
  if (ADMIN_PASSWORDS_ARE_DEFAULT) console.warn('[jynx] admin passwords are the temporary defaults');
  console.log(`[jynx] ready · ${comments.length} comments · ${users.length} users · github ${githubEnabled() ? 'on' : 'OFF (in-memory only)'}`);
}

const saveComments = (message) => writeJson(COMMENTS_PATH, { version: 1, updatedAt: new Date().toISOString(), comments }, message);
const saveUsers = (message) => writeJson(USERS_PATH, { version: 1, updatedAt: new Date().toISOString(), users }, message);

/** רושם מתי מישהו נכנס לאחרונה, כדי שרשימת המעירים תשקף מי באמת פעיל. */
async function touchUser(user) {
  const known = users.find((u) => u.id === user.id);
  if (known) {
    known.name = user.name;
    known.lastSeen = new Date().toISOString();
  } else {
    users.push({
      id: user.id, name: user.name, isAdmin: user.isAdmin, addedBy: 'self',
      firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString(),
    });
  }
  try {
    await saveUsers(`jynx: ${user.name} signed in`);
  } catch (err) {
    console.error('[jynx] user save failed:', err.message);
  }
}

const canManage = (req, comment) => req.user.isAdmin || comment.authorId === req.user.id;
const publicUser = (u) => ({ id: u.id, name: u.name, isAdmin: !!u.isAdmin, firstSeen: u.firstSeen, lastSeen: u.lastSeen });

app.get('/api/jynx/health', (req, res) => {
  res.json({ ok: ready, github: githubEnabled(), comments: comments.length });
});

app.post('/api/jynx/login', async (req, res) => {
  const { name, password } = req.body || {};
  const result = login(name, password, users);
  if (result.error) return res.status(401).json({ error: result.error });
  await touchUser(result.user);
  return res.json(result);
});

app.get('/api/jynx/me', requireUser, (req, res) => res.json({ user: req.user }));

// ---- הערות -----------------------------------------------------------------

app.get('/api/jynx/comments', requireUser, (req, res) => {
  res.json({ comments, updatedAt: new Date().toISOString() });
});

app.post('/api/jynx/comments', requireUser, async (req, res) => {
  const { route, targetLabel, targetPath, comment, secondaryTargets } = req.body || {};
  if (!comment || !String(comment).trim()) return res.status(400).json({ error: 'Comment is empty' });

  const saved = {
    id: 'c-' + crypto.randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
    authorId: req.user.id,
    authorName: req.user.name,
    route: route || '',
    targetLabel: targetLabel || '',
    targetPath: targetPath || '',
    secondaryTargets: Array.isArray(secondaryTargets) ? secondaryTargets.slice(0, 10) : [],
    comment: String(comment).slice(0, 4000),
    resolved: false,
    replies: [],
  };
  comments.push(saved);
  try {
    await saveComments(`jynx: ${req.user.name} commented on ${saved.route || 'the demo'}`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
    return res.status(502).json({ error: 'Saved in memory but not to the repo' });
  }
  return res.status(201).json({ comment: saved });
});

app.patch('/api/jynx/comments/:id', requireUser, async (req, res) => {
  const found = comments.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Not found' });

  const { resolved, comment } = req.body || {};
  // סימון כטופל פתוח לכל מי שנכנס; שינוי הטקסט רק לכותב או למנהל.
  if (typeof resolved === 'boolean') found.resolved = resolved;
  if (typeof comment === 'string') {
    if (!canManage(req, found)) return res.status(403).json({ error: 'You can only edit your own comment' });
    found.comment = comment.slice(0, 4000);
    found.editedAt = new Date().toISOString();
  }

  try {
    await saveComments(`jynx: ${req.user.name} updated a comment`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
  }
  return res.json({ comment: found });
});

app.post('/api/jynx/comments/:id/replies', requireUser, async (req, res) => {
  const found = comments.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  const { body } = req.body || {};
  if (!body || !String(body).trim()) return res.status(400).json({ error: 'Reply is empty' });

  found.replies = [
    ...(found.replies || []),
    {
      id: 'r-' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date().toISOString(),
      authorId: req.user.id,
      authorName: req.user.name,
      body: String(body).slice(0, 4000),
    },
  ];
  try {
    await saveComments(`jynx: ${req.user.name} replied`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
  }
  return res.json({ comment: found });
});

app.delete('/api/jynx/comments/:id', requireUser, async (req, res) => {
  const found = comments.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  if (!canManage(req, found)) return res.status(403).json({ error: 'You can only delete your own comment' });
  comments = comments.filter((c) => c.id !== req.params.id);
  try {
    await saveComments(`jynx: ${req.user.name} deleted a comment`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
  }
  return res.status(204).end();
});

// ---- מעירים (מנהלים בלבד) ---------------------------------------------------

app.get('/api/jynx/users', requireUser, requireAdmin, (req, res) => {
  // המנהלים תמיד ברשימה, גם אם עוד לא נכנסו מהמכשיר הזה.
  const shown = [...users];
  ADMIN_NAMES.forEach((n) => {
    if (!shown.some((u) => u.id === userIdFor(n))) shown.push({ id: userIdFor(n), name: n, isAdmin: true });
  });
  res.json({ users: shown.map(publicUser) });
});

app.post('/api/jynx/users', requireUser, requireAdmin, async (req, res) => {
  const { name, password } = req.body || {};
  const clean = String(name || '').trim();
  if (!clean || !password) return res.status(400).json({ error: 'Name and password required' });
  if (isAdminName(clean)) return res.status(400).json({ error: 'That name is an admin already' });
  if (users.some((u) => u.name.trim().toLowerCase() === clean.toLowerCase())) {
    return res.status(409).json({ error: 'That commenter already exists' });
  }

  const { salt, hash } = hashPassword(password);
  const record = {
    id: userIdFor(clean), name: clean, isAdmin: false, salt, hash,
    addedBy: req.user.name, firstSeen: null, lastSeen: null,
  };
  users.push(record);
  try {
    await saveUsers(`jynx: ${req.user.name} added ${clean}`);
  } catch (err) {
    console.error('[jynx] user save failed:', err.message);
    return res.status(502).json({ error: 'Saved in memory but not to the repo' });
  }
  return res.status(201).json({ user: publicUser(record) });
});

app.delete('/api/jynx/users/:id', requireUser, requireAdmin, async (req, res) => {
  const target = users.find((u) => u.id === req.params.id);
  if (target && isAdminName(target.name)) return res.status(403).json({ error: 'Admins cannot be removed' });
  users = users.filter((u) => u.id !== req.params.id);
  try {
    await saveUsers(`jynx: ${req.user.name} removed a commenter`);
  } catch (err) {
    console.error('[jynx] user save failed:', err.message);
  }
  return res.status(204).end();
});

boot()
  .catch((err) => console.error('[jynx] boot failed:', err.message))
  .finally(() => app.listen(PORT, () => console.log(`[jynx] listening on ${PORT}`)));
