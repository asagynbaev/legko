import { config } from "@/config/env";

/**
 * Get staff by business id
 */
export async function getStaffByBusinessId() {
    const endpoint = `/Business/staff/get-staff-by-business-id/${config.businessId}`;
    return apiGet(endpoint);
}

/** Master (psychologist) full profile from Booka API */
export interface MasterService {
  id: string;
  name: string;
  duration: number;
  price: number;
  currencyCode: string;
  currencySymbol: string;
}

export interface MasterWorkSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  dayOff: boolean;
  note: string | null;
}

export interface MasterEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  description: string;
}

export interface MasterAddress {
  id: string;
  addressLine: string;
  additionalInfo: string | null;
  latitude: number;
  longitude: number;
}

export interface MasterProfile {
  id: string;
  name: string;
  phone: string;
  speciality: string;
  aboutMe: string;
  address: MasterAddress | null;
  photo: string;
  experience: number;
  numberOfClients: number;
  rating: number;
  services: MasterService[];
  workSchedules: MasterWorkSchedule[];
  educations: MasterEducation[];
  currencySymbol: string;
}

interface GetMasterByIdResponse {
  code: number;
  message: MasterProfile;
}

/**
 * Get full master (psychologist) profile by id
 */
export async function getMasterById(masterId: string): Promise<GetMasterByIdResponse> {
    const endpoint = `/Masters/get-master-by-id?id=${encodeURIComponent(masterId)}`;
    const res = await apiGet(endpoint);
    return res as GetMasterByIdResponse;
}
const BASE_URL = config.apiBaseUrl;

const API_HEADERS: HeadersInit = {
    "Accept-Language": "ru",
};

export async function apiGet(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: API_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`GET ${endpoint} failed: ${response.status}`);
    }
    return response.json();
}

export async function apiPost(endpoint: string, body: Record<string, unknown>) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            ...API_HEADERS,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }
    return response.json();
}

const api = {
    apiGet,
    apiPost
};

export default api;
