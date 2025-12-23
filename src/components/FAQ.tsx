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
      question: "Что насчет конфиденциальности?",
      answer: "Мы гарантируем 100% конфиденциальность видеоконсультаций. Это означает, что никто не узнает о том, что было сказано на сессии, все остается строго между вами и терапевтом."
    },
    {
      question: "Работаете ли вы с детьми и подростками?",
      answer: "Мы предоставляем консультации только для лиц, достигших 18-летнего возраста."
    },
    {
      question: "Можно ли взять одну консультацию, а потом приобрести пакет?",
      answer: "Конечно, вы можете начать пробовать нашу работу, оплатив одну консультацию, после чего решить, хотите ли вы продолжить, выбрав пакет любого размера. Вы также можете оплачивать консультации по одной на протяжении всего терапевтического процесса или чередовать оплату пакетами с оплатой отдельных консультаций."
    },
    {
      question: "Можно ли менять психолога?",
      answer: "Да, вы сами выбираете себе психолога. Вы работаете с тем психологом, которого выбрали. Если психолог вам не подошел, вы можете без проблем выбрать другого."
    },
    {
      question: "Можно ли отменить или перенести сеанс?",
      answer: "Вы можете отменить сессию, если уведомите нас за 12 часов до назначенного времени. Если отмена происходит менее чем за 12 часов до сессии, считается, что сеанс уже запланирован и оплата не возвращается."
    },
    {
      question: "Можно ли оставаться анонимным?",
      answer: "Наша главная цель - обеспечить полную комфортность и безопасность при получении консультаций. Поэтому мы не требуем от вас раскрывать своё реальное имя, если вы не хотите. Вы можете сообщить психологу своё настоящее имя, а также имеете возможность представиться другим именем."
    }
  ];

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Часто задаваемые вопросы</h2>
          <p className="section-subtitle">Ответы на популярные вопросы о нашем сервисе</p>
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
