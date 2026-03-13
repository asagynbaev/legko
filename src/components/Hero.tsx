'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { signalRService } from '../api/signalRService';
import { 
  startMatching, 
  sendMessage, 
  createBooking,
  type MessageHistoryItem,
  type PsychologistSuggestion,
  type BookingSuggestion,
  normalizePhone
} from '../api/psychologistMatchApi';

interface Message {
  id: string;
  text: string;
  sender: 'assistant' | 'user';
  psychologistSuggestions?: PsychologistSuggestion[];
  bookingSuggestion?: BookingSuggestion;
}

const Hero = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInitialized = useRef(false);
  const isInitializing = useRef(false);
  const isUsingSignalR = useRef(false);

  useEffect(() => {
    if (isInitialized.current || isInitializing.current) {
      return;
    }
    isInitializing.current = true;
    initializeSession().finally(() => {
      isInitialized.current = true;
      isInitializing.current = false;
    });

    return () => {
      isInitialized.current = false;
      if (isUsingSignalR.current) {
        signalRService.disconnect();
        isUsingSignalR.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupSignalRListeners = () => {
    const handleMessageChunk = (data: { chunk: string }) => {
      if (!currentStreamingMessageId && messages.length === 0) {
        const welcomeMessageId = `welcome-streaming-${Date.now()}`;
        setCurrentStreamingMessageId(welcomeMessageId);
        setCurrentStreamingMessage(data.chunk);
        
        const welcomeMessage: Message = {
          id: welcomeMessageId,
          text: '',
          sender: 'assistant',
        };
        setMessages([welcomeMessage]);
      } else {
        setCurrentStreamingMessage(prev => prev + data.chunk);
      }
      
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
      setIsLoading(false);
      
      const assistantMessage: Message = {
        id: currentStreamingMessageId || `assistant-${Date.now()}`,
        text: data.message,
        sender: 'assistant',
        psychologistSuggestions: data.psychologistSuggestions,
        bookingSuggestion: data.bookingSuggestion,
      };

      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== currentStreamingMessageId);
        return [...filtered, assistantMessage];
      });

      setCurrentStreamingMessage('');
      setCurrentStreamingMessageId(null);
      setSessionId(data.sessionId);

      if (data.bookingSuggestion && 
          data.bookingSuggestion.masterId &&
          data.bookingSuggestion.serviceIds &&
          data.bookingSuggestion.suggestedDate &&
          data.bookingSuggestion.suggestedTime &&
          data.bookingSuggestion.clientName &&
          data.bookingSuggestion.clientPhone) {
        handleCreateBooking(data.bookingSuggestion);
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    const handleError = (error: { message: string }) => {
      setIsLoading(false);
      setCurrentStreamingMessage('');
      setError(error.message);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Извините, произошла ошибка: ${error.message}`,
        sender: 'assistant',
      };
      
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== currentStreamingMessageId);
        return [...filtered, errorMessage];
      });
      
      setCurrentStreamingMessageId(null);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    signalRService.onMessageChunk(handleMessageChunk);
    signalRService.onMessageComplete(handleMessageComplete);
    signalRService.onError(handleError);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isLoading, currentStreamingMessage]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);

      const useRestOnly = process.env.NEXT_PUBLIC_USE_REST_ONLY === 'true';

      try {
        if (useRestOnly) throw new Error('REST only mode');
        await signalRService.connect();
        isUsingSignalR.current = true;
        setupSignalRListeners();
        await signalRService.startMatching();
      } catch (signalRErr) {
        isUsingSignalR.current = false;
        await signalRService.disconnect();
        if (process.env.NODE_ENV === 'development' && !useRestOnly) {
          console.info('Используем REST API (SignalR недоступен или отключён)');
        }
        
        const response = await startMatching();
        
        if (response.code === 200 && response.message) {
          setSessionId(response.message.sessionId);
          
          const welcomeMessage: Message = {
            id: `welcome-${Date.now()}`,
            text: response.message.message,
            sender: 'assistant',
          };
          setMessages([welcomeMessage]);
        }
      }
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setError('Не удалось подключиться к серверу. Пожалуйста, попробуйте позже.');
      
      const fallbackMessage: Message = {
        id: `fallback-${Date.now()}`,
        text: 'Привет! Я помогу тебе подобрать подходящего психолога. Расскажи, с какой ситуацией или проблемой ты хочешь обратиться?',
        sender: 'assistant',
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
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
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    const streamingMessageId = `streaming-${Date.now()}`;
    setCurrentStreamingMessageId(streamingMessageId);
    setCurrentStreamingMessage('');
    
    const streamingMessage: Message = {
      id: streamingMessageId,
      text: '',
      sender: 'assistant',
    };
    setMessages((prev) => [...prev, streamingMessage]);

    try {
      if (isUsingSignalR.current && signalRService.isConnected()) {
        const messageHistory = getMessageHistory();
        await signalRService.sendMessage(messageText, messageHistory);
      } else {
        const messageHistory = getMessageHistory();
        const response = await sendMessage(messageText, sessionId || undefined, undefined, messageHistory);
        
        if (response.code === 200 && response.message) {
          setMessages((prev) => prev.filter(msg => msg.id !== streamingMessageId));
          setCurrentStreamingMessageId(null);
          setCurrentStreamingMessage('');
          
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            text: response.message.message,
            sender: 'assistant',
            psychologistSuggestions: response.message.psychologistSuggestions,
            bookingSuggestion: response.message.bookingSuggestion,
          };

          if (response.message.sessionId) {
            setSessionId(response.message.sessionId);
          }

          setMessages((prev) => [...prev, assistantMessage]);
          
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);

          if (response.message.bookingSuggestion && 
              response.message.bookingSuggestion.masterId &&
              response.message.bookingSuggestion.serviceIds &&
              response.message.bookingSuggestion.suggestedDate &&
              response.message.bookingSuggestion.suggestedTime &&
              response.message.bookingSuggestion.clientName &&
              response.message.bookingSuggestion.clientPhone) {
            await handleCreateBooking(response.message.bookingSuggestion);
          }
          
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to send message:', err);
      const errorText = err instanceof Error ? err.message : 'Не удалось отправить сообщение. Пожалуйста, попробуйте еще раз.';
      setError(errorText);
      
      setMessages((prev) => prev.filter(msg => msg.id !== streamingMessageId));
      setCurrentStreamingMessageId(null);
      setCurrentStreamingMessage('');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Извините, произошла ошибка: ${errorText}`,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleCreateBooking = async (bookingSuggestion: BookingSuggestion) => {
    if (!bookingSuggestion.masterId || 
        !bookingSuggestion.serviceIds || 
        !bookingSuggestion.suggestedDate ||
        !bookingSuggestion.suggestedTime ||
        !bookingSuggestion.clientName ||
        !bookingSuggestion.clientPhone) {
      return;
    }

    try {
      setIsLoading(true);
      const serviceDuration = 60;
      const startDate = new Date(`${bookingSuggestion.suggestedDate}T${bookingSuggestion.suggestedTime}`);
      const endDate = new Date(startDate.getTime() + serviceDuration * 60000);
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;

      const bookingResponse = await createBooking({
        masterId: bookingSuggestion.masterId,
        serviceIds: bookingSuggestion.serviceIds,
        appointmentDate: bookingSuggestion.suggestedDate,
        startTime: bookingSuggestion.suggestedTime,
        endTime: endTime,
        name: bookingSuggestion.clientName,
        phone: normalizePhone(bookingSuggestion.clientPhone),
        note: bookingSuggestion.note,
      });

      if (bookingResponse.code === 200) {
        const successMessage: Message = {
          id: `booking-success-${Date.now()}`,
          text: `Запись успешно создана! ID бронирования: ${bookingResponse.message.bookingId}. Мы свяжемся с вами для подтверждения.`,
          sender: 'assistant',
        };
        setMessages((prev) => [...prev, successMessage]);
      }
    } catch (err: unknown) {
      console.error('Failed to create booking:', err);
      const errorMessage: Message = {
        id: `booking-error-${Date.now()}`,
        text: `Не удалось создать запись: ${err instanceof Error ? err.message : 'Произошла ошибка'}. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.`,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  return (
    <section className="hero hero--chat">
      {/* Hero headline */}
      <div className="hero__top container">
        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          Онлайн и офлайн консультации с проверенными психологами
        </div>
        <h1 className="hero__title">
          Пройдите подбор и найдите <span className="hero__title-accent">своего психолога</span>
        </h1>
        <p className="hero__subtitle">
          Расскажите немного о том, что вас беспокоит. Наш помощник Элли поможет понять ваш запрос и предложит психологов, которые работают с такими ситуациями
        </p>
      </div>

      <div className="hero__container container">
        {/* Left - AI Chat */}
        <div className="hero__chat">
          <div className="hero__chat-header">
            <div className="chat-header__info">
              <div className="chat-header__avatar" aria-hidden="true">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h2 className="chat-header__title">Элли</h2>
                <p className="chat-header__status">
                  {isLoading ? 'печатает...' : 'онлайн'}
                </p>
              </div>
            </div>
          </div>

          <div className="hero__chat-messages" ref={messagesContainerRef}>
            {messages.map((message) => {
              const isSuccess = message.text.includes('\u2705');
              const isError = message.text.includes('\u274C');
              const isStreaming = message.id === currentStreamingMessageId;
              const displayText = isStreaming ? currentStreamingMessage : message.text;
              
              return (
                <div key={message.id}>
                  <div className={`chat-message chat-message--${message.sender}`}>
                    <div className={`chat-message__bubble ${isSuccess ? 'chat-message__bubble--success' : ''} ${isError ? 'chat-message__bubble--error' : ''}`}>
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
                              code: ({ children }) => <code className="markdown-code">{children}</code>,
                              h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
                              h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
                              h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
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
                      {message.psychologistSuggestions.map((psychologist) => (
                        <div key={psychologist.psychologistId} className="psychologist-card">
                          <div className="psychologist-card__header">
                            <h4 className="psychologist-card__name">{psychologist.name}</h4>
                            <div className="psychologist-card__rating">
                              <i className="fas fa-star"></i>
                              <span>{psychologist.rating}</span>
                            </div>
                          </div>
                          <p className="psychologist-card__speciality">{psychologist.speciality}</p>
                          {psychologist.reason && (
                            <p className="psychologist-card__reason">{psychologist.reason}</p>
                          )}
                          <div className="psychologist-card__info">
                            <span>Опыт: {psychologist.experience} лет</span>
                            <span>Клиентов: {psychologist.numberOfClients}</span>
                          </div>
                          {psychologist.services.length > 0 && (
                            <div className="psychologist-card__services">
                              {psychologist.services.map((service) => (
                                <div key={service.serviceId} className="service-item">
                                  <span className="service-name">{service.serviceName}</span>
                                  <span className="service-price">{service.price} сом</span>
                                  <span className="service-duration">{service.durationMinutes} мин</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <Link 
                            href={`/staff?psychologist=${psychologist.psychologistId}`}
                            className="psychologist-card__link"
                          >
                            Посмотреть профиль <i className="fas fa-arrow-right"></i>
                          </Link>
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
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="hero__chat-input-container">
            {error && (
              <div className="chat-input-error" role="alert" aria-live="polite">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}
            <div className="hero__chat-input-wrapper">
              <textarea
                ref={inputRef}
                className={`hero__chat-input ${error ? 'hero__chat-input--error' : ''}`}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (error) setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Опишите вашу ситуацию..."
                rows={2}
                disabled={isLoading}
                aria-label="Поле ввода сообщения"
                aria-describedby="chat-input-hint"
                aria-invalid={!!error}
                maxLength={1000}
              />
              <span id="chat-input-hint" className="sr-only">Введите ваше сообщение и нажмите Enter для отправки</span>
              <button
                className="hero__chat-send"
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

        {/* Right - Visual */}
        <div className="hero__visual">
          <div className="hero__mascot-wrapper">
            <Image 
              src="/images/пушистик радость.png" 
              alt="Элли" 
              width={525} 
              height={525} 
              className="hero__mascot-modern" 
              priority
            />
          </div>
          <div className="floating-elements">
            <div className="floating-card card-1">
              <div className="card-icon">💬</div>
              <span>Онлайн сессии</span>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🔒</div>
              <span>Конфиденциально</span>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">⚡</div>
              <span>Быстрый подбор</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="hero__stats container">
        <div className="hero__stat">
          <div className="hero__stat-value">1200+</div>
          <div className="hero__stat-label">проведенных сессий</div>
        </div>
        <div className="hero__stat">
          <div className="hero__stat-value">4.9/5</div>
          <div className="hero__stat-label">средняя оценка</div>
        </div>
        <div className="hero__stat">
          <div className="hero__stat-value">11+</div>
          <div className="hero__stat-label">направлений работы</div>
        </div>
        <div className="hero__stat">
          <div className="hero__stat-value">от 1500 с</div>
          <div className="hero__stat-label">за сессию</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
