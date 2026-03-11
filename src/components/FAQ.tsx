import { useState } from 'react';

const FAQ = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveItem(activeItem === index ? null : index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(index);
    }
  };

  const faqData = [
    {
      question: 'Что насчет конфиденциальности?',
      answer: 'Мы гарантируем 100% конфиденциальность видеоконсультаций. Это означает, что никто не узнает о том, что было сказано на сессии — все остается строго между вами и терапевтом.',
    },
    {
      question: 'Работаете ли вы с детьми и подростками?',
      answer: 'Мы предоставляем консультации только для лиц, достигших 18-летнего возраста.',
    },
    {
      question: 'Можно ли взять одну консультацию, а потом приобрести пакет?',
      answer: 'Конечно! Вы можете начать с одной консультации, а потом решить, хотите ли продолжить. Оплачивать можно как отдельные сессии, так и пакеты со скидкой.',
    },
    {
      question: 'Можно ли менять психолога?',
      answer: 'Да, вы сами выбираете себе психолога. Если специалист не подошел, вы можете без проблем выбрать другого — мы поможем с подбором бесплатно.',
    },
    {
      question: 'Можно ли отменить или перенести сеанс?',
      answer: 'Вы можете отменить сессию, если уведомите нас за 12 часов до назначенного времени. При более поздней отмене оплата не возвращается.',
    },
    {
      question: 'Можно ли оставаться анонимным?',
      answer: 'Наша главная цель — обеспечить вашу комфортность и безопасность. Мы не требуем раскрывать реальное имя — вы можете представиться любым именем.',
    },
    {
      question: 'Что лучше: психолог онлайн или офлайн?',
      answer: 'Оба варианта одинаково эффективны. Ваш контакт с психологом, метод работы и мотивация влияют на результат терапии сильнее, чем формат проведения сессий.',
    },
    {
      question: 'Как понять, что мне нужен психолог?',
      answer: 'Если вам хочется просто поговорить с кем-то, этого уже достаточно. Запрос может быть любым — от тревоги и стресса до поиска внутреннего ресурса и самопознания.',
    },
  ];

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Часто задаваемые <span className="gradient-text">вопросы</span></h2>
          <p className="section-subtitle">
            Ответы на популярные вопросы о нашем сервисе
          </p>
        </div>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeItem === index ? 'active' : ''}`}
            >
              <div
                className="faq-question"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="button"
                tabIndex={0}
                aria-expanded={activeItem === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <h3>{item.question}</h3>
                <i className="fas fa-chevron-down" aria-hidden="true"></i>
              </div>
              <div
                className="faq-answer"
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
