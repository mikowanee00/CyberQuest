/* =====================================================================
 * middleware/errorHandler.js — Turns errors into friendly JSON replies
 * ===================================================================== */

/** Unknown /api/... URL */
function notFound(req, res) {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';

  if (err.name === 'ValidationError') {
    // Mongoose validation: collect all field messages
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(' ');
  } else if (err.code === 11000) {
    // Unique index violation (nickname already used)
    status = 409;
    message = 'That nickname is already taken. Please choose another one.';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id.';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON.';
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };