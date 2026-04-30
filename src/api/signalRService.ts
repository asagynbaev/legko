import * as signalR from "@microsoft/signalr";
import { config } from "@/config/env";
import type {
  MessageHistoryItem,
  PsychologistSuggestion,
  BookingSuggestion,
} from "./psychologistMatchApi";

const HUB_URL = config.signalrHubUrl;

export interface MessageChunkData {
  chunk: string;
}

export interface MessageCompleteData {
  message: string;
  sessionId: string;
  psychologistSuggestions?: PsychologistSuggestion[];
  bookingSuggestion?: BookingSuggestion;
}

export interface ErrorData {
  message: string;
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
          headers: { "Accept-Language": "ru" },
          // Только WebSockets — SSE и long polling на бэкенде дают 404
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
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

}

// Экспортируем singleton экземпляр
export const signalRService = new SignalRService();

