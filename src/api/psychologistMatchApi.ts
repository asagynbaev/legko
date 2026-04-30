import { config } from "@/config/env";

const isServer = typeof window === 'undefined';
const BASE_URL = isServer ? config.apiBaseUrl : "/api/proxy";

export interface MessageHistoryItem {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface PsychologistSuggestion {
  psychologistId: string;
  name: string;
  speciality: string;
  rating: number;
  experience: number;
  numberOfClients: number;
  services: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    durationMinutes: number;
  }>;
  reason?: string;
}

export interface BookingSuggestion {
  masterId?: string;
  serviceId?: string;
  serviceIds?: string[];
  suggestedDate?: string;
  suggestedTime?: string;
  note?: string;
  clientName?: string;
  clientPhone?: string;
}

export interface StartResponse {
  code: number;
  message: {
    message: string;
    sessionId: string;
  };
}

export interface MessageResponse {
  code: number;
  message: {
    message: string;
    sessionId?: string;
    psychologistSuggestions?: PsychologistSuggestion[];
    bookingSuggestion?: BookingSuggestion;
  };
}

export interface CreateBookingRequest {
  masterId: string;
  serviceIds: string[];
  appointmentDate: string;
  startTime: string;
  endTime: string;
  name: string;
  phone: string;
  note?: string;
}

export interface CreateBookingResponse {
  code: number;
  message: {
    bookingId: string;
    status: string;
  };
}

/**
 * Начать диалог для подбора психолога
 */
export async function startMatching(userId?: string, signal?: AbortSignal): Promise<StartResponse> {
  const url = userId
    ? `${BASE_URL}/PsychologistMatch/start?userId=${encodeURIComponent(userId)}`
    : `${BASE_URL}/PsychologistMatch/start`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept-Language": "ru",
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to start matching: ${response.status}`);
  }

  return response.json();
}

/**
 * Отправить сообщение в чат
 */
export async function sendMessage(
  message: string,
  sessionId?: string,
  userId?: string,
  messageHistory?: MessageHistoryItem[],
  signal?: AbortSignal
): Promise<MessageResponse> {
  try {
    const requestBody = {
      userId,
      sessionId,
      message,
      messageHistory,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Sending message request:', {
        url: `${BASE_URL}/PsychologistMatch/message`,
        body: requestBody,
      });
    }

    const response = await fetch(`${BASE_URL}/PsychologistMatch/message`, {
      method: "POST",
      headers: {
        "Accept-Language": "ru",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (!response.ok) {
      let errorMessage = `Ошибка ${response.status}`;
      try {
        const cloned = response.clone();
        const errorData = await cloned.json();
        const raw = errorData.message || errorData.error || '';
        if (raw && typeof raw === 'string' && raw.length < 200) {
          errorMessage = raw;
        }
      } catch {
        // Не раскрываем сырой текст ответа — может содержать stack trace
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof Error && error.message && error.message.startsWith('Ошибка')) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Не удалось отправить сообщение. Проверьте подключение к интернету.';
    throw new Error(errorMessage);
  }
}

/**
 * Создать бронирование
 */
export async function createBooking(
  booking: CreateBookingRequest,
  signal?: AbortSignal
): Promise<CreateBookingResponse> {
  const response = await fetch(`${BASE_URL}/PsychologistMatch/create-booking`, {
    method: "POST",
    headers: {
      "Accept-Language": "ru",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errorData.message || `Failed to create booking: ${response.status}`);
  }

  return response.json();
}

/**
 * Нормализовать номер телефона в формат 996XXXXXXXXX
 */
export function normalizePhone(phone: string): string {
  // Удаляем все нецифровые символы
  const digits = phone.replace(/\D/g, "");

  // Если начинается с 996, возвращаем как есть
  if (digits.startsWith("996")) {
    return digits;
  }

  // Если начинается с 0, заменяем на 996
  if (digits.startsWith("0")) {
    return "996" + digits.substring(1);
  }

  // Иначе добавляем 996 в начало
  return "996" + digits;
}

