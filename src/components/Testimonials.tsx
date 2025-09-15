import Image from 'next/image';

const Testimonials = () => (
  <section className="testimonials">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Отзывы клиентов</h2>
        <p className="section-subtitle">Истории людей, которые нашли помощь</p>
      </div>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <div className="testimonial-content">
            <p>&ldquo;Долго искала психолога, который бы понимал мои проблемы. На Legko нашла идеального специалиста буквально за несколько минут. Очень благодарна!&rdquo;</p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              <Image src="/images/пушистик влюбленность.png" alt="Акылай" width={40} height={40} className="mascot-icon" />
            </div>
            <div className="author-info">
              <h4>Акылай</h4>
              <span>Бишкек</span>
            </div>
          </div>
          <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
        </div>
        <div className="testimonial-card">
          <div className="testimonial-content">
            <p>&ldquo;Удобная платформа, профессиональные психологи. Помогли справиться с тревогой. Рекомендую всем, кто сомневается - просто попробуйте!&rdquo;</p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              <Image src="/images/пушистик радость.png" alt="Бектур" width={40} height={40} className="mascot-icon" />
            </div>
            <div className="author-info">
              <h4>Бектур</h4>
              <span>Бишкек</span>
            </div>
          </div>
          <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
        </div>
        <div className="testimonial-card">
          <div className="testimonial-content">
            <p>&ldquo;Спасибо Legko за возможность получить качественную психологическую помощь онлайн. Это действительно изменило мою жизнь к лучшему.&rdquo;</p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              <Image src="/images/пушистик нежность.png" alt="Жанара" width={40} height={40} className="mascot-icon" />
            </div>
            <div className="author-info">
              <h4>Жанара</h4>
              <span>Бишкек</span>
            </div>
          </div>
          <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
