/* GeoTactical Market backend — single serverless function, no dependencies.
   Storage: Upstash Redis over REST (env: KV_REST_API_URL / KV_REST_API_TOKEN,
   also accepts UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
   Until a database is attached the API reports {connected:false} and the
   frontends stay in local demo mode. Routes are selected with ?a=<action>. */
'use strict';
const crypto = require('crypto');

/* ---------- storage ---------- */
const memory = new Map(); // fallback store for local tests (GTM_MEMORY=1)

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (process.env.GTM_MEMORY === '1') return { memory: true };
  if (url && token) return { url, token };
  return null;
}

async function redis(cmd) {
  const cfg = kvConfig();
  if (!cfg) throw new Error('no-db');
  if (cfg.memory) {
    const [op, key, val] = cmd;
    if (op === 'SET') { memory.set(key, val); return 'OK'; }
    if (op === 'GET') return memory.has(key) ? memory.get(key) : null;
    if (op === 'DEL') { memory.delete(key); return 1; }
    if (op === 'SETEX') { memory.set(key, cmd[3]); return 'OK'; }
    return null;
  }
  const r = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cfg.token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  if (!r.ok) throw new Error('kv-http-' + r.status);
  const d = await r.json();
  if (d.error) throw new Error('kv-' + d.error);
  return d.result;
}

async function getJSON(key, dflt) {
  const v = await redis(['GET', key]);
  if (v == null) return dflt;
  try { return JSON.parse(v); } catch (e) { return dflt; }
}
async function setJSON(key, val) { return redis(['SET', key, JSON.stringify(val)]); }

