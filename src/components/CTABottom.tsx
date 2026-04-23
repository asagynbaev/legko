const CTABottom = () => (
  <section className="cta-bottom-section">
    <div className="cta-background-pattern"></div>
    <div className="container">
      <div className="cta-bottom-content">
        <div className="cta-mascots-wrapper">
          <img src="/images/пушистик удивление.png" alt="" className="cta-mascot" />
          <img src="/images/пушистик влюбленность.png" alt="" className="cta-mascot" />
          <img src="/images/пушистик расслабление.png" alt="" className="cta-mascot cta-mascot--center" />
          <img src="/images/пушистик нежность.png" alt="" className="cta-mascot" />
          <img src="/images/пушистик снеснение.png" alt="" className="cta-mascot" />
        </div>

        <div className="cta-text-content">
          <h2 className="cta-bottom-title">
            Иногда достаточно одного разговора,<br />чтобы стало легче.
          </h2>
          <p className="cta-bottom-description">
            Если вы чувствуете, что вам нужна поддержка, мы рядом.
          </p>
        </div>

        <div className="cta-action-wrapper">
          <div className="cta-offer-badge">
            <i className="fas fa-gift"></i>
            <span>Первая консультация со скидкой 10%</span>
          </div>

          <div className="cta-buttons-group">
            <a
              href="https://t.me/legko_psychology"
              className="btn btn--cta-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-telegram"></i>
              <span>Написать в Telegram</span>
            </a>
            <a
              href="https://wa.me/996700595393"
              className="btn btn--cta-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
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
