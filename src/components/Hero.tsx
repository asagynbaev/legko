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
  const isUsingSignalR = useRef(false);

  useEffect(() => {
    // Инициализируем сессию при первой загрузке
    if (!isInitialized.current) {
      initializeSession();
      setupSignalRListeners();
      isInitialized.current = true;
    }
    
    // Cleanup при размонтировании
    return () => {
      if (isUsingSignalR.current) {
        signalRService.disconnect();
      }
    };
  }, []);

  const setupSignalRListeners = () => {
    // Обработка чанков сообщения (streaming)
    const handleMessageChunk = (data: { chunk: string }) => {
      // Если это первое сообщение (приветствие), создаем его
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
      
      // Прокручиваем контейнер при получении нового чанка
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    };

    // Обработка завершения сообщения
    const handleMessageComplete = (data: {
      message: string;
      sessionId: string;
      psychologistSuggestions?: PsychologistSuggestion[];
      bookingSuggestion?: BookingSuggestion;
    }) => {
      setIsLoading(false);
      
      // Создаем финальное сообщение
      const assistantMessage: Message = {
        id: currentStreamingMessageId || `assistant-${Date.now()}`,
        text: data.message,
        sender: 'assistant',
        psychologistSuggestions: data.psychologistSuggestions,
        bookingSuggestion: data.bookingSuggestion,
      };

      // Удаляем временное сообщение и добавляем финальное
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== currentStreamingMessageId);
        return [...filtered, assistantMessage];
      });

      setCurrentStreamingMessage('');
      setCurrentStreamingMessageId(null);
      setSessionId(data.sessionId);

      // Если есть предложение бронирования, автоматически создаем его
      if (data.bookingSuggestion && 
          data.bookingSuggestion.masterId &&
          data.bookingSuggestion.serviceIds &&
          data.bookingSuggestion.suggestedDate &&
          data.bookingSuggestion.suggestedTime &&
          data.bookingSuggestion.clientName &&
          data.bookingSuggestion.clientPhone) {
        handleCreateBooking(data.bookingSuggestion);
      }

      // Возвращаем фокус на поле ввода
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    // Обработка ошибок
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
    // Прокручиваем только контейнер чата, а не всю страницу
    if (messagesContainerRef.current) {
      // Используем requestAnimationFrame для более плавной прокрутки
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
      
      // Пытаемся подключиться к SignalR
      try {
        await signalRService.connect();
        isUsingSignalR.current = true;
        
        // Запускаем matching через SignalR
        await signalRService.startMatching();
        
        // Приветственное сообщение придет через MessageComplete
        // Пока показываем индикатор загрузки
      } catch (signalRErr) {
        console.warn('SignalR connection failed, falling back to REST API:', signalRErr);
        isUsingSignalR.current = false;
        
        // Fallback на REST API
        const response = await startMatching();
        
        if (response.code === 200 && response.message) {
          setSessionId(response.message.sessionId);
          
          // Добавляем приветственное сообщение
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
      
      // Fallback сообщение
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
    if (trimmed.length === 0) {
      return 'Пожалуйста, введите сообщение';
    }
    if (trimmed.length < 3) {
      return 'Сообщение слишком короткое (минимум 3 символа)';
    }
    if (trimmed.length > 1000) {
      return 'Сообщение слишком длинное (максимум 1000 символов)';
    }
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
    
    // Возвращаем фокус на поле ввода
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // Создаем временное сообщение для streaming
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
        // Используем SignalR для streaming
        const messageHistory = getMessageHistory();
        await signalRService.sendMessage(messageText, messageHistory);
        // Ответ придет через события MessageChunk и MessageComplete
      } else {
        // Fallback на REST API
        const messageHistory = getMessageHistory();
        const response = await sendMessage(messageText, sessionId || undefined, undefined, messageHistory);
        
        if (response.code === 200 && response.message) {
          // Удаляем временное сообщение
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

          // Обновляем sessionId если он был возвращен
          if (response.message.sessionId) {
            setSessionId(response.message.sessionId);
          }

          setMessages((prev) => [...prev, assistantMessage]);
          
          // Возвращаем фокус на поле ввода после получения ответа
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);

          // Если есть предложение бронирования, автоматически создаем его
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
    } catch (err: any) {
      console.error('Failed to send message:', err);
      const errorText = err.message || 'Не удалось отправить сообщение. Пожалуйста, попробуйте еще раз.';
      setError(errorText);
      
      // Удаляем временное сообщение
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
      
      // Возвращаем фокус на поле ввода после завершения
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
      
      // Находим длительность услуги
      const serviceDuration = 60; // По умолчанию 60 минут, можно получить из services
      
      // Вычисляем endTime
      const [hours, minutes] = bookingSuggestion.suggestedTime.split(':').map(Number);
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
          text: `✅ Запись успешно создана! ID бронирования: ${bookingResponse.message.bookingId}. Мы свяжемся с вами для подтверждения.`,
          sender: 'assistant',
        };
        setMessages((prev) => [...prev, successMessage]);
      }
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      const errorMessage: Message = {
        id: `booking-error-${Date.now()}`,
        text: `❌ Не удалось создать запись: ${err.message || 'Произошла ошибка'}. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.`,
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
      <div className="hero__container container">
        {/* Левая часть - чат */}
        <div className="hero__chat">
          <div className="hero__chat-header">
            <div className="chat-header__info">
              <div className="chat-header__avatar" aria-hidden="true">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h2 className="chat-header__title">AI Помощник Legko</h2>
                <p className="chat-header__status">
                  {isLoading ? 'печатает...' : 'онлайн'}
                </p>
              </div>
            </div>
          </div>

          <div className="hero__chat-messages" ref={messagesContainerRef}>
            {messages.map((message) => {
              const isSuccess = message.text.includes('✅');
              const isError = message.text.includes('❌');
              const isStreaming = message.id === currentStreamingMessageId;
              const displayText = isStreaming ? currentStreamingMessage : message.text;
              
              return (
              <div key={message.id}>
                <div
                  className={`chat-message chat-message--${message.sender}`}
                >
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
                        {isStreaming && (
                          <span className="typing-cursor">|</span>
                        )}
                      </>
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
                
                {/* Отображаем рекомендации психологов */}
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
                          Посмотреть профиль →
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
            <textarea
              ref={inputRef}
              className={`hero__chat-input ${error ? 'hero__chat-input--error' : ''}`}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (error) setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Опишите вашу проблему..."
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

        {/* Правая часть - визуал */}
        <div className="hero__visual">
          <div className="hero__mascot-wrapper">
            <Image 
              src="/images/пушистик радость.png" 
              alt="Legko помощник" 
              width={525} 
              height={525} 
              className="hero__mascot-modern" 
              priority
            />
          </div>
          <div className="floating-elements">
            <div className="floating-card modern-card card-1">
              <div className="card-icon">💬</div>
              <span>Онлайн сессии</span>
            </div>
            <div className="floating-card modern-card card-2">
              <div className="card-icon">🔒</div>
              <span>Конфиденциально</span>
            </div>
            <div className="floating-card modern-card card-3">
              <div className="card-icon">⚡</div>
              <span>Быстрый подбор</span>
            </div>
          </div>
        </div>
      </div>
      <div className="modern-gradient modern-gradient--1"></div>
    </section>
  );
};

export default Hero;
