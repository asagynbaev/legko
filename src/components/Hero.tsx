import Image from 'next/image';

const Hero = () => (
  <section className="hero">
    <div className="hero__container container">
      <div className="hero__content">
        <div className="hero__badge">
          <span className="modern-badge">
            <span className="badge-icon">✨</span>
            15 000+ успешных сессий
          </span>
        </div>
        <h1 className="hero__title">
          Найдите <span className="gradient-text">идеального психолога</span> за 2 минуты
        </h1>
        <p className="hero__description">
          Профессиональная психологическая помощь онлайн.<br />
          Подберем специалиста под ваши потребности быстро и безопасно.
        </p>
        <div className="hero__cta">
          <div className="cta-buttons">
            <a href="#" className="btn btn--primary btn--modern">Найти психолога <i className="fas fa-arrow-right"></i></a>
            <a href="#how-it-works" className="btn btn--ghost btn--modern">
              Как это работает
            </a>
          </div>
          <div className="hero__stats">
            <div className="stat-item"><span className="stat-number">4.9</span><span className="stat-label">рейтинг</span></div>
            <div className="stat-item"><span className="stat-number">2000+</span><span className="stat-label">клиентов</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><span className="stat-number">24/7</span><span className="stat-label">поддержка</span></div>
          </div>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__mascot-wrapper">
          <Image src="/images/пушистик радость.png" alt="Legko помощник" width={180} height={180} className="hero__mascot-modern" />
        </div>
        <div className="floating-elements">
          <div className="floating-card modern-card card-2"><div className="card-icon">🔒</div><span>Конфиденциально</span></div>
          <div className="floating-card modern-card card-3"><div className="card-icon">⚡</div><span>Быстрый подбор</span></div>
        </div>
      </div>
    </div>
    <div className="modern-gradient modern-gradient--1"></div>
  </section>
);

export default Hero;
