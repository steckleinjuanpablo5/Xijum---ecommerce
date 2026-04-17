import { query } from '../config/db.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'No autorizado. Inicia sesión.' });
    }

    const decoded = verifyToken(token);
    const result = await query(
      'SELECT id, first_name, last_name, email, role, phone, avatar_url, is_active, created_at, updated_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    const user = result.rows[0];
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Tu sesión no es válida.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido al administrador.' });
  }
  next();
}
