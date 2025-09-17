import Image from 'next/image';

const FirstSession = () => (
  <section className="first-session">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Чего ждать от первой сессии?</h2>
        <p className="section-subtitle">Знание того, что произойдет, поможет вам чувствовать себя более уверенно</p>
      </div>
      <div className="session-content">
        <div className="session-visual">
          <div className="session-mockup">
            <div className="mockup-header">
              <div className="mockup-controls">
                <div className="control"></div>
                <div className="control"></div>
                <div className="control"></div>
              </div>
              <span className="mockup-title">Видеосессия с психологом</span>
            </div>
            <div className="mockup-content">
              <div className="video-participant">
                <Image src="/images/пушистик обьятия.png" alt="Психолог" width={80} height={80} className="participant-avatar" />
                <span className="participant-name">Ваш психолог</span>
              </div>
              <div className="video-participant video-participant--you">
                <Image src="/images/пушистик радость.png" alt="Вы" width={80} height={80} className="participant-avatar" />
                <span className="participant-name">Вы</span>
              </div>
            </div>
            <div className="mockup-footer">
              <div className="session-duration">
                <i className="fas fa-clock"></i>
                <span>60 минут</span>
              </div>
            </div>
          </div>
        </div>
        <div className="session-steps">
          <h3 className="session-steps-title">Что происходит на первой сессии:</h3>
          <div className="session-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Познакомитесь с терапевтом</h4>
              <p>Психолог расскажет о себе, своем подходе и ответит на ваши вопросы о процессе терапии</p>
            </div>
          </div>
          <div className="session-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Уточните запрос и наметите план</h4>
              <p>Вместе определите цели терапии и составите план работы под ваши потребности</p>
            </div>
          </div>
          <div className="session-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Поделитесь эмоциями и чувствами</h4>
              <p>В безопасной обстановке расскажите о том, что вас беспокоит, без страха осуждения</p>
            </div>
          </div>
          <div className="session-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Получите поддержку и понимание</h4>
              <p>Почувствуете облегчение и получите первые инсайты о своей ситуации</p>
            </div>
          </div>
          <div className="session-guarantee">
            <div className="guarantee-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="guarantee-content">
              <h4>Гарантия комфорта</h4>
              <p>Если психолог вам не подошел — мы подберем другого специалиста <strong>бесплатно</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FirstSession;
