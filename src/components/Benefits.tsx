const Benefits = () => (
  <section className="benefits" id="benefits">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Почему выбирают Legko</h2>
        <p className="section-subtitle">Мы делаем психологическую помощь доступной и удобной</p>
      </div>
      <div className="benefits-grid">
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-rocket"></i>
          </div>
          <h3 className="benefit-card__title">Быстрый подбор</h3>
          <p className="benefit-card__description">
            Найдем подходящего психолога за 5 минут на основе ваших ответов
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-medal"></i>
          </div>
          <h3 className="benefit-card__title">Проверенные специалисты</h3>
          <p className="benefit-card__description">
            Все психологи проходят строгий отбор и имеют соответствующее образование
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-lock"></i>
          </div>
          <h3 className="benefit-card__title">Полная конфиденциальность</h3>
          <p className="benefit-card__description">
            Ваши данные под надежной защитой, анонимность гарантирована
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-clock"></i>
          </div>
          <h3 className="benefit-card__title">Удобное расписание</h3>
          <p className="benefit-card__description">
            Бронируйте сессии в любое удобное время, включая вечера и выходные
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <h3 className="benefit-card__title">Прозрачные цены</h3>
          <p className="benefit-card__description">
            Никаких скрытых платежей, цены указаны заранее
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-card__icon">
            <i className="fas fa-headset"></i>
          </div>
          <h3 className="benefit-card__title">Поддержка 24/7</h3>
          <p className="benefit-card__description">
            Наша команда поддержки всегда готова помочь с любыми вопросами
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Benefits;
