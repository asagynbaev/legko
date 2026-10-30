import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { config } from '@/config/env';
import {
  getStaffByBusinessId,
  getMasterById,
  MasterEducation,
  MasterProfile,
  MasterQualification,
  MasterService,
} from './api';
import { STAFF_SORT_ORDER } from '../constants/staffContent';

export const SITE_URL = 'https://legko.live';

/** Общий таймаут на список и догрузку slug: зависшая Booka не должна вешать сборку и sitemap */
const LIST_TIMEOUT_MS = 10000;

/** Специалист в списках (/staff, главная) — только поля, которые нужны карточке и ссылке. */
export interface StaffListItem {
  id: string;
  slug: string | null;
  name: string;
  photo: string | null;
  speciality: string;
  aboutMe: string;
  experience: number;
  numberOfClients: number;
  rating: number;
}

/**
 * Профиль /staff/<slug> — только поля, которые показывает страница. Ответ Booka целиком
 * в HTML не отдаём: в нём телефон мастера, брони, адрес и отзывы с id клиентов.
 */
export interface StaffProfile extends StaffListItem {
  services: Pick<MasterService, 'id' | 'name' | 'duration' | 'price' | 'currencySymbol'>[];
  educations: Pick<MasterEducation, 'institution' | 'degree' | 'fieldOfStudy' | 'startDate' | 'endDate' | 'description'>[];
  qualifications: Pick<MasterQualification, 'title' | 'issuingOrganization' | 'issueDate' | 'documentUrl' | 'certificateNumber'>[];
  // Booka их пока не отдаёт — тогда страница берёт свои карты по имени
  topics: string[] | null;
  languages: string[] | null;
  lgbtFriendly: boolean | null;
  workMethod: string | null;
}

type MasterExtras = Partial<Pick<StaffProfile, 'topics' | 'languages' | 'lgbtFriendly' | 'workMethod'>>;

export function toStaffProfile(m: MasterProfile & MasterExtras): StaffProfile {
  return {
    id: m.id,
    slug: m.slug ?? null,
    name: m.name, // как в Booka: по нему ищутся карты контента
    photo: m.photo || null,
    speciality: m.speciality ?? '',
    aboutMe: m.aboutMe ?? '',
    experience: m.experience ?? 0,
    numberOfClients: m.numberOfClients ?? 0,
    rating: m.rating ?? 0,
    services: (m.services ?? []).map(({ id, name, duration, price, currencySymbol }) =>
      ({ id, name, duration, price, currencySymbol })),
    educations: (m.educations ?? []).map(({ institution, degree, fieldOfStudy, startDate, endDate, description }) =>
      ({ institution, degree, fieldOfStudy, startDate, endDate, description })),
    qualifications: (m.qualifications ?? []).map(({ title, issuingOrganization, issueDate, documentUrl, certificateNumber }) =>
      ({ title, issuingOrganization, issueDate, documentUrl, certificateNumber })),
    topics: m.topics ?? null,
    languages: m.languages ?? null,
    lgbtFriendly: m.lgbtFriendly ?? null,
    workMethod: m.workMethod ?? null,
  };
}

/** Публичный адрес профиля: по slug из Booka, без slug — по id. */
export function staffPath(master: { id: string; slug?: string | null }) {
  return `/staff/${encodeURIComponent(master.slug || master.id)}`;
}

/** Мастер принадлежит бизнесу Legko (а не любому другому бизнесу Booka). */
export function isOwnMaster(master: MasterProfile) {
  const own = master.businessId?.toLowerCase() === config.businessId.toLowerCase();
  if (!own) console.warn(`[staff] master ${master.id} businessId=${master.businessId} — не Legko`);
  return own;
}

/** Элемент get-staff-by-business-id; slug в нём есть только на новом бэке Booka. */
type RawStaff = Omit<StaffListItem, 'slug'> & { slug?: string | null };

function toListItem(s: RawStaff, slug: string | null): StaffListItem {
  return {
    id: s.id,
    slug,
    name: s.name.replace(/\s+/g, ' ').trim(),
    photo: s.photo || null,
    speciality: s.speciality ?? '',
    aboutMe: s.aboutMe ?? '',
    experience: s.experience ?? 0,
    numberOfClients: s.numberOfClients ?? 0,
    rating: s.rating ?? 0,
  };
}

function sortStaff(list: StaffListItem[]) {
  const order = (name: string) => {
    const idx = STAFF_SORT_ORDER.indexOf(name);
    return idx >= 0 ? idx : STAFF_SORT_ORDER.length;
  };
  return [...list].sort((a, b) => order(a.name) - order(b.name));
}

async function getRawStaff(signal?: AbortSignal): Promise<RawStaff[]> {
  const res = await getStaffByBusinessId(signal);
  if (!res || !Array.isArray(res.message)) {
    throw new Error('get-staff-by-business-id: unexpected response');
  }
  return res.message;
}

/** Список одним запросом (slug — только если его отдаёт бэк) — для догрузки в браузере, если серверный список не пришёл. */
export async function getStaffListBasic(signal?: AbortSignal): Promise<StaffListItem[]> {
  const raw = await getRawStaff(signal);
  return sortStaff(raw.map((s) => toListItem(s, s.slug || null)));
}

/**
 * Список со slug — для SSR/ISR и sitemap. Если get-staff-by-business-id отдаёт поле slug — берём его;
 * старый бэк поля не отдаёт, тогда slug берётся из профиля мастера. Не удалось — ссылка по id (там 301 на slug).
 */
export async function getStaffList(): Promise<StaffListItem[]> {
  const signal = AbortSignal.timeout(LIST_TIMEOUT_MS);
  const raw = await getRawStaff(signal);
  const items = await Promise.all(
    raw.map(async (s) => {
      if ('slug' in s) return toListItem(s, s.slug || null);
      try {
        const { message } = await getMasterById(s.id, signal);
        return toListItem(s, message?.slug || null);
      } catch {
        return toListItem(s, null);
      }
    })
  );
  return sortStaff(items);
}

/**
 * getStaticProps для страниц со списком (/ и /staff). При сбое Booka на перегенерации ошибка
 * пробрасывается — Next продолжает отдавать последнюю удачную версию. Пустой список (с догрузкой
 * в браузере) — только при сборке, чтобы деплой не зависел от Booka.
 */
export async function getStaffStaticProps(limit?: number) {
  try {
    const list = await getStaffList();
    return { props: { initialStaff: limit ? list.slice(0, limit) : list }, revalidate: 600 };
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    console.error('[staff] getStaffList при сборке', error);
    return { props: { initialStaff: [] as StaffListItem[] }, revalidate: 60 };
  }
}
