import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb',
    },
  },
};

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data: ApplicationData = req.body;

  if (!data.email || !data.name || !data.phone) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
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
      replyTo: data.email,
      subject: `Новая анкета психолога: ${data.name}`,
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
    .replace(/"/g, '&quot;');
}
