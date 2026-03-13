const Benefits = () => (
  <section className="benefits" id="benefits">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Почему выбирают <span className="gradient-text">Legko</span></h2>
        <p className="section-subtitle">
          Мы делаем психологическую помощь доступной и удобной для каждого
        </p>
      </div>
      <div className="benefits-grid">
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-brain"></i>
          </div>
          <div>
            <h3 className="benefit-card__title">AI-подбор за 2 минуты</h3>
            <p className="benefit-card__description">
              Умный алгоритм проанализирует ваш запрос и подберет идеального специалиста
            </p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div>
            <h3 className="benefit-card__title">Проверенные психологи</h3>
            <p className="benefit-card__description">
              Все специалисты проходят строгий отбор и подтверждают образование и практику
            </p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-lock"></i>
          </div>
          <div>
            <h3 className="benefit-card__title">100% конфиденциальность</h3>
            <p className="benefit-card__description">
              Ваши данные под надежной защитой, все сессии полностью анонимны
            </p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div>
            <h3 className="benefit-card__title">Удобное расписание</h3>
            <p className="benefit-card__description">
              Записывайтесь на сессии в любое время, включая вечера и выходные
            </p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-tag"></i>
          </div>
          <div>
            <h3 className="benefit-card__title">Прозрачные цены</h3>
            <p className="benefit-card__description">
              Вы можете выбрать специалиста под свой комфортный бюджет.
            </p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-globe"></i>
          </div>
          <div>
            <h3 className="benefit-card__title">Культурная чувствительность</h3>
            <p className="benefit-card__description">
              Наши специалисты работают с людьми из Кыргызстана и понимают культурные особенности. Консультации на 3 языках: кыргызский, русский и английский
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Benefits;
