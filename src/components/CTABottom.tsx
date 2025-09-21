const CTABottom = () => (
  <section className="cta-bottom-section">
    <div className="cta-background-pattern"></div>
    <div className="container">
      <div className="cta-bottom-content">
        <div className="cta-icon-wrapper">
          <div className="cta-icon">
            <i className="fas fa-heart"></i>
          </div>
        </div>
        
        <div className="cta-text-content">
          <h2 className="cta-bottom-title">
            <span className="cta-highlight">Готовы начать путь</span>
            <br />к лучшей жизни?
          </h2>
          <p className="cta-bottom-description">
            Сделайте первый шаг к изменениям. Найдите своего психолога уже сегодня 
            и начните жить полной жизнью.
          </p>
        </div>

        <div className="cta-action-wrapper">
          <div className="cta-offer-badge">
            <i className="fas fa-gift"></i>
            <span>Первая консультация со скидкой 10%</span>
          </div>
          
          <div className="cta-buttons-group">
            <a href="/staff" className="btn btn--cta-primary">
              <i className="fas fa-search"></i>
              <span>Найти психолога</span>
              <div className="btn-shine"></div>
            </a>
            <a href="https://wa.me/996509339333" className="btn btn--cta-secondary" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
              <span>Написать в WhatsApp</span>
            </a>
          </div>

          <div className="cta-trust-indicators">
            <div className="trust-item">
              <i className="fas fa-shield-alt"></i>
              <span>100% конфиденциально</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-clock"></i>
              <span>Запись за 5 минут</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-certificate"></i>
              <span>Проверенные специалисты</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTABottom;
