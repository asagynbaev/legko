const HowItWorks = () => (
  <section className="how-it-works" id="how-it-works">
    <div className="container">
      <div className="section-header">
        <div className="section-badge">
            <span className="modern-badge">
                <span className="badge-icon">🚀</span>
                Простой процесс
            </span>
        </div>
        <h2 className="section-title">Как найти <span className="gradient-text">своего психолога</span> на Legko</h2>
        <p className="section-subtitle">4 простых шага до первой сессии</p>
      </div>
      <div className="process-flow">
        <div className="process-steps">
          <div className="process-step" data-step="1">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">01</div>
              </div>
              <div className="step-progress-line"></div>
            </div>
            <div className="step-content">
              <div className="step-badge">2 минуты</div>
              <h3 className="step-title">Заполните анкету</h3>
              <p className="step-description">Ответьте на вопросы о ваших потребностях и предпочтениях</p>
            </div>
          </div>
          <div className="process-step" data-step="2">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">02</div>
              </div>
              <div className="step-progress-line"></div>
            </div>
            <div className="step-content">
              <div className="step-badge">Мгновенно</div>
              <h3 className="step-title">Получите подборку</h3>
              <p className="step-description">Система найдет подходящих психологов под ваши критерии</p>
            </div>
          </div>
          <div className="process-step" data-step="3">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">03</div>
              </div>
              <div className="step-progress-line"></div>
            </div>
            <div className="step-content">
              <div className="step-badge">24/7</div>
              <h3 className="step-title">Забронируйте сессию</h3>
              <p className="step-description">Выберите психолога и удобное время для встречи</p>
            </div>
          </div>
          <div className="process-step" data-step="4">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">04</div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-badge">60 минут</div>
              <h3 className="step-title">Начинайте терапию</h3>
              <p className="step-description">Подключайтесь к сессии через безопасную платформу и получайте профессиональную помощь</p>
              <div className="step-features">
                <span className="feature-item">
                  <i className="fas fa-check"></i>
                  HD качество связи
                </span>
                <span className="feature-item">
                  <i className="fas fa-check"></i>
                  Полная конфиденциальность
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="process-guarantee">
      <div className="guarantee-card">
        <div className="guarantee-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div className="guarantee-content">
          <h4>Гарантия совместимости</h4>
          <p>Если психолог не подошел — подберем нового <strong>бесплатно</strong> или вернем деньги</p>
        </div>
        <div className="guarantee-badge">100%</div>
      </div>
    </div>
    <div className="process-cta">
      <a href="#" className="btn btn--primary btn--modern btn--large">
        <i className="fas fa-rocket"></i>
        Начать поиск психолога
        <i className="fas fa-arrow-right"></i>
      </a>
      <p className="cta-note"><strong>10% скидка</strong> на первую сессию</p>
    </div>
    </div>
  </section>
);

export default HowItWorks;
