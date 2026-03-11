import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const ForPsychologists = () => {
  return (
    <>
      <Head>
        <title>Работать с нами | Legko - Платформа для психологов</title>
        <meta name="description" content="Присоединяйтесь к команде профессиональных психологов Legko. Мы найдем вам клиентов, поможем развить личный бренд и возьмем на себя операционные задачи." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {/* Hero Section */}
      <section className="psychologists-hero">
        <div className="container">
          <div className="psychologists-hero-content">
            <div className="hero-badge">Для психологов</div>
            <h1 className="psychologists-hero-title">
              Сосредоточьтесь на терапии.<br />
              Мы займемся остальным.
            </h1>
            <p className="psychologists-hero-subtitle">
              Находим клиентов, развиваем ваш бренд и берем на себя все организационные задачи. Вы работаете с теми, кому действительно нужна помощь.
            </p>
            <div className="psychologists-hero-actions">
              <Link href="#cooperation" className="btn btn--primary btn--large">
                Начать сотрудничество
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="psychologists-benefits">
        <div className="container">
          <div className="benefits-header">
            <h2 className="section-title">Что мы делаем</h2>
            <p className="section-description">Мы берем на себя все задачи, которые отвлекают от работы с клиентами</p>
          </div>
          
          <div className="benefits-grid-modern">
            <div className="benefit-card-modern">
              <div className="benefit-number">01</div>
              <h3>Находим клиентов</h3>
              <p>Занимаемся маркетингом и привлечением новых клиентов. С помощью анкет подбираем тех, чьи запросы соответствуют вашей специализации и методике работы.</p>
            </div>

            <div className="benefit-card-modern">
              <div className="benefit-number">02</div>
              <h3>Развиваем личный бренд</h3>
              <p>Берем на себя продвижение вашего профиля в социальных сетях. Вы можете сосредоточиться на профессиональном развитии.</p>
            </div>

            <div className="benefit-card-modern">
              <div className="benefit-number">03</div>
              <h3>Организуем работу</h3>
              <p>Подбираем время сессий, отправляем напоминания, занимаемся переносами встреч и следим за оплатой. Всегда доступны через Telegram и WhatsApp.</p>
            </div>

            <div className="benefit-card-modern">
              <div className="benefit-number">04</div>
              <h3>Работайте удаленно</h3>
              <p>Не нужно арендовать кабинет. Все сессии проводятся онлайн через Google Meets. Устанавливаете свои часы и дни доступности.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cooperation Process */}
      <section className="cooperation-process" id="cooperation">
        <div className="container">
          <div className="process-header">
            <h2 className="section-title">Как начать</h2>
            <p className="section-description">Три простых шага до начала работы</p>
          </div>

          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">1</span>
              </div>
              <div className="timeline-content">
                <h3>Заполните анкету</h3>
                <p>Расскажите о своей специализации, опыте работы и предпочтениях в работе с клиентами</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">2</span>
              </div>
              <div className="timeline-content">
                <h3>Пройдите интервью</h3>
                <p>Короткое собеседование для знакомства и обсуждения деталей сотрудничества</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">3</span>
              </div>
              <div className="timeline-content">
                <h3>Настройте график</h3>
                <p>Установите часы и дни доступности, и мы начнем подбирать вам клиентов</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements" id="requirements">
        <div className="container">
          <div className="requirements-header">
            <h2 className="section-title">Требования</h2>
            <p className="section-description">Убедитесь, что вы соответствуете нашим стандартам качества</p>
          </div>

          <div className="requirements-grid-modern">
            <div className="requirement-card-modern">
              <h3>Образование</h3>
              <p>Бакалавриат, магистратура или специалитет по психологии. Обучение в психотерапевтических подходах/специализациях.</p>
            </div>

            <div className="requirement-card-modern">
              <h3>Терапия и супервизия</h3>
              <p>Личная терапия не менее года (для всех подходов, кроме КБТ и ОРКТ). Обязательное прохождение супервизии.</p>
            </div>

            <div className="requirement-card-modern">
              <h3>Опыт работы</h3>
              <p>От 2-х лет консультирования в индивидуальном, групповом или семейном формате.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="psychologists-contact" id="contact">
        <div className="container">
          <div className="contact-card">
            <h2>Есть вопросы?</h2>
            <p>Напишите нам в Telegram, мы ответим в течение дня</p>
            <a 
              href="https://t.me/legko_psychology" 
              className="contact-button" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForPsychologists;
