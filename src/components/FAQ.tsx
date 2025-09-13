const FAQ = () => (
  <section className="faq" id="faq">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Часто задаваемые вопросы</h2>
        <p className="section-subtitle">Ответы на популярные вопросы о нашем сервисе</p>
      </div>
      <div className="faq-list">
        <div className="faq-item">
          <div className="faq-question">
            <h3>Что насчет конфиденциальности?</h3>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Мы гарантируем 100% конфиденциальность видеоконсультаций. Это означает, что никто не узнает о том, что было сказано на сессии, все остается строго между вами и терапевтом.</p>
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-question">
            <h3>Работаете ли вы с детьми и подростками?</h3>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Мы предоставляем консультации только для лиц, достигших 18-летнего возраста.</p>
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-question">
            <h3>Можно ли взять одну консультацию, а потом приобрести пакет?</h3>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Конечно, вы можете начать пробовать нашу работу, оплатив одну консультацию, после чего решить, хотите ли вы продолжить, выбрав пакет любого размера. Вы также можете оплачивать консультации по одной на протяжении всего терапевтического процесса или чередовать оплату пакетами с оплатой отдельных консультаций.</p>
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-question">
            <h3>Можно ли менять психолога?</h3>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Да, вы сами выбираете себе психолога. Вы работаете с тем психологом, которого выбрали. Если психолог вам не подошел, вы можете без проблем выбрать другого.</p>
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-question">
            <h3>Можно ли отменить или перенести сеанс?</h3>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Вы можете отменить сессию, если уведомите нас за 12 часов до назначенного времени. Если отмена происходит менее чем за 12 часов до сессии, считается, что сеанс уже запланирован и оплата не возвращается.</p>
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-question">
            <h3>Можно ли оставаться анонимным?</h3>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Наша главная цель - обеспечить полную комфортность и безопасность при получении консультаций. Поэтому мы не требуем от вас раскрывать своё реальное имя, если вы не хотите. Вы можете сообщить психологу своё настоящее имя, а также имеете возможность представиться другим именем.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
