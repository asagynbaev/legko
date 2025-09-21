import Image from 'next/image';

const Problems = () => (
  <section className="problems">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">&ldquo;Legko&rdquo; для тех, кто хочет...</h2>
        <p className="section-subtitle">Более 50 направлений работы с профессиональными психологами</p>
      </div>
      {/* Popular Problems */}
      <div className="problems-popular">
        <h3 className="problems-section-title">🔥 Самые популярные запросы</h3>
        <div className="problems-grid">
          <div className="problem-card problem-card--featured">
            <div className="problem-card__icon">
              <Image src="/images/пушистик грусть.png" alt="Тревога" width={60} height={60} className="mascot-icon" />
            </div>
            <h4 className="problem-card__title">Тревога и беспокойство</h4>
            <p className="problem-card__description">Избавление от ненужных мыслей и чувств, а также навязчивого &ldquo;что скажут люди&rdquo;</p>
            <div className="problem-card__tags">
              <span className="tag">Панические атаки</span>
              <span className="tag">Фобии</span>
              <span className="tag">ОКР</span>
            </div>
          </div>
          <div className="problem-card problem-card--featured">
            <div className="problem-card__icon">
              <Image src="/images/пушистик снеснение.png" alt="Депрессия" width={60} height={60} className="mascot-icon" />
            </div>
            <h4 className="problem-card__title">Нет энергии и сил</h4>
            <p className="problem-card__description">Вернуть энергию и силы, выявление сильных и слабых сторон, принятие себя</p>
            <div className="problem-card__tags">
              <span className="tag">Депрессия</span>
              <span className="tag">Апатия</span>
              <span className="tag">Усталость</span>
            </div>
          </div>
          <div className="problem-card problem-card--featured">
            <div className="problem-card__icon">
              <Image src="/images/пушистик удивление.png" alt="Отношения" width={60} height={60} className="mascot-icon" />
            </div>
            <h4 className="problem-card__title">Сложности в отношениях</h4>
            <p className="problem-card__description">Гармоничные отношения с детьми, родителями и даже с семьей мужа/жены</p>
            <div className="problem-card__tags">
              <span className="tag">Развод</span>
              <span className="tag">Ревность</span>
              <span className="tag">Семейные конфликты</span>
            </div>
          </div>
        </div>
      </div>
      {/* All Categories */}
      <div className="problems-categories">
        <h3 className="problems-section-title">📋 Все направления работы</h3>
        <div className="categories-grid">
          <div className="category-group">
            <h4 className="category-title">💭 Эмоциональное состояние</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик грусть.png" alt="Тревога" width={40} height={40} className="category-icon" />
                <span>Тревога и беспокойство</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик снеснение.png" alt="Депрессия" width={40} height={40} className="category-icon" />
                <span>Депрессия</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик радость.png" alt="Стресс" width={40} height={40} className="category-icon" />
                <span>Эмоциональное выгорание</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик расслабление.png" alt="Панические атаки" width={40} height={40} className="category-icon" />
                <span>Панические атаки</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">❤️ Отношения</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик влюбленность.png" alt="Построить отношения" width={40} height={40} className="category-icon" />
                <span>Построить отношения</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик обьятия.png" alt="Семейные конфликты" width={40} height={40} className="category-icon" />
                <span>Наладить отношения с семьей</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик удивление.png" alt="Развод" width={40} height={40} className="category-icon" />
                <span>Переживание развода</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик грусть.png" alt="Обида на родителей" width={40} height={40} className="category-icon" />
                <span>Обида на папу/маму</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">🎯 Личностный рост</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик самолюбование.png" alt="Самооценка" width={40} height={40} className="category-icon" />
                <span>Проблемы с самооценкой</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик нежность.png" alt="Найти себя" width={40} height={40} className="category-icon" />
                <span>Найти себя и любимое занятие</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик радость.png" alt="Раскрыть потенциал" width={40} height={40} className="category-icon" />
                <span>Раскрыть свой потенциал</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик самолюбование.png" alt="Разобраться в себе" width={40} height={40} className="category-icon" />
                <span>Разобраться в себе</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">💼 Карьера и деньги</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик снеснение.png" alt="Не нравится работа" width={40} height={40} className="category-icon" />
                <span>Не нравится работа</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик самолюбование.png" alt="Карьерный рост" width={40} height={40} className="category-icon" />
                <span>Как вырасти в доходе</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик радость.png" alt="Выгорание" width={40} height={40} className="category-icon" />
                <span>Профессиональное выгорание</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик грусть.png" alt="Стресс на работе" width={40} height={40} className="category-icon" />
                <span>Стресс на работе</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">🌟 Жизненные кризисы</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик удивление.png" alt="Кризис среднего возраста" width={40} height={40} className="category-icon" />
                <span>Кризис среднего возраста</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик грусть.png" alt="Проработать травмы" width={40} height={40} className="category-icon" />
                <span>Проработать травмы</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик снеснение.png" alt="Выйти из кризиса" width={40} height={40} className="category-icon" />
                <span>Выйти из кризисной ситуации</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик обьятия.png" alt="Старший ребенок" width={40} height={40} className="category-icon" />
                <span>Гармоничные отношения с детьми</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">🧠 Ментальное здоровье</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик грусть.png" alt="Тревожные расстройства" width={40} height={40} className="category-icon" />
                <span>Тревожные расстройства</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик снеснение.png" alt="Биполярное расстройство" width={40} height={40} className="category-icon" />
                <span>Работа с настроением</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик расслабление.png" alt="Расстройства сна" width={40} height={40} className="category-icon" />
                <span>Проблемы со сном</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик радость.png" alt="Зависимости" width={40} height={40} className="category-icon" />
                <span>Работа с зависимостями</span>
              </div>
            </div>
          </div>
        </div>
        <div className="problems-cta">
          <div className="problems-cta-content">
            <h4>Не нашли свою проблему?</h4>
            <p>У нас есть специалисты по <strong>50+ направлениям</strong>. Расскажите о своей ситуации, и мы подберем подходящего психолога</p>
            <a href="#" className="btn btn--primary btn--problems-cta">
              <i className="fas fa-comment-dots"></i>
              <span className="btn-text-full">Получить бесплатную консультацию</span>
              <span className="btn-text-short">Бесплатная консультация</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Problems;
