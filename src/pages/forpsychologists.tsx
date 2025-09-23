import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const ForPsychologists = () => {
  return (
    <>
      <Head>
        <title>Работать с нами | Legko - Платформа для психологов</title>
        <meta name="description" content="Присоединяйтесь к команде профессиональных психологов Legko. Мы найдем вам клиентов, поможем развить личный бренд и возьмем на себя операционные задачи." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="psychologists-hero">
        <div className="container">
          <div className="psychologists-hero-content">
            <h1 className="psychologists-hero-title">
              ОНЛАЙН-ПЛАТФОРМА<br />
              <span className="highlight">ДЛЯ ПСИХОЛОГОВ</span>
            </h1>
            <p className="psychologists-hero-subtitle">
              Мы рады сотрудничеству с вами!
            </p>
            <div className="psychologists-hero-actions">
              <Link href="#cooperation" className="btn btn--primary btn--large">
                <i className="fas fa-handshake"></i>
                Начать сотрудничество
              </Link>
              <Link href="#questions" className="btn btn--outline btn--large">
                <i className="fas fa-question-circle"></i>
                Есть вопросы
              </Link>
            </div>
          </div>
          <div className="psychologists-hero-visual">
            <Image 
              src="/images/пушистик самолюбование.png" 
              alt="Психолог" 
              width={300} 
              height={300} 
              className="psychologists-mascot"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="psychologists-benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Вам больше не нужно терять время на продвижение</h2>
            <p className="section-subtitle">Мы возьмем на себя все организационные вопросы</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Найдем вам клиентов</h3>
              <p>Мы занимаемся маркетингом и привлечением новых клиентов. С помощью анкет, заполняемых потенциальными клиентами, мы подбираем тех, чьи запросы соответствуют вашей специализации и методике работы.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Поможем развить личный бренд</h3>
              <p>Вместо затраты своих ресурсов - времени, денег и энергии - на продвижение своего профиля в социальных сетях и создание личного бренда, вы можете полностью довериться нам и сосредоточить свои усилия на профессиональном развитии.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Делегируете операционные обязанности</h3>
              <p>Подбираем подходящее вам и клиенту время сессии, отправляем напоминания о предстоящих сеансах, занимаемся переносами встреч, а также следим за своевременной оплатой. В случае возникновения трудностей, мы всегда доступны для общения через Telegram и WhatsApp.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-laptop"></i>
              </div>
              <h3>Работаете где и когда удобно</h3>
              <p>Не нужно арендовывать кабинет. Ваше местоположение не имеет значения, все сессии проводятся в режиме онлайн через платформы Google Meets. Вы можете установить свои часы и дни доступности для консультаций.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cooperation Process */}
      <section className="cooperation-process" id="cooperation">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Как начать сотрудничество</h2>
            <p className="section-subtitle">Всего 3 простых шага до начала работы</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Заполняете анкету</h3>
                <p>Расскажите о своей специализации, опыте работы и предпочтениях в работе с клиентами</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Проходите интервью</h3>
                <p>Короткое собеседование для знакомства и обсуждения деталей сотрудничества</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Устанавливаете часы и дни доступности</h3>
                <p>Настраиваете свой график работы, и мы начинаем подбирать вам клиентов</p>
              </div>
            </div>
          </div>

          <div className="process-cta">
            <Link href="#requirements" className="btn btn--primary btn--large">
              <i className="fas fa-clipboard-list"></i>
              Изучите требования перед заполнением анкеты
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements" id="requirements">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Требования к психологам</h2>
            <p className="section-subtitle">Убедитесь, что вы соответствуете нашим стандартам</p>
          </div>

          <div className="requirements-grid">
            <div className="requirement-card">
              <div className="requirement-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Образование и сертификация</h3>
              <p>Бакалавриат, магистратура, специалитет по психологии. + Обучение в психотерапевтических подходах/специализациях.</p>
            </div>

            <div className="requirement-card">
              <div className="requirement-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Личная терапия и супервизия</h3>
              <p>Личная терапия не менее года для всех подходов, кроме КБТ и ОРКТ на основе международных требований. Обязательное прохождение супервизии</p>
            </div>

            <div className="requirement-card">
              <div className="requirement-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Опыт работы</h3>
              <p><strong>от 2-х лет</strong><br />Мы устанавливаем партнерство с психологами, имеющими опыт консультирования в индивидуальном, групповом или семейном формате продолжительностью не менее 2-х лет.</p>
            </div>
          </div>

          <div className="requirements-cta">
            <Link href="#contact" className="btn btn--primary btn--large">
              <i className="fas fa-handshake"></i>
              Начать сотрудничество
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="psychologists-contact" id="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Мы всегда на связи!</h2>
              <p>Есть вопросы? Напишите нам в телеграм:</p>
              <a href="https://t.me/legko_psychology" className="contact-link">
                <i className="fab fa-telegram"></i>
                +996 509 339 333
              </a>
            </div>
            <div className="contact-visual">
              <Image 
                src="/images/пушистик обьятия.png" 
                alt="Связь с нами" 
                width={200} 
                height={200} 
                className="contact-mascot"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForPsychologists;
