'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'assistant' | 'user';
  isTyping?: boolean;
}

const Hero = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const initialMessages = [
    'Привет! 👋 Я AI-помощник Legko.',
    'Я помогу вам найти идеального психолога за 2 минуты.',
    'Расскажите, пожалуйста, с чем вы хотели бы обратиться? Что вас беспокоит?',
  ];

  useEffect(() => {
    // Запускаем анимацию первого сообщения при загрузке
    const timer = setTimeout(() => {
      startTypingAnimation(0);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Прокручиваем только контейнер чата, а не всю страницу
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const startTypingAnimation = (messageIndex: number) => {
    if (messageIndex >= initialMessages.length) return;

    setIsTyping(true);
    setCurrentTypingIndex(0);

    const message = initialMessages[messageIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < message.length) {
        setCurrentTypingIndex(charIndex + 1);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Добавляем сообщение в массив
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-${messageIndex}`,
            text: message,
            sender: 'assistant',
          },
        ]);

        // Запускаем следующее сообщение с задержкой
        if (messageIndex < initialMessages.length - 1) {
          setTimeout(() => {
            startTypingAnimation(messageIndex + 1);
          }, 800);
        }
      }
    }, 30); // Скорость печатания
  };

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // TODO: Здесь будет запрос к бэкенду
    // Пока что просто показываем ответ
    setTimeout(() => {
      setIsTyping(true);
      setCurrentTypingIndex(0);
      
      const response = 'Спасибо за информацию! Я записал ваши жалобы. Сейчас подберу для вас подходящего психолога...';
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < response.length) {
          setCurrentTypingIndex(charIndex + 1);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              text: response,
              sender: 'assistant',
            },
          ]);
        }
      }, 30);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentTypingText = isTyping && currentTypingIndex > 0
    ? initialMessages.find((_, idx) => 
        messages.filter(m => m.sender === 'assistant').length === idx
      )?.substring(0, currentTypingIndex) || ''
    : '';

  return (
    <section className="hero hero--chat">
      <div className="hero__container container">
        {/* Левая часть - чат */}
        <div className="hero__chat">
          <div className="hero__chat-header">
            <div className="chat-header__info">
              <div className="chat-header__avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h2 className="chat-header__title">AI Помощник Legko</h2>
                <p className="chat-header__status">
                  {isTyping ? 'печатает...' : 'онлайн'}
                </p>
              </div>
            </div>
          </div>

          <div className="hero__chat-messages" ref={messagesContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message chat-message--${message.sender}`}
              >
                <div className="chat-message__bubble">
                  {message.text}
                </div>
              </div>
            ))}
            
            {isTyping && currentTypingText && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-message__bubble">
                  {currentTypingText}
                  <span className="typing-cursor">|</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="hero__chat-input-container">
            <textarea
              ref={inputRef}
              className="hero__chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Опишите вашу проблему..."
              rows={2}
              disabled={isTyping}
            />
            <button
              className="hero__chat-send"
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
            >
              <i className="fas fa-paper-plane"></i>
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
