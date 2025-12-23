import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface PsychologistChatModalProps {
  open: boolean;
  onClose: () => void;
}

const PsychologistChatModal: React.FC<PsychologistChatModalProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Здравствуйте! Расскажите, пожалуйста, с чем вы хотели бы обратиться к психологу? Что вас беспокоит?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // TODO: Здесь будет запрос к бэкенду
    // Пока что просто имитируем ответ
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за информацию. Я записал ваши жалобы. Скоро мы подберем для вас подходящего психолога.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <div className="chat-modal__header">
          <h2>Подбор психолога</h2>
          <p className="chat-modal__subtitle">Расскажите о вашей проблеме</p>
        </div>
        <div className="chat-modal__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message chat-message--${message.sender}`}
            >
              <div className="chat-message__content">
                {message.text}
              </div>
              <div className="chat-message__time">
                {message.timestamp.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__content">
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
        <div className="chat-modal__input-container">
          <textarea
            ref={inputRef}
            className="chat-modal__input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Опишите вашу проблему..."
            rows={2}
            disabled={isLoading}
          />
          <button
            className="chat-modal__send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .chat-modal {
          background: #fff;
          border-radius: 16px;
          max-width: 600px;
          width: 90vw;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.05);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background 0.2s;
        }

        .modal-close:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .chat-modal__header {
          padding: 24px 24px 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .chat-modal__header h2 {
          margin: 0 0 4px 0;
          font-size: 1.5rem;
          color: #2d3748;
        }

        .chat-modal__subtitle {
          margin: 0;
          font-size: 0.875rem;
          color: #718096;
        }

        .chat-modal__messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 300px;
          max-height: calc(80vh - 200px);
        }

        .chat-message {
          display: flex;
          flex-direction: column;
          max-width: 75%;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-message--user {
          align-self: flex-end;
        }

        .chat-message--assistant {
          align-self: flex-start;
        }

        .chat-message__content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.9375rem;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .chat-message--user .chat-message__content {
          background: linear-gradient(135deg, #8263e8 0%, #667eea 100%);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .chat-message--assistant .chat-message__content {
          background: #f7fafc;
          color: #2d3748;
          border-bottom-left-radius: 4px;
        }

        .chat-message__time {
          font-size: 0.75rem;
          color: #a0aec0;
          margin-top: 4px;
          padding: 0 4px;
        }

        .chat-message--user .chat-message__time {
          text-align: right;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a0aec0;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .chat-modal__input-container {
          display: flex;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          background: #fff;
        }

        .chat-modal__input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 0.9375rem;
          font-family: inherit;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-modal__input:focus {
          border-color: #8263e8;
        }

        .chat-modal__input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
        }

        .chat-modal__send-btn {
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #8263e8 0%, #667eea 100%);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
          flex-shrink: 0;
        }

        .chat-modal__send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .chat-modal__send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .chat-modal__send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .chat-modal {
            width: 100vw;
            max-height: 100vh;
            border-radius: 0;
          }

          .chat-message {
            max-width: 85%;
          }

          .chat-modal__messages {
            max-height: calc(100vh - 200px);
          }
        }
      `}</style>
    </div>
  );
};

export default PsychologistChatModal;


