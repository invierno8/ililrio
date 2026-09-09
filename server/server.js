import express from 'express';
import cors from 'cors';
import { readJson, writeJson, githubEnabled } from './github.js';
import { login, requireUser, requireAdmin, isAdminName, ADMIN_PASSWORDS_ARE_DEFAULT } from './auth.js';

/**
 * חוט ההערות המשותף של דמו RIO.
 *
 * מקור האמת הוא data/jynx-comments.json ברפו; כאן מחזיקים עותק בזיכרון כדי
 * שקריאות יהיו מיידיות, וכל שינוי נכתב לרפו מיד אחרי שהוא נכנס לעותק הזה.
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
    if (!origin || allowed.some((a) => origin === a || origin.startsWith('http://localhost'))) return cb(null, true);
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
  if (ADMIN_PASSWORDS_ARE_DEFAULT) console.warn('[jynx] סיסמאות המנהלים הן ברירת המחדל הזמנית');
  console.log(`[jynx] ready · ${comments.length} comments · ${users.length} users · github ${githubEnabled() ? 'on' : 'OFF (in-memory only)'}`);
}

async function saveComments(message) {
  await writeJson(COMMENTS_PATH, { version: 1, updatedAt: new Date().toISOString(), comments }, message);
}

/** רושם מעיר שנכנס, כדי שרשימת המשתמשים תשקף מי באמת השאיר הערות. */
async function rememberUser(user) {
  const known = users.find((u) => u.id === user.id);
  if (known) {
    known.name = user.name;
    known.isAdmin = user.isAdmin;
    known.lastSeen = new Date().toISOString();
  } else {
    users.push({ ...user, firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString() });
  }
  try {
    await writeJson(USERS_PATH, { version: 1, users }, `jynx: ${user.name} signed in`);
  } catch (err) {
    console.error('[jynx] user save failed:', err.message);
  }
}

const canEdit = (req, comment) => req.user.isAdmin || comment.author.id === req.user.id;

app.get('/api/jynx/health', (req, res) => {
  res.json({ ok: ready, github: githubEnabled(), comments: comments.length });
});

app.post('/api/jynx/login', async (req, res) => {
  const { name, password } = req.body || {};
  const result = login(name, password);
  if (result.error) return res.status(401).json({ error: result.error });
  await rememberUser(result.user);
  return res.json(result);
});

app.get('/api/jynx/me', requireUser, (req, res) => res.json({ user: req.user }));

app.get('/api/jynx/comments', requireUser, (req, res) => {
  res.json({ comments, updatedAt: new Date().toISOString() });
});

app.post('/api/jynx/comments', requireUser, async (req, res) => {
  const { id, route, anchor, body } = req.body || {};
  if (!id || !body || !String(body).trim()) return res.status(400).json({ error: 'חסר תוכן' });
  if (comments.some((c) => c.id === id)) return res.status(409).json({ error: 'הערה כזו כבר קיימת' });

  const comment = {
    id,
    createdAt: new Date().toISOString(),
    author: req.user,
    route: route || '',
    anchor: anchor || null,
    body: String(body).slice(0, 4000),
    resolved: false,
    replies: [],
  };
  comments.push(comment);
  try {
    await saveComments(`jynx: ${req.user.name} commented on ${comment.route || 'the demo'}`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
    return res.status(502).json({ error: 'ההערה נשמרה בזיכרון אך לא הגיעה לרפו' });
  }
  return res.status(201).json({ comment });
});

app.patch('/api/jynx/comments/:id', requireUser, async (req, res) => {
  const comment = comments.find((c) => c.id === req.params.id);
  if (!comment) return res.status(404).json({ error: 'לא נמצאה' });

  const { resolved, body, replies } = req.body || {};

  // תגובה חדשה מותרת לכל מי שנכנס; שינוי הגוף רק לבעלים או למנהל.
  if (Array.isArray(replies)) {
    const known = new Set((comment.replies || []).map((r) => r.id));
    const added = replies.filter((r) => r && r.id && !known.has(r.id));
    comment.replies = [
      ...(comment.replies || []),
      ...added.map((r) => ({
        id: r.id,
        createdAt: new Date().toISOString(),
        author: req.user,
        body: String(r.body || '').slice(0, 4000),
      })),
    ];
  }
  if (typeof resolved === 'boolean') comment.resolved = resolved;
  if (typeof body === 'string') {
    if (!canEdit(req, comment)) return res.status(403).json({ error: 'אפשר לערוך רק הערה שלך' });
    comment.body = body.slice(0, 4000);
  }

  try {
    await saveComments(`jynx: ${req.user.name} updated a comment`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
  }
  return res.json({ comment });
});

app.delete('/api/jynx/comments/:id', requireUser, async (req, res) => {
  const comment = comments.find((c) => c.id === req.params.id);
  if (!comment) return res.status(404).json({ error: 'לא נמצאה' });
  if (!canEdit(req, comment)) return res.status(403).json({ error: 'אפשר למחוק רק הערה שלך' });
  comments = comments.filter((c) => c.id !== req.params.id);
  try {
    await saveComments(`jynx: ${req.user.name} deleted a comment`);
  } catch (err) {
    console.error('[jynx] save failed:', err.message);
  }
  return res.status(204).end();
});

app.get('/api/jynx/users', requireUser, requireAdmin, (req, res) => res.json({ users }));

app.delete('/api/jynx/users/:id', requireUser, requireAdmin, async (req, res) => {
  const target = users.find((u) => u.id === req.params.id);
  if (target && isAdminName(target.name)) return res.status(403).json({ error: 'אי אפשר להסיר מנהל' });
  users = users.filter((u) => u.id !== req.params.id);
  try {
    await writeJson(USERS_PATH, { version: 1, users }, `jynx: ${req.user.name} removed a user`);
  } catch (err) {
    console.error('[jynx] user save failed:', err.message);
  }
  return res.status(204).end();
});

boot()
  .catch((err) => console.error('[jynx] boot failed:', err.message))
  .finally(() => app.listen(PORT, () => console.log(`[jynx] listening on ${PORT}`)));
