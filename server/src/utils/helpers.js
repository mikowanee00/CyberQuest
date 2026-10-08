/* =====================================================================
 * utils/helpers.js — Small reusable helpers
 * ===================================================================== */
const crypto = require('crypto');

/** Error with an HTTP status code, thrown by controllers. */
class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Wraps an async controller so thrown errors reach the error handler. */
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------- Player codes ---------- */

// No 0/O or 1/I so codes are easy to read and type.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Random code like "K7QM-2XPA" (32^8 ≈ 1 trillion combinations). */
function generatePlayerCode() {
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/** Upper-case and remove dashes/spaces, so "k7qm 2xpa" also works. */
const normalizeCode = code => String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

const hashCode = code => crypto.createHash('sha256').update(normalizeCode(code)).digest('hex');

/** Compares a typed code with a stored hash in constant time. */
function codeMatches(code, storedHash) {
  const a = Buffer.from(hashCode(code), 'hex');
  const b = Buffer.from(String(storedHash || ''), 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- CSV export ---------- */

/** Formats one CSV cell (quotes, commas, and Excel formula injection). */
function csvCell(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  let s = String(value);
  // A text cell starting with = + - @ could run as a formula in Excel.
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * Builds a CSV string from column definitions and row objects.
 * Starts with a UTF-8 BOM so Excel shows emojis/accents correctly.
 */
function toCSV(columns, rows) {
  const header = columns.map(c => csvCell(c.label)).join(',');
  const lines = rows.map(row => columns.map(c => csvCell(row[c.key])).join(','));
  return '﻿' + [header, ...lines].join('\r\n');
}

module.exports = { AppError, asyncHandler, generatePlayerCode, hashCode, codeMatches, toCSV };
