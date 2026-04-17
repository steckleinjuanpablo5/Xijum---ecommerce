import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    console.info(`🔐 Enlace de restablecimiento para ${to}: ${resetUrl}`);
    return { delivered: false, mode: 'console' };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject: 'Restablece tu contraseña · Xijúm',
    html: `
      <div style="font-family: Arial, sans-serif; color:#2b2d42;">
        <h2>Hola, ${name}</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#ff6b6b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si tú no hiciste esta solicitud, puedes ignorar este correo.</p>
      </div>
    `,
  });

  return { delivered: true, mode: 'smtp' };
}
