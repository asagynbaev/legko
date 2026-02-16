import * as signalR from "@microsoft/signalr";

const HUB_URL = "https://api.booka.life/hubs/psychologist-match";

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

export interface MessageReceivedData {
  message: string;
  sessionId?: string;
  psychologistSuggestions?: PsychologistSuggestion[];
  bookingSuggestion?: BookingSuggestion;
}

export interface MessageChunkData {
  chunk: string;
}

export interface MessageCompleteData {
  message: string;
  sessionId: string;
  psychologistSuggestions?: PsychologistSuggestion[];
  bookingSuggestion?: BookingSuggestion;
}

export interface AvailableTimesReceivedData {
  psychologistId: string;
  date: string;
  availableTimes: string[];
}

export interface ErrorData {
  message: string;
}

export interface SessionJoinedData {
  sessionId: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;

  /**
   * Подключиться к SignalR Hub
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          headers: {},
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Редкие повторы, чтобы не спамить negotiate при обрывах
            if (retryContext.previousRetryCount === 0) return 3000;
            if (retryContext.previousRetryCount < 3) return 5000;
            return 10000;
          },
        })
        .build();

      await this.connection.start();
      this.isConnecting = false;
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Отключиться от SignalR Hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  /**
   * Проверить, подключен ли клиент
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Получить текущее состояние подключения
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  /**
   * Начать подбор психолога
   */
  async startMatching(userId?: string): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }

    if (this.connection?.state !== signalR.HubConnectionState.Connected) {
      throw new Error("Not connected to SignalR hub");
    }

    if (userId) {
      await this.connection.invoke("StartMatching", userId);
    } else {
      await this.connection.invoke("StartMatching");
    }
  }

  /**
   * Отправить сообщение
   */
  async sendMessage(
    message: string,
    messageHistory?: MessageHistoryItem[]
  ): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }

    if (this.connection?.state !== signalR.HubConnectionState.Connected) {
      throw new Error("Not connected to SignalR hub");
    }

    if (messageHistory) {
      await this.connection.invoke("SendMessage", message, messageHistory);
    } else {
      await this.connection.invoke("SendMessage", message);
    }
  }

  /**
   * Получить доступные времена
   */
  async getAvailableTimes(psychologistId: string, date: Date): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }

    if (this.connection?.state !== signalR.HubConnectionState.Connected) {
      throw new Error("Not connected to SignalR hub");
    }

    await this.connection.invoke("GetAvailableTimes", psychologistId, date);
  }

  /**
   * Присоединиться к сессии
   */
  async joinSession(sessionId: string): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }

    if (this.connection?.state !== signalR.HubConnectionState.Connected) {
      throw new Error("Not connected to SignalR hub");
    }

    await this.connection.invoke("JoinSession", sessionId);
  }

  /**
   * Покинуть сессию
   */
  async leaveSession(sessionId: string): Promise<void> {
    if (!this.connection) {
      return;
    }

    if (this.connection?.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    await this.connection.invoke("LeaveSession", sessionId);
  }

  /**
   * Подписаться на событие получения сообщения
   */
  onMessageReceived(callback: (data: MessageReceivedData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on("MessageReceived", callback);
  }

  /**
   * Отписаться от события получения сообщения
   */
  offMessageReceived(callback: (data: MessageReceivedData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.off("MessageReceived", callback);
  }

  /**
   * Подписаться на событие получения чанка сообщения (streaming)
   */
  onMessageChunk(callback: (data: MessageChunkData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on("MessageChunk", callback);
  }

  /**
   * Отписаться от события получения чанка сообщения
   */
  offMessageChunk(callback: (data: MessageChunkData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.off("MessageChunk", callback);
  }

  /**
   * Подписаться на событие завершения сообщения (streaming)
   */
  onMessageComplete(callback: (data: MessageCompleteData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on("MessageComplete", callback);
  }

  /**
   * Отписаться от события завершения сообщения
   */
  offMessageComplete(callback: (data: MessageCompleteData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.off("MessageComplete", callback);
  }

  /**
   * Подписаться на событие получения доступных времен
   */
  onAvailableTimesReceived(
    callback: (data: AvailableTimesReceivedData) => void
  ): void {
    if (!this.connection) {
      return;
    }

    this.connection.on("AvailableTimesReceived", callback);
  }

  /**
   * Отписаться от события получения доступных времен
   */
  offAvailableTimesReceived(
    callback: (data: AvailableTimesReceivedData) => void
  ): void {
    if (!this.connection) {
      return;
    }

    this.connection.off("AvailableTimesReceived", callback);
  }

  /**
   * Подписаться на событие ошибки
   */
  onError(callback: (error: ErrorData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on("Error", callback);
  }

  /**
   * Отписаться от события ошибки
   */
  offError(callback: (error: ErrorData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.off("Error", callback);
  }

  /**
   * Подписаться на событие присоединения к сессии
   */
  onSessionJoined(callback: (data: SessionJoinedData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on("SessionJoined", callback);
  }

  /**
   * Отписаться от события присоединения к сессии
   */
  offSessionJoined(callback: (data: SessionJoinedData) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.off("SessionJoined", callback);
  }
}

// Экспортируем singleton экземпляр
export const signalRService = new SignalRService();

