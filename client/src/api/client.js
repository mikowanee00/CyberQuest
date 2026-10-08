/* =====================================================================
 * api/client.js — Talks to the Express server
 * ---------------------------------------------------------------------
 * Every call goes through request(), which adds the player's id and
 * code as headers and turns error replies into ApiError exceptions.
 * The "session" (id + code) is remembered in localStorage so players
 * stay logged in on this device.
 * ===================================================================== */

const SESSION_KEY = 'cyberquest.session';

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* storage blocked */ }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* storage blocked */ }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, url, { body, adminKey } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const session = loadSession();
  if (session) {
    headers['x-user-id'] = session.userId;
    headers['x-player-code'] = session.playerCode;
  }
  if (adminKey) headers['x-admin-key'] = adminKey;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'Cannot reach the CyberQuest server. Is it running?');
  }

  if (res.status === 204) return null;
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status}). Is the server running?`;
    throw new ApiError(res.status, message);
  }
  return data;
}

/** Saves a text/JSON/CSV blob as a file in the user's Downloads. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const api = {
  /* ----- Player ----- */
  register: (nickname, consent) => request('POST', '/api/users', { body: { nickname, consent } }),
  login: (nickname, playerCode) => request('POST', '/api/users/login', { body: { nickname, playerCode } }),
  me: () => request('GET', '/api/me'),
  rename: nickname => request('PATCH', '/api/me', { body: { nickname } }),
  resetProgress: () => request('POST', '/api/me/reset'),
  deleteAccount: () => request('DELETE', '/api/me'),
  exportMyData: () => request('GET', '/api/me/export'),

  /* ----- Progress ----- */
  visitLesson: id => request('POST', `/api/me/lessons/${id}/visit`),
  completeActivity: id => request('POST', `/api/me/lessons/${id}/activity`),
  submitQuiz: (id, result) => request('POST', `/api/me/lessons/${id}/quiz`, { body: result }),

  /* ----- Admin dashboard ----- */
  admin: {
    summary: key => request('GET', '/api/admin/summary', { adminKey: key }),
    users: key => request('GET', '/api/admin/users', { adminKey: key }),
    user: (key, id) => request('GET', `/api/admin/users/${id}`, { adminKey: key }),
    deleteUser: (key, id) => request('DELETE', `/api/admin/users/${id}`, { adminKey: key }),
    questions: key => request('GET', '/api/admin/questions', { adminKey: key }),
    /** Downloads a CSV file (users | attempts | lessons | questions). */
    async downloadCSV(key, dataset) {
      const res = await fetch(`/api/admin/export/${dataset}`, { headers: { 'x-admin-key': key } });
      if (!res.ok) throw new ApiError(res.status, 'Export failed. Check the admin key and that the server is running.');
      const date = new Date().toISOString().slice(0, 10);
      downloadBlob(await res.blob(), `cyberquest-${dataset}-${date}.csv`);
    }
  }
};
