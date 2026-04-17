import crypto from 'crypto';

export function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export function buildOrderNumber(id) {
  return `XIJ-${String(id).padStart(6, '0')}`;
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createResetToken() {
  return crypto.randomBytes(32).toString('hex');
}
