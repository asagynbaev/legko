'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    text: "Долго искала психолога, который бы понимал мои проблемы. На Legko нашла идеального специалиста буквально за несколько минут. Элли сразу поняла мой запрос и предложила именно того, кто мне нужен. Очень благодарна!",
    name: "Акылай",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик влюбленность.webp",
  },
  {
    id: 2,
    text: "Удобная платформа и профессиональные психологи. Помогли справиться с тревогой, которая мучила меня несколько лет. Рекомендую всем, кто сомневается — просто попробуйте, это изменит вашу жизнь!",
    name: "Бектур",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик радость.webp",
  },
  {
    id: 3,
    text: "Спасибо Legko за возможность получить качественную психологическую помощь онлайн. Это действительно изменило мою жизнь к лучшему. Терапия научила меня понимать свои эмоции и принимать себя.",
    name: "Жанара",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик нежность.webp",
  },
  {
    id: 4,
    text: "Я долго откладывал поход к психологу — казалось, это не для меня. Но Legko сделал процесс таким простым и ненавязчивым, что я решился. Теперь жалею только о том, что не обратился раньше.",
    name: "Тимур",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик самолюбование.webp",
  },
  {
    id: 5,
    text: "Работа с психологом через Legko помогла мне разобраться в отношениях с семьёй. Специалист нашла подход уже на первой сессии. Чувствую себя намного спокойнее и увереннее.",
    name: "Айгуль",
    city: "Ош",
    rating: 5,
    avatar: "/images/пушистик обьятия.webp",
  },
  {
    id: 6,
    text: "Сервис очень удобный — выбрала психолога, записалась онлайн и уже через день была на сессии. Консультации на русском языке, психолог понимает нашу культуру. Это важно.",
    name: "Назира",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик расслабление.webp",
  },
  {
    id: 7,
    text: "После нескольких сессий я научился справляться с паническими атаками. Психолог дала конкретные инструменты, а не просто слушала. Очень благодарен за профессиональную помощь.",
    name: "Азамат",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик удивление.webp",
  },
  {
    id: 8,
    text: "Подбор через Элли занял буквально 5 минут. Описала ситуацию — и мне сразу предложили трёх подходящих специалистов. Выбрала одного и не пожалела. Уже 3 месяца работаем вместе.",
    name: "Камила",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик влюбленность.webp",
  },
  {
    id: 9,
    text: "Никогда не думала, что онлайн-терапия может быть такой же эффективной, как офлайн. Легко развеяло этот миф. Психолог внимательная, сессии структурированные, прогресс есть.",
    name: "Зарина",
    city: "Каракол",
    rating: 5,
    avatar: "/images/пушистик грусть.webp",
  },
  {
    id: 10,
    text: "Обратился в период сильного выгорания. Психолог помогла восстановить ресурс и расставить приоритеты. Legko — это не просто сервис, это реальная поддержка в нужный момент.",
    name: "Даниял",
    city: "Бишкек",
    rating: 5,
    avatar: "/images/пушистик снеснение.webp",
  },
];

const CARD_WIDTH_PERCENT = 36;
const GAP_PX = 32;

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const touchStartX = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    setHydrated(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goTo = (i: number) => setActiveIndex((i + reviews.length) % reviews.length);
  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const getOffset = (idx: number): number => {
    let diff = idx - activeIndex;
    if (diff > reviews.length / 2) diff -= reviews.length;
    if (diff < -reviews.length / 2) diff += reviews.length;
    return diff;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    }
  };

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Вот что говорят <span className="gradient-text">клиенты</span></h2>
          <p className="section-subtitle">
            Истории людей, которые нашли поддержку на Legko
          </p>
        </div>

        <div className="testimonials-carousel-wrapper">
          <button
            className="testimonials-arrow testimonials-arrow--prev"
            onClick={prev}
            aria-label="Предыдущий отзыв"
            type="button"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div
            className="testimonials-carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="testimonials-track">
              {reviews.map((review, idx) => {
                const offset = getOffset(idx);
                const isActive = offset === 0;
                const isVisible = Math.abs(offset) <= 1;

                // On mobile: only show active card, centered
                const mobileStyle: React.CSSProperties = {
                  transform: isActive ? 'none' : `translateX(${offset > 0 ? '110%' : '-110%'})`,
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                };

                // On desktop: 3-column carousel
                const desktopTranslateX = `calc(${offset * CARD_WIDTH_PERCENT}% + ${offset * GAP_PX}px)`;
                const desktopStyle: React.CSSProperties = {
                  transform: `translateX(${desktopTranslateX}) scale(${isActive ? 1.06 : 0.93})`,
                  opacity: isVisible ? (isActive ? 1 : 0.55) : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                };

                return (
                  <div
                    key={review.id}
                    className={`testimonial-card ${isActive ? 'testimonial-card--active' : 'testimonial-card--side'}`}
                    style={hydrated ? (isMobile ? mobileStyle : desktopStyle) : desktopStyle}
                  >
                    <div className="testimonial-content">
                      <p>&laquo;{review.text}&raquo;</p>
                    </div>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <Image src={review.avatar} alt={review.name} width={44} height={44} />
                      </div>
                      <div className="author-info">
                        <h4>{review.name}</h4>
                        <span>{review.city}</span>
                      </div>
                    </div>
                    <div className="testimonial-rating">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="testimonials-arrow testimonials-arrow--next"
            onClick={next}
            aria-label="Следующий отзыв"
            type="button"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="testimonials-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`testimonials-dot ${i === activeIndex ? 'testimonials-dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Отзыв ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
