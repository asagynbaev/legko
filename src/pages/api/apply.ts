import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb',
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

interface FileAttachment {
  name: string;
  data: string; // base64
  type: string;
}

interface ApplicationData {
  email: string;
  name: string;
  birthDate: string;
  phone: string;
  education: string;
  experience: string;
  methods: string;
  personalTherapyHours: string;
  supervision: string;
  socialMediaPromotion: string;
  onlineSessions: string;
  service: string;
  hourlyRate: string;
  platformGoal: string;
  problemsDescription: string;
  ethicsAgreement: string;
  platformFeedback: string;
  referralSource: string;
  files: FileAttachment[];
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

  const data: ApplicationData = req.body;

  if (!data.email || !data.name || !data.phone) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return res.status(400).json({ error: 'Некорректный email' });
  }

  // Валидация телефона
  const phoneDigits = data.phone.replace(/\D/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return res.status(400).json({ error: 'Некорректный номер телефона' });
  }

  // Валидация файлов на сервере
  const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];
  const MAX_FILES = 3;
  const MAX_FILE_BYTES = 1 * 1024 * 1024;

  if (data.files && data.files.length > MAX_FILES) {
    return res.status(400).json({ error: `Максимум ${MAX_FILES} файла` });
  }

  for (const file of data.files || []) {
    if (!ALLOWED_MIME.includes(file.type)) {
      return res.status(400).json({ error: `Недопустимый тип файла: ${escapeHtml(file.name)}` });
    }
    const sizeBytes = Buffer.byteLength(file.data, 'base64');
    if (sizeBytes > MAX_FILE_BYTES) {
      return res.status(400).json({ error: `Файл "${escapeHtml(file.name)}" слишком большой` });
    }
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

  const htmlBody = `
    <h2>Новая анкета психолога</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 700px; font-family: Arial, sans-serif;">
      ${formatRow('Email', data.email)}
      ${formatRow('Имя Фамилия', data.name)}
      ${formatRow('Дата рождения', data.birthDate)}
      ${formatRow('Номер телефона', data.phone)}
      ${formatRow('Образование (уровень, место обучения, год выпуска, специальность)', data.education)}
      ${formatRow('Опыт работы (количество лет)', data.experience)}
      ${formatRow('Методы работы', data.methods)}
      ${formatRow('Часы личной терапии', data.personalTherapyHours)}
      ${formatRow('Супервизия (проходите ли, как часто)', data.supervision)}
      ${formatRow('Продвижение в соцсетях', data.socialMediaPromotion)}
      ${formatRow('Онлайн сессии', data.onlineSessions)}
      ${formatRow('Используемый сервис', data.service)}
      ${formatRow('Часовая ставка', data.hourlyRate)}
      ${formatRow('Запрос к платформе', data.platformGoal)}
      ${formatRow('Основные проблемы и направленность', data.problemsDescription)}
      ${formatRow('Согласие на этику и работу в рамках платформы', data.ethicsAgreement)}
      ${formatRow('Пожелания / вопросы / комментарии', data.platformFeedback)}
      ${formatRow('Откуда узнали о нас', data.referralSource)}
    </table>
    <p style="margin-top: 20px; color: #666; font-size: 13px;">
      ${data.files.length > 0 ? `Прикреплено файлов: ${data.files.length}` : 'Файлы не прикреплены'}
    </p>
  `;

  const attachments = data.files.map((file) => ({
    filename: file.name,
    content: file.data,
    encoding: 'base64' as const,
    contentType: file.type,
  }));

  try {
    await transporter.sendMail({
      from: `"Legko.live Анкета" <${smtpEmail}>`,
      to: recipientEmail,
      replyTo: sanitizeHeader(data.email),
      subject: sanitizeHeader(`Новая анкета психолога: ${data.name}`),
      html: htmlBody,
      attachments,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ error: 'Не удалось отправить анкету. Попробуйте позже.' });
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
