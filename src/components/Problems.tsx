import Image from 'next/image';
import Link from 'next/link';

const Problems = () => (
  <section className="problems" id="problems">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">С чем можно прийти <span className="gradient-text">к психологу</span></h2>
        <p className="section-subtitle">
          Иногда мы не можем точно сформулировать проблему и это нормально. Вы можете прийти с любым вопросом, который сейчас важен для вас
        </p>
      </div>

      {/* Popular problems - alter.ru style quote cards */}
      <div className="problems-grid">
        <div className="problem-card problem-card--featured">
          <div className="problem-card__quote">&laquo;Я чувствую тревогу и беспокойство&raquo;</div>
          <div className="problem-card__description">
            Психолог поможет разобраться с причинами тревоги и научит техникам саморегуляции
          </div>
          <div className="problem-card__tags">
            <span className="tag">Панические атаки</span>
            <span className="tag">Фобии</span>
            <span className="tag">ОКР</span>
          </div>
        </div>

        <div className="problem-card">
          <div className="problem-card__icon">
            <Image src="/images/пушистик снеснение.webp" alt="" width={48} height={48} className="mascot-icon" loading="lazy" />
          </div>
          <div className="problem-card__quote">&laquo;У меня нет сил и энергии&raquo;</div>
          <div className="problem-card__description">
            Терапия поможет выйти из состояния апатии и вернуть интерес к жизни
          </div>
          <div className="problem-card__tags">
            <span className="tag">Депрессия</span>
            <span className="tag">Выгорание</span>
            <span className="tag">Апатия</span>
          </div>
        </div>

        <div className="problem-card">
          <div className="problem-card__icon">
            <Image src="/images/пушистик удивление.webp" alt="" width={48} height={48} className="mascot-icon" loading="lazy" />
          </div>
          <div className="problem-card__quote">&laquo;Сложности в отношениях&raquo;</div>
          <div className="problem-card__description">
            Терапия научит строить здоровые отношения, решать конфликты и доверять
          </div>
          <div className="problem-card__tags">
            <span className="tag">Семья</span>
            <span className="tag">Ревность</span>
            <span className="tag">Развод</span>
          </div>
        </div>

        <div className="problem-card">
          <div className="problem-card__icon">
            <Image src="/images/пушистик самолюбование.webp" alt="" width={48} height={48} className="mascot-icon" loading="lazy" />
          </div>
          <div className="problem-card__quote">&laquo;Хочу разобраться в себе&raquo;</div>
          <div className="problem-card__description">
            Психолог поможет лучше понять себя, свои потребности и найти свой путь
          </div>
          <div className="problem-card__tags">
            <span className="tag">Самооценка</span>
            <span className="tag">Самопознание</span>
            <span className="tag">Цели</span>
          </div>
        </div>
      </div>

      {/* All categories */}
      <div className="problems-categories">
        <h3 className="problems-section-title">Все направления работы</h3>
        <div className="categories-grid">
          <div className="category-group">
            <h4 className="category-title">Эмоциональное состояние</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик грусть.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Тревога и беспокойство</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик снеснение.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Депрессия</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик радость.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Эмоциональное выгорание</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик расслабление.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Панические атаки</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">Отношения</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик влюбленность.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Построить отношения</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик обьятия.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Наладить отношения с семьей</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик удивление.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Переживание развода</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик грусть.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Обида на родителей</span>
              </div>
            </div>
          </div>

          <div className="category-group">
            <h4 className="category-title">Личностный рост</h4>
            <div className="category-items">
              <div className="category-item">
                <Image src="/images/пушистик самолюбование.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Проблемы с самооценкой</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик нежность.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Найти себя и любимое дело</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик радость.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Раскрыть свой потенциал</span>
              </div>
              <div className="category-item">
                <Image src="/images/пушистик снеснение.webp" alt="" width={32} height={32} className="category-icon" loading="lazy" />
                <span>Профессиональное выгорание</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="problems-cta">
        <div className="problems-cta-content">
          <h4>Не нашли свою проблему?</h4>
          <p>У нас есть специалисты по <strong>50+ направлениям</strong>. Расскажите о своей ситуации, и мы подберем подходящего психолога</p>
          <a href="https://wa.me/996700595393" target="_blank" rel="noopener noreferrer" className="btn btn--primary">
            <i className="fab fa-whatsapp"></i>
            <span className="btn-text-full">Написать живому менеджеру в WhatsApp</span>
            <span className="btn-text-short">Написать в WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Problems;
