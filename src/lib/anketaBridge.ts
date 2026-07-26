/**
 * Мост «анкета → бронь».
 *
 * Данные анкеты клиента (возраст, пол, темы и т.д.) на бэкенде Booka не хранятся —
 * их обязан донести сайт. Анкета и бронь у нас — два разных потока (анкета шлёт письмо,
 * бронь создаётся в чате). Поэтому при отправке анкеты кладём поля в sessionStorage,
 * а при создании брони (в любом из путей) подмешиваем их в вызов и затем чистим.
 *
 * sessionStorage выбран намеренно: это персональные/чувствительные данные, они не должны
 * жить дольше вкладки, и уходят сразу после успешной брони.
 */

const KEY = 'legko:anketa';

/** Поля, которые принимает создание брони (имена и типы — как в Partner API). */
export interface AnketaBookingFields {
  age?: number;
  gender?: string;
  topics?: string[];
  topicOther?: string;
  previousTherapy?: string;
  format?: string;
  consultType?: string;
  language?: string;
}

/** Сырые значения из формы анкеты (ChatQuestionnaire). */
export interface AnketaRaw {
  age?: string;
  gender?: string;
  topics?: string[];
  topicOther?: string;
  previousTherapy?: string;
  format?: string;
  consultType?: string;
  language?: string;
}

const clean = (s?: string) => (s ? s.trim() : '');
const lc = (s?: string) => clean(s).toLowerCase();

/** Приводим сырые значения формы к каноничному виду для брони; пустые поля опускаем. */
export function normalizeAnketa(raw: AnketaRaw): AnketaBookingFields {
  const out: AnketaBookingFields = {};

  const ageNum = parseInt(clean(raw.age), 10);
  if (Number.isFinite(ageNum) && ageNum > 0) out.age = ageNum;

  const gender = lc(raw.gender);
  if (gender) out.gender = gender;                 // «мужской» / «женский» / «другое»

  const topics = (raw.topics || []).map((t) => clean(t)).filter(Boolean);
  if (topics.length) out.topics = topics;

  const topicOther = clean(raw.topicOther);
  if (topicOther) out.topicOther = topicOther;

  const previousTherapy = clean(raw.previousTherapy);
  if (previousTherapy) out.previousTherapy = previousTherapy;

  const format = lc(raw.format);
  if (format) out.format = format;                 // «онлайн» / «оффлайн»

  const consultType = lc(raw.consultType);
  if (consultType) out.consultType = consultType;  // «индивидуальная» / «парная»

  const language = clean(raw.language);
  if (language) out.language = language;

  return out;
}

/** Сохранить данные анкеты (вызывать при успешной отправке анкеты). */
export function saveAnketa(raw: AnketaRaw): void {
  if (typeof window === 'undefined') return;
  try {
    const fields = normalizeAnketa(raw);
    if (Object.keys(fields).length === 0) return;
    window.sessionStorage.setItem(KEY, JSON.stringify(fields));
  } catch {
    /* приватный режим / переполнение — игнорируем, поля просто не доедут */
  }
}

/** Получить поля анкеты для подмешивания в бронь (или пустой объект). */
export function loadAnketaFields(): AnketaBookingFields {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AnketaBookingFields) : {};
  } catch {
    return {};
  }
}

/** Очистить (вызывать после успешной брони). */
export function clearAnketa(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
