import Image from 'next/image';

const Testimonials = () => (
  <section className="testimonials">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Вот что говорят <span className="gradient-text">клиенты</span></h2>
        <p className="section-subtitle">
          Истории людей, которые нашли поддержку на Legko
        </p>
      </div>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <div className="testimonial-content">
            <p>
              &laquo;Долго искала психолога, который бы понимал мои проблемы. 
              На Legko нашла идеального специалиста буквально за несколько минут. 
              Элли сразу поняла мой запрос и предложила именно того, кто мне нужен. 
              Очень благодарна!&raquo;
            </p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              <Image src="/images/пушистик влюбленность.png" alt="Акылай" width={44} height={44} />
            </div>
            <div className="author-info">
              <h4>Акылай</h4>
              <span>Бишкек</span>
            </div>
          </div>
          <div className="testimonial-rating">★★★★★</div>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-content">
            <p>
              &laquo;Удобная платформа и профессиональные психологи. 
              Помогли справиться с тревогой, которая мучила меня несколько лет. 
              Рекомендую всем, кто сомневается — просто попробуйте, это изменит вашу жизнь!&raquo;
            </p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              <Image src="/images/пушистик радость.png" alt="Бектур" width={44} height={44} />
            </div>
            <div className="author-info">
              <h4>Бектур</h4>
              <span>Бишкек</span>
            </div>
          </div>
          <div className="testimonial-rating">★★★★★</div>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-content">
            <p>
              &laquo;Спасибо Legko за возможность получить качественную 
              психологическую помощь онлайн. Это действительно изменило мою жизнь 
              к лучшему. Терапия научила меня понимать свои эмоции и принимать себя.&raquo;
            </p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              <Image src="/images/пушистик нежность.png" alt="Жанара" width={44} height={44} />
            </div>
            <div className="author-info">
              <h4>Жанара</h4>
              <span>Бишкек</span>
            </div>
          </div>
          <div className="testimonial-rating">★★★★★</div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
