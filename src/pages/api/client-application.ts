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

  const topicsText = data.topics + (data.topicOther ? ` · Другое: ${data.topicOther}` : '');
  const messengerText = data.messenger === 'Telegram' && data.telegramNick
    ? `Telegram (${data.telegramNick})`
    : data.messenger;
  const sourceText = data.source === 'Другое' && data.sourceOther
    ? `Другое: ${data.sourceOther}`
    : data.source;

  const htmlBody = `
    <h2>Новая заявка клиента</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 700px; font-family: Arial, sans-serif;">
      ${formatRow('Что беспокоит', topicsText)}
      ${formatRow('Обращались к психологу раньше', data.previousTherapy)}
      ${formatRow('Формат консультации', data.format)}
      ${formatRow('Тип консультации', data.consultType)}
      ${formatRow('Имя', data.name)}
      ${formatRow('Возраст', data.age)}
      ${formatRow('Пол', data.gender)}
      ${formatRow('Телефон', data.phone)}
      ${formatRow('Email', data.email)}
      ${formatRow('Удобный мессенджер', messengerText)}
      ${formatRow('Язык консультации', data.language)}
      ${formatRow('Откуда узнали о нас', sourceText)}
    </table>
    <p style="margin-top: 20px; color: #666; font-size: 13px;">
      Заявка отправлена с формы подбора психолога на legko.live
    </p>
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

function formatRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #e0e0e0; background: #f8f8f8; font-weight: 600; width: 35%; vertical-align: top; font-size: 14px;">${label}</td>
      <td style="padding: 10px 12px; border: 1px solid #e0e0e0; font-size: 14px; white-space: pre-wrap;">${escapeHtml(value || '—')}</td>
    </tr>
  `;
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
