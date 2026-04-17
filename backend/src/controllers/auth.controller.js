import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import { sanitizeUser, createResetToken, hashResetToken } from '../utils/helpers.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'Ese correo ya está registrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, 'customer', $5)
       RETURNING id, first_name, last_name, email, role, phone, avatar_url, is_active, created_at, updated_at`,
      [firstName.trim(), lastName.trim(), email.toLowerCase(), passwordHash, phone || null]
    );

    const user = result.rows[0];
    const token = signToken({ userId: user.id, role: user.role });

    return res.status(201).json({
      message: 'Cuenta creada correctamente.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    return res.json({
      message: 'Bienvenido de nuevo.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const userResult = await query('SELECT id, first_name, email FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = userResult.rows[0];

    if (!user) {
      return res.json({ message: 'Si el correo existe, enviaremos un enlace para restablecer la contraseña.' });
    }

    const plainToken = createResetToken();
    const tokenHash = hashResetToken(plainToken);

    await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user.id]);
    await query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.id, tokenHash]
    );

    const resetUrl = `${env.frontendUrl}#reset-password/${plainToken}`;
    await sendPasswordResetEmail({ to: user.email, name: user.first_name, resetUrl });

    return res.json({ message: 'Si el correo existe, enviaremos un enlace para restablecer la contraseña.' });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const tokenHash = hashResetToken(token);

    const result = await query(
      `SELECT prt.id, prt.user_id
       FROM password_reset_tokens prt
       WHERE prt.token_hash = $1
         AND prt.used_at IS NULL
         AND prt.expires_at > NOW()`,
      [tokenHash]
    );

    const row = result.rows[0];
    if (!row) {
      return res.status(400).json({ message: 'El enlace de recuperación no es válido o ya expiró.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, row.user_id]);
    await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [row.id]);

    return res.json({ message: 'Tu contraseña fue actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { firstName, lastName, phone } = req.body;
    const result = await query(
      `UPDATE users
       SET first_name = $1, last_name = $2, phone = $3
       WHERE id = $4
       RETURNING id, first_name, last_name, email, role, phone, avatar_url, is_active, created_at, updated_at`,
      [firstName.trim(), lastName.trim(), phone || null, req.user.id]
    );
    return res.json({ message: 'Perfil actualizado.', user: result.rows[0] });
  } catch (error) {
    next(error);
  }
}
