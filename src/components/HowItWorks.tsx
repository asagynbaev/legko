import Link from 'next/link';

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
        <h2 className="section-title">
          Запишитесь на <span className="gradient-text">первую сессию</span>
        </h2>
        <p className="section-subtitle">
          4 простых шага до первой встречи с психологом
        </p>
      </div>

      <div className="process-flow">
        <div className="process-steps">
          <div className="process-step">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">01</div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-badge">2 минуты</div>
              <h3 className="step-title">Расскажите о себе</h3>
              <p className="step-description">
                Опишите AI-помощнику вашу ситуацию или заполните короткую анкету
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">02</div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-badge">Мгновенно</div>
              <h3 className="step-title">Получите подборку</h3>
              <p className="step-description">
                Алгоритм подберет психологов, которые лучше всего работают с вашим запросом
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">03</div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-badge">24/7</div>
              <h3 className="step-title">Выберите время</h3>
              <p className="step-description">
                Запишитесь на удобное время в календаре выбранного специалиста
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-visual">
              <div className="step-number-wrapper">
                <div className="step-number">04</div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-badge">60 минут</div>
              <h3 className="step-title">Начните терапию</h3>
              <p className="step-description">
                Подключитесь к видеосессии через безопасную платформу
              </p>
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
        <Link href="/staff" className="btn btn--primary btn--large">
          <i className="fas fa-rocket"></i>
          Начать поиск психолога
        </Link>
        <p className="cta-note"><strong>10% скидка</strong> на первую сессию</p>
      </div>
    </div>
  </section>
);

export default HowItWorks;
