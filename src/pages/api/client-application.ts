import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

/* ---------- Rate Limiter (in-memory, per-IP) ---------- */

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 минут
const RATE_LIMIT_MAX = 5; // максимум 5 заявок за окно

const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function getRateLimitHeaders(ip: string): Record<string, string> {
  const entry = ipHits.get(ip);
  if (!entry) return {};
  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  const reset = Math.ceil((entry.resetAt - Date.now()) / 1000);
  return {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(reset),
  };
}

// Чистим старые записи каждые 30 минут, чтобы Map не рос бесконечно
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipHits) {
    if (now > entry.resetAt) ipHits.delete(ip);
  }
}, 30 * 60 * 1000);

/* ---------- Types ---------- */

interface ClientApplicationData {
  topics: string;          // темы, через запятую
  topicOther: string;      // описание, если «Другое»
  previousTherapy: string; // обращались ли раньше
  format: string;          // онлайн / оффлайн
  consultType: string;     // индивидуальная / парная
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  messenger: string;       // WhatsApp / Telegram
  telegramNick: string;    // если Telegram
  language: string;        // язык консультации
  source: string;          // откуда узнали
  sourceOther: string;     // если «Другое»
}

/* ---------- Handler ---------- */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';

  const headers = getRateLimitHeaders(ip);
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Слишком много запросов. Попробуйте через 15 минут.' });
  }

  const data: ClientApplicationData = req.body;

  if (!data.name || !data.phone) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  // Валидация email (если указан)
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
  }

  // Валидация телефона
  const phoneDigits = data.phone.replace(/\D/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return res.status(400).json({ error: 'Некорректный номер телефона' });
  }

  const recipientEmail = process.env.APPLICATION_EMAIL;
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!recipientEmail || !smtpEmail || !smtpPassword) {
    console.error('Missing email configuration environment variables');
    return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  const clientLine = [data.name, data.age, data.gender].filter(Boolean).join(', ');
  const formatLine = [data.format, data.consultType].filter(Boolean).join(', ');
  const messengerText = data.messenger === 'Telegram' && data.telegramNick
    ? `Telegram (${data.telegramNick})`
    : data.messenger;
  const phoneLine = messengerText ? `${data.phone} (${messengerText})` : data.phone;
  const sourceText = data.source === 'Другое' && data.sourceOther
    ? `Другое: ${data.sourceOther}`
    : data.source;

  const row = (label: string, value: string) =>
    value
      ? `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#222;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`
      : '';

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 560px;">
      <h2 style="font-size:20px;margin:0 0 16px;color:#111;">Новая заявка 🎉</h2>
      <p style="margin:0 0 16px;font-size:16px;color:#222;"><strong>💜 Клиент:</strong> ${escapeHtml(clientLine)}</p>
      ${row('Запрос', data.topics)}
      ${row('Дополнительно', data.topicOther)}
      ${row('Опыт терапии', data.previousTherapy)}
      ${row('Формат', formatLine)}
      ${row('Язык', data.language)}
      <div style="height:12px;"></div>
      ${row('Телефон', phoneLine)}
      ${row('Email', data.email)}
      ${row('Источник', sourceText)}
      <p style="margin-top:20px;color:#888;font-size:13px;">Заявка с формы подбора психолога на legko.live</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Legko.live Заявка" <${smtpEmail}>`,
      to: recipientEmail,
      replyTo: data.email ? sanitizeHeader(data.email) : undefined,
      subject: sanitizeHeader(`Новая заявка клиента: ${data.name}`),
      html: htmlBody,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ error: 'Не удалось отправить заявку. Попробуйте позже.' });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function sanitizeHeader(text: string): string {
  return text.replace(/[\r\n]/g, '');
}