/* ---------- helpers ---------- */
function hashPass(pass, salt) {
  return crypto.createHash('sha256').update(salt + '::' + pass).digest('hex');
}
function token() { return crypto.randomBytes(24).toString('hex'); }
function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise(function (resolve) {
    let b = '';
    req.on('data', function (c) { b += c; if (b.length > 100000) req.destroy(); });
    req.on('end', function () { try { resolve(b ? JSON.parse(b) : {}); } catch (e) { resolve({}); } });
  });
}
function adminKey() { return process.env.ADMIN_KEY || 'tactical2026'; }
function isAdmin(req) { return (req.headers['x-admin-key'] || '') === adminKey(); }
async function sessionUser(req) {
  const t = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!t) return null;
  const email = await redis(['GET', 'gtm:sess:' + t]);
  if (!email) return null;
  const users = await getJSON('gtm:users', {});
  return users[email] ? { email: email, name: users[email].name } : null;
}
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* ---------- handler ---------- */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  const u = new URL(req.url, 'http://x');
  const a = u.searchParams.get('a') || 'health';
  const connected = !!kvConfig();

  try {
    /* -- health -- */
    if (a === 'health') {
      let dbOk = false;
      if (connected) { try { await redis(['SET', 'gtm:ping', '1']); dbOk = true; } catch (e) { dbOk = false; } }
      return json(res, 200, { ok: true, connected: dbOk, ts: Date.now() });
    }
    if (!connected) return json(res, 503, { ok: false, error: 'database-not-attached' });

    /* -- auth -- */
    if (a === 'register' && req.method === 'POST') {
      const b = await readBody(req);
      const email = String(b.email || '').trim().toLowerCase();
      const name = String(b.name || '').trim();
      const pass = String(b.pass || '');
      if (!EMAIL_RE.test(email)) return json(res, 400, { error: 'bad-email' });
      if (name.length < 2) return json(res, 400, { error: 'bad-name' });
      if (pass.length < 6) return json(res, 400, { error: 'short-pass' });
      const users = await getJSON('gtm:users', {});
      if (users[email]) return json(res, 409, { error: 'exists' });
      const salt = token();
      users[email] = { name: name, phone: String(b.phone || '').trim(), salt: salt, hash: hashPass(pass, salt), created: new Date().toISOString(), verified: false, blocked: false };
      await setJSON('gtm:users', users);
      const t = token();
      await redis(['SETEX', 'gtm:sess:' + t, 60 * 60 * 24 * 30, email]);
      return json(res, 200, { token: t, name: name, email: email });
    }
    if (a === 'login' && req.method === 'POST') {
      const b = await readBody(req);
      const email = String(b.email || '').trim().toLowerCase();
      const users = await getJSON('gtm:users', {});
      const usr = users[email];
      if (!usr || usr.hash !== hashPass(String(b.pass || ''), usr.salt)) return json(res, 401, { error: 'bad-credentials' });
      if (usr.blocked) return json(res, 403, { error: 'blocked' });
      const t = token();
      await redis(['SETEX', 'gtm:sess:' + t, 60 * 60 * 24 * 30, email]);
      return json(res, 200, { token: t, name: usr.name, email: email });
    }
    if (a === 'me') {
      const s = await sessionUser(req);
      return s ? json(res, 200, s) : json(res, 401, { error: 'no-session' });
    }
    if (a === 'logout' && req.method === 'POST') {
      const t = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (t) await redis(['DEL', 'gtm:sess:' + t]);
      return json(res, 200, { ok: true });
    }

    /* -- listings -- */
    if (a === 'listings' && req.method === 'GET') {
      const all = await getJSON('gtm:listings', []);
      if (isAdmin(req)) return json(res, 200, all);
      return json(res, 200, all.filter(function (l) { return l.status === 'approved'; }));
    }
    if (a === 'listings' && req.method === 'POST') {
      const s = await sessionUser(req);
      if (!s) return json(res, 401, { error: 'login-required' });
      const b = await readBody(req);
      const all = await getJSON('gtm:listings', []);
      const item = {
        id: 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: String(b.name || '').trim().slice(0, 120),
        price: Math.max(0, +b.price || 0),
        cat: String(b.cat || '—').slice(0, 60),
        cond: String(b.cond || '—').slice(0, 40),
        regulated: !!b.regulated,
        seller: s.name, sellerEmail: s.email,
        status: 'pending', created: new Date().toISOString()
      };
      if (item.name.length < 3) return json(res, 400, { error: 'bad-name' });
      all.unshift(item);
      await setJSON('gtm:listings', all.slice(0, 500));
      return json(res, 200, item);
    }
    if (a === 'listing-status' && req.method === 'PATCH') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      const b = await readBody(req);
      const all = await getJSON('gtm:listings', []);
      const it = all.find(function (l) { return l.id === b.id; });
      if (!it) return json(res, 404, { error: 'not-found' });
      if (['pending', 'approved', 'rejected'].indexOf(b.status) === -1) return json(res, 400, { error: 'bad-status' });
      it.status = b.status;
      await setJSON('gtm:listings', all);
      return json(res, 200, it);
    }

    /* -- users (admin) -- */
    if (a === 'users' && req.method === 'GET') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      const users = await getJSON('gtm:users', {});
      return json(res, 200, Object.keys(users).map(function (em) {
        const x = users[em];
        return { email: em, name: x.name, phone: x.phone || '—', created: x.created, verified: !!x.verified, blocked: !!x.blocked };
      }));
    }
    if (a === 'user-flags' && req.method === 'PATCH') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      const b = await readBody(req);
      const users = await getJSON('gtm:users', {});
      const usr = users[String(b.email || '').toLowerCase()];
      if (!usr) return json(res, 404, { error: 'not-found' });
      if (typeof b.verified === 'boolean') usr.verified = b.verified;
      if (typeof b.blocked === 'boolean') usr.blocked = b.blocked;
      await setJSON('gtm:users', users);
      return json(res, 200, { ok: true });
    }

    /* -- orders -- */
    if (a === 'orders' && req.method === 'GET') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      return json(res, 200, await getJSON('gtm:orders', []));
    }
    if (a === 'orders' && req.method === 'POST') {
      const s = await sessionUser(req);
      if (!s) return json(res, 401, { error: 'login-required' });
      const b = await readBody(req);
      const all = await getJSON('gtm:orders', []);
      const o = { id: 'o-' + (1043 + all.length), buyer: s.name, buyerEmail: s.email, items: String(b.items || '').slice(0, 300), total: Math.max(0, +b.total || 0), status: 'new', created: new Date().toISOString() };
      all.unshift(o);
      await setJSON('gtm:orders', all.slice(0, 500));
      return json(res, 200, o);
    }
    if (a === 'order-status' && req.method === 'PATCH') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      const b = await readBody(req);
      const all = await getJSON('gtm:orders', []);
      const o = all.find(function (x) { return x.id === b.id; });
      if (!o) return json(res, 404, { error: 'not-found' });
      if (['new', 'confirmed', 'shipped', 'completed', 'cancelled'].indexOf(b.status) === -1) return json(res, 400, { error: 'bad-status' });
      o.status = b.status;
      await setJSON('gtm:orders', all);
      return json(res, 200, o);
    }

    /* -- messages -- */
    if (a === 'messages' && req.method === 'GET') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      return json(res, 200, await getJSON('gtm:messages', []));
    }
    if (a === 'messages' && req.method === 'POST') {
      const b = await readBody(req);
      const from = String(b.from || '').trim().slice(0, 80);
      const email = String(b.email || '').trim().slice(0, 120);
      const subject = String(b.subject || '').trim().slice(0, 160);
      const body = String(b.body || '').trim().slice(0, 2000);
      if (!from || !subject || !body) return json(res, 400, { error: 'missing-fields' });
      const all = await getJSON('gtm:messages', []);
      all.unshift({ id: 'M' + Date.now().toString(36), from: from, email: email, subject: subject, body: body, prio: 'normal', status: 'new', received: new Date().toISOString() });
      await setJSON('gtm:messages', all.slice(0, 500));
      return json(res, 200, { ok: true });
    }
    if (a === 'message-status' && req.method === 'PATCH') {
      if (!isAdmin(req)) return json(res, 403, { error: 'admin-only' });
      const b = await readBody(req);
      const all = await getJSON('gtm:messages', []);
      const m = all.find(function (x) { return x.id === b.id; });
      if (!m) return json(res, 404, { error: 'not-found' });
      if (['new', 'in progress', 'replied', 'closed'].indexOf(b.status) === -1) return json(res, 400, { error: 'bad-status' });
      m.status = b.status;
      await setJSON('gtm:messages', all);
      return json(res, 200, m);
    }

    return json(res, 404, { error: 'unknown-action' });
  } catch (e) {
    if (String(e.message) === 'no-db') return json(res, 503, { ok: false, error: 'database-not-attached' });
    return json(res, 500, { error: 'server-error' });
  }
};
