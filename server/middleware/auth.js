import jwt from 'jsonwebtoken';
import { getOne } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'luxecart_jwt_secret_k3y_2024_s3cure_r4ndom';

/**
 * Generate a JWT token for a user.
 */
export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Middleware: Authenticate via Bearer token.
 * Attaches req.user = { id, email, role, first_name, last_name }.
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = getOne(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = ?',
      [payload.id]
    );
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware: Optionally authenticate — attaches req.user if token present, but doesn't block.
 */
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = getOne(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = ?',
      [payload.id]
    );
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

/**
 * Middleware: Require admin role (must be used after authenticate).
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
