const BASE_URL = "https://api.booka.kg/api/v1";

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

export interface AvailableTimesResponse {
  code: number;
  message: {
    availableTimes: string[];
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
export async function startMatching(userId?: string): Promise<StartResponse> {
  const url = userId 
    ? `${BASE_URL}/PsychologistMatch/start?userId=${userId}`
    : `${BASE_URL}/PsychologistMatch/start`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  messageHistory?: MessageHistoryItem[]
): Promise<MessageResponse> {
  try {
    const requestBody = {
      userId,
      sessionId,
      message,
      messageHistory,
    };
    
    // Логируем запрос для отладки (только в dev режиме)
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending message request:', {
        url: `${BASE_URL}/PsychologistMatch/message`,
        body: requestBody,
      });
    }
    
    const response = await fetch(`${BASE_URL}/PsychologistMatch/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Если не удалось распарсить JSON, используем текст ответа
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e2) {
          // Игнорируем ошибку парсинга текста
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: any) {
    // Если это уже наша ошибка, пробрасываем дальше
    if (error.message && error.message.startsWith('Ошибка')) {
      throw error;
    }
    // Иначе оборачиваем в более понятное сообщение
    throw new Error(error.message || 'Не удалось отправить сообщение. Проверьте подключение к интернету.');
  }
}

/**
 * Получить доступные времена для психолога
 */
export async function getAvailableTimes(
  psychologistId: string,
  date: string
): Promise<AvailableTimesResponse> {
  const response = await fetch(
    `${BASE_URL}/PsychologistMatch/available-times/${psychologistId}?date=${date}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get available times: ${response.status}`);
  }

  return response.json();
}

/**
 * Создать бронирование
 */
export async function createBooking(
  booking: CreateBookingRequest
): Promise<CreateBookingResponse> {
  const response = await fetch(`${BASE_URL}/PsychologistMatch/create-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
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
  
  // Если начинается с +996, убираем +
  if (digits.startsWith("996")) {
    return digits;
  }
  
  // Иначе добавляем 996 в начало
  return "996" + digits;
}

