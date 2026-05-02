/**
 * Partner API client — проксируется через /api/partner/ чтобы не светить ключ.
 */

const BASE = '/api/partner';

async function partnerGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE}/${path}`, {
    headers: { 'Accept-Language': 'ru' },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Partner API ${path}: ${response.status}`);
  }
  return response.json();
}

async function partnerPost<T>(path: string, body: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept-Language': 'ru' },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: `Error ${response.status}` }));
    throw new Error(data.error || data.message || `Partner API ${path}: ${response.status}`);
  }
  return response.json();
}

// --- Types ---

export interface PartnerMaster {
  id: string;
  name: string;
  speciality: string;
  rating: number;
  experience: number;
  consultationFormat: string | null;
  isLgbtFriendly: boolean | null;
  aboutMe: string;
  address: string | null;
  slug: string;
  services: PartnerService[];
}

export interface PartnerService {
  id: string;
  name: string;
  price: number;
  duration: number;
  currencyCode: string;
}

export interface PartnerSlotsResponse {
  code: number;
  data: Record<string, string[]>;
}

export interface PartnerBookingResponse {
  code: number;
  data: {
    bookingId: string;
    status: string;
    masterName: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    address: string | null;
    meetingLink: string | null;
  };
}

// --- Functions ---

export async function getPartnerMasters(signal?: AbortSignal) {
  return partnerGet<{ code: number; data: PartnerMaster[]; pagination: { total: number } }>('masters?pageSize=50', signal);
}

export async function getPartnerMasterSlots(masterId: string, date: string, days = 7, signal?: AbortSignal) {
  return partnerGet<PartnerSlotsResponse>(
    `masters/${encodeURIComponent(masterId)}/slots?date=${encodeURIComponent(date)}&days=${days}`,
    signal,
  );
}

export async function createPartnerBooking(
  booking: {
    masterId: string;
    serviceIds: string[];
    appointmentDate: string;
    startTime: string;
    endTime: string;
    clientName: string;
    clientPhone: string;
    note?: string;
  },
  signal?: AbortSignal,
) {
  return partnerPost<PartnerBookingResponse>('bookings', booking, signal);
}
