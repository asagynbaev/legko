'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { signalRService } from '../api/signalRService';
import {
  startMatching,
  sendMessage,
  type MessageHistoryItem,
  type PsychologistSuggestion,
  type BookingSuggestion,
  normalizePhone
} from '../api/psychologistMatchApi';
import { createPartnerBooking, getPartnerMasterSlots } from '../api/partnerApi';

interface Message {
  id: string;
  text: string;
  sender: 'assistant' | 'user';
  psychologistSuggestions?: PsychologistSuggestion[];
  bookingSuggestion?: BookingSuggestion;
}

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

const ChatModal = ({ open, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInitialized = useRef(false);
  const isUsingSignalR = useRef(false);
  const mountedRef = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleMessageChunkRef = useRef<(data: { chunk: string }) => void>(() => {});
  const handleMessageCompleteRef = useRef<(data: {
    message: string;
    sessionId: string;
    psychologistSuggestions?: PsychologistSuggestion[];
    bookingSuggestion?: BookingSuggestion;
  }) => void>(() => {});
  const handleErrorRef = useRef<(error: { message: string }) => void>(() => {});

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Инициализация при открытии
  useEffect(() => {
    if (!open) return;
    mountedRef.current = true;

    if (!isInitialized.current) {
      isInitialized.current = true;
      initializeSession();
    }

    safeTimeout(() => inputRef.current?.focus(), 100);

    return () => {
      // Не сбрасываем при закрытии — сохраняем сессию
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      abortControllerRef.current?.abort();

      if (isUsingSignalR.current) {
        signalRService.offMessageChunk(handleMessageChunkRef.current);
        signalRService.offMessageComplete(handleMessageCompleteRef.current);
        signalRService.offError(handleErrorRef.current);
        signalRService.disconnect();
        isUsingSignalR.current = false;
      }
    };
  }, []);

  // ESC для закрытия
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Скролл при новых сообщениях
  useEffect(() => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isLoading, currentStreamingMessage]);

  const setupSignalRListeners = () => {
    const handleMessageChunk = (data: { chunk: string }) => {
      if (!mountedRef.current) return;
      setCurrentStreamingMessageId(prev => {
        if (!prev) {
          const id = `modal-welcome-${Date.now()}`;
          setCurrentStreamingMessage(data.chunk);
          setMessages(msgs => msgs.length === 0 ? [{ id, text: '', sender: 'assistant' }] : msgs);
          return id;
        }
        setCurrentStreamingMessage(p => p + data.chunk);
        return prev;
      });
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    };

    const handleMessageComplete = (data: {
      message: string;
      sessionId: string;
      psychologistSuggestions?: PsychologistSuggestion[];
      bookingSuggestion?: BookingSuggestion;
    }) => {
      if (!mountedRef.current) return;
      setIsLoading(false);
      setCurrentStreamingMessageId(prevId => {
        const msg: Message = {
          id: prevId || `modal-assistant-${Date.now()}`,
          text: data.message,
          sender: 'assistant',
          psychologistSuggestions: data.psychologistSuggestions,
          bookingSuggestion: data.bookingSuggestion,
        };
        setMessages(prev => [...prev.filter(m => m.id !== prevId), msg]);
        return null;
      });
      setCurrentStreamingMessage('');
      setSessionId(data.sessionId);

      if (data.bookingSuggestion?.masterId && data.bookingSuggestion?.serviceIds &&
          data.bookingSuggestion?.suggestedDate && data.bookingSuggestion?.suggestedTime &&
          data.bookingSuggestion?.clientName && data.bookingSuggestion?.clientPhone) {
        handleCreateBooking(data.bookingSuggestion);
      }
      safeTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleError = (err: { message: string }) => {
      if (!mountedRef.current) return;
      setIsLoading(false);
      setCurrentStreamingMessage('');
      setError(err.message);
      setCurrentStreamingMessageId(prevId => {
        setMessages(prev => [
          ...prev.filter(m => m.id !== prevId),
          { id: `modal-error-${Date.now()}`, text: `Извините, произошла ошибка: ${err.message}`, sender: 'assistant' },
        ]);
        return null;
      });
      safeTimeout(() => inputRef.current?.focus(), 100);
    };

    handleMessageChunkRef.current = handleMessageChunk;
    handleMessageCompleteRef.current = handleMessageComplete;
    handleErrorRef.current = handleError;

    signalRService.onMessageChunk(handleMessageChunk);
    signalRService.onMessageComplete(handleMessageComplete);
    signalRService.onError(handleError);
  };

  const initializeSession = async () => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      const useRestOnly = process.env.NEXT_PUBLIC_USE_REST_ONLY === 'true';

      try {
        if (useRestOnly) throw new Error('REST only mode');
        await signalRService.connect();
        isUsingSignalR.current = true;
        setupSignalRListeners();
        await signalRService.startMatching();
      } catch {
        isUsingSignalR.current = false;
        await signalRService.disconnect();

        const response = await startMatching(undefined, controller.signal);
        if (!mountedRef.current) return;

        if (response.code === 200 && response.message) {
          setSessionId(response.message.sessionId);
          setMessages([{
            id: `modal-welcome-${Date.now()}`,
            text: response.message.message,
            sender: 'assistant',
          }]);
        }
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError('Не удалось подключиться к серверу.');
      setMessages([{
        id: `modal-fallback-${Date.now()}`,
        text: 'Привет! Я помогу тебе подобрать подходящего психолога. Расскажи, с какой ситуацией или проблемой ты хочешь обратиться?',
        sender: 'assistant',
      }]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    }
  };

  const validateInput = (text: string): string | null => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return 'Пожалуйста, введите сообщение';
    if (trimmed.length < 3) return 'Сообщение слишком короткое (минимум 3 символа)';
    if (trimmed.length > 1000) return 'Сообщение слишком длинное (максимум 1000 символов)';
    return null;
  };

  const getMessageHistory = (): MessageHistoryItem[] => {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
      timestamp: new Date().toISOString(),
    }));
  };

  const handleSend = async () => {
    if (isLoading) return;
    const validationError = validateInput(inputText);
    if (validationError) {
      setError(validationError);
      safeTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    const userMessage: Message = { id: `modal-user-${Date.now()}`, text: inputText.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    const streamingId = `modal-streaming-${Date.now()}`;
    setCurrentStreamingMessageId(streamingId);
    setCurrentStreamingMessage('');
    setMessages(prev => [...prev, { id: streamingId, text: '', sender: 'assistant' }]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isUsingSignalR.current && signalRService.isConnected()) {
        await signalRService.sendMessage(messageText, getMessageHistory());
      } else {
        const response = await sendMessage(messageText, sessionId || undefined, undefined, getMessageHistory(), controller.signal);
        if (!mountedRef.current) return;

        if (response.code === 200 && response.message) {
          setMessages(prev => prev.filter(m => m.id !== streamingId));
          setCurrentStreamingMessageId(null);
          setCurrentStreamingMessage('');

          const assistantMsg: Message = {
            id: `modal-assistant-${Date.now()}`,
            text: response.message.message,
            sender: 'assistant',
            psychologistSuggestions: response.message.psychologistSuggestions,
            bookingSuggestion: response.message.bookingSuggestion,
          };

          if (response.message.sessionId) setSessionId(response.message.sessionId);
          setMessages(prev => [...prev, assistantMsg]);

          if (response.message.bookingSuggestion?.masterId && response.message.bookingSuggestion?.serviceIds &&
              response.message.bookingSuggestion?.suggestedDate && response.message.bookingSuggestion?.suggestedTime &&
              response.message.bookingSuggestion?.clientName && response.message.bookingSuggestion?.clientPhone) {
            await handleCreateBooking(response.message.bookingSuggestion);
          }
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const errorText = err instanceof Error ? err.message : 'Не удалось отправить сообщение.';
      setError(errorText);
      setMessages(prev => prev.filter(m => m.id !== streamingId));
      setCurrentStreamingMessageId(null);
      setCurrentStreamingMessage('');
      setMessages(prev => [...prev, { id: `modal-error-${Date.now()}`, text: `Ошибка: ${errorText}`, sender: 'assistant' }]);
      setIsLoading(false);
    }
  };

  const handleCreateBooking = async (bs: BookingSuggestion) => {
    if (!bs.masterId || !bs.serviceIds || !bs.suggestedDate || !bs.suggestedTime || !bs.clientName || !bs.clientPhone) return;
    try {
      setIsLoading(true);
      const start = new Date(`${bs.suggestedDate}T${bs.suggestedTime}`);
      const end = new Date(start.getTime() + 60 * 60000);
      const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}:00`;

      const res = await createPartnerBooking({
        masterId: bs.masterId,
        serviceIds: bs.serviceIds,
        appointmentDate: bs.suggestedDate,
        startTime: bs.suggestedTime,
        endTime,
        clientName: bs.clientName,
        clientPhone: normalizePhone(bs.clientPhone),
        note: bs.note,
      });

      if (res.code === 200) {
        const d = res.data;
        let confirmText = `Запись подтверждена! Вы записаны к ${d.masterName} на ${d.appointmentDate} в ${d.startTime}.`;
        if (d.address) confirmText += `\n\nАдрес: ${d.address}`;
        if (d.meetingLink) confirmText += `\n\nСсылка на встречу: ${d.meetingLink}`;
        confirmText += '\n\nДля подтверждения записи необходимо внести оплату:\nНомер счета: 1030120001878394\nПолучатель: ОсОО «Живи Легко»\n\nПри отмене менее чем за сутки оплата не возвращается.';

        setMessages(prev => [...prev, {
          id: `modal-booking-${Date.now()}`,
          text: confirmText,
          sender: 'assistant',
        }]);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Ошибка';
      if (errMsg.includes('409') || errMsg.toLowerCase().includes('занят')) {
        setMessages(prev => [...prev, {
          id: `modal-booking-err-${Date.now()}`,
          text: 'К сожалению, этот слот уже занят. Попробуйте выбрать другое время.',
          sender: 'assistant',
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `modal-booking-err-${Date.now()}`,
          text: `Не удалось создать запись: ${errMsg}. Попробуйте ещё раз.`,
          sender: 'assistant',
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowSlots = async (psychologistId: string, psychologistName: string) => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const res = await getPartnerMasterSlots(psychologistId, today, 7);

      if (res.code === 200 && res.data) {
        const days = Object.entries(res.data).filter(([, slots]) => slots.length > 0);
        if (days.length === 0) {
          setMessages(prev => [...prev, {
            id: `modal-slots-${Date.now()}`,
            text: `К сожалению, у ${psychologistName} нет свободных окошек на ближайшую неделю. Попробуйте выбрать другого специалиста.`,
            sender: 'assistant',
          }]);
        } else {
          const slotsText = days.map(([date, slots]) => {
            const d = new Date(date);
            const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
            return `**${dayName}**: ${slots.join(', ')}`;
          }).join('\n');

          setMessages(prev => [...prev, {
            id: `modal-slots-${Date.now()}`,
            text: `Свободные окошки у ${psychologistName}:\n\n${slotsText}\n\nНапишите удобное время, и я запишу вас.`,
            sender: 'assistant',
          }]);
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        id: `modal-slots-err-${Date.now()}`,
        text: 'Не удалось загрузить расписание. Попробуйте позже.',
        sender: 'assistant',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-window" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Чат с Элли">
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-header__info">
            <div className="chat-header__avatar" aria-hidden="true">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h2 className="chat-header__title">Элли</h2>
              <p className="chat-header__status">{isLoading ? 'печатает...' : 'онлайн'}</p>
            </div>
          </div>
          <button className="chat-modal-close" onClick={onClose} aria-label="Закрыть" type="button">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-modal-messages" ref={messagesContainerRef} role="log" aria-live="polite">
          {messages.map(message => {
            const isStreaming = message.id === currentStreamingMessageId;
            const displayText = isStreaming ? currentStreamingMessage : message.text;

            return (
              <div key={message.id}>
                <div className={`chat-message chat-message--${message.sender}`}>
                  <div className="chat-message__bubble">
                    {message.sender === 'assistant' ? (
                      <>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="markdown-paragraph">{children}</p>,
                            ul: ({ children }) => <ul className="markdown-list">{children}</ul>,
                            ol: ({ children }) => <ol className="markdown-list markdown-list--numbered">{children}</ol>,
                            li: ({ children }) => <li className="markdown-list-item">{children}</li>,
                            strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
                            em: ({ children }) => <em className="markdown-em">{children}</em>,
                          }}
                        >
                          {displayText || (isStreaming ? '' : message.text)}
                        </ReactMarkdown>
                        {isStreaming && <span className="typing-cursor">|</span>}
                      </>
                    ) : (
                      message.text
                    )}
                  </div>
                </div>

                {message.psychologistSuggestions && message.psychologistSuggestions.length > 0 && (
                  <div className="psychologist-suggestions">
                    <h3 className="suggestions-title">Рекомендуемые психологи:</h3>
                    {message.psychologistSuggestions.map(p => (
                      <div key={p.psychologistId} className="psychologist-card">
                        <div className="psychologist-card__header">
                          <h4 className="psychologist-card__name">{p.name}</h4>
                          <div className="psychologist-card__rating">
                            <i className="fas fa-star"></i>
                            <span>{p.rating}</span>
                          </div>
                        </div>
                        <p className="psychologist-card__speciality">{p.speciality}</p>
                        {p.reason && <p className="psychologist-card__reason">{p.reason}</p>}
                        <div className="psychologist-card__info">
                          <span>Опыт: {p.experience} лет</span>
                          <span>Клиентов: {p.numberOfClients}</span>
                        </div>
                        {p.services.length > 0 && (
                          <div className="psychologist-card__services">
                            {p.services.map(s => (
                              <div key={s.serviceId} className="service-item">
                                <span className="service-name">{s.serviceName}</span>
                                <span className="service-price">{s.price} сом</span>
                                <span className="service-duration">{s.durationMinutes} мин</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="psychologist-card__actions">
                          <button
                            type="button"
                            className="psychologist-card__slots-btn"
                            onClick={() => handleShowSlots(p.psychologistId, p.name)}
                            disabled={isLoading}
                          >
                            <i className="fas fa-calendar-alt"></i> Показать слоты
                          </button>
                          <Link href={`/staff?psychologist=${p.psychologistId}`} className="psychologist-card__link" onClick={onClose}>
                            Посмотреть профиль <i className="fas fa-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && !currentStreamingMessageId && (
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__bubble">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-modal-input">
          {error && (
            <div className="chat-input-error" role="alert">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          <div className="chat-modal-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-modal-textarea"
              value={inputText}
              onChange={e => { setInputText(e.target.value); if (error) setError(null); }}
              onKeyPress={handleKeyPress}
              placeholder="Опишите вашу ситуацию..."
              rows={2}
              disabled={isLoading}
              aria-label="Поле ввода сообщения"
              maxLength={1000}
            />
            <button
              className="chat-modal-send"
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              aria-label="Отправить сообщение"
              type="button"
            >
              <i className="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
