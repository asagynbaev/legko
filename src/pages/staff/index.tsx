import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getStaffByBusinessId } from '../../api/api';
import Image from 'next/image';
import Head from 'next/head';
import StaffHeader from '../../components/StaffHeader';
import Footer from '../../components/Footer';

interface Staff {
  id: string;
  name: string;
  phone: string;
  speciality: string;
  aboutMe: string;
  address: string | null;
  isFeatured: boolean;
  photo: string;
  experience: number;
  numberOfClients: number;
  rating: number;
  interval: number;
  isAutoApproved: boolean;
  branchId: string;
}

const StaffPage = () => {
  const router = useRouter();
  const { psychologist } = router.query;
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const specialistRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    getStaffByBusinessId().then((res) => {
      if (res && Array.isArray(res.message)) {
        setStaff(res.message);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (psychologist && typeof psychologist === 'string' && !loading && staff.length > 0) {
      const timer = setTimeout(() => {
        const element = specialistRefs.current[psychologist];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('staff-card--highlighted');
          setTimeout(() => {
            element.classList.remove('staff-card--highlighted');
          }, 3000);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [psychologist, loading, staff]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return 'У';
  };

  const handleBookingClick = (specialistId: string) => {
    window.open(`https://booka.life/master/${specialistId}`, '_blank');
  };

  const handleImageError = (specialistId: string) => {
    setImageErrors((prev) => new Set(prev).add(specialistId));
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const toggleDescription = (specialistId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(specialistId)) {
        newSet.delete(specialistId);
      } else {
        newSet.add(specialistId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Head>
        <title>Наши специалисты - Legko</title>
        <meta
          name="description"
          content="Познакомьтесь с нашими квалифицированными психологами. Найдите подходящего специалиста для решения ваших задач."
        />
      </Head>
      <StaffHeader />

      <main className="staff-page">
        {/* Hero */}
        <section className="staff-hero">
          <div className="container">
            <div className="staff-hero__badge">
              <i className="fas fa-users"></i>
              Каталог специалистов
            </div>
            <h1 className="staff-hero__title">
              Наши <span className="gradient-text">психологи</span>
            </h1>
            <p className="staff-hero__subtitle">
              Высококвалифицированные специалисты с опытом работы от 2 лет.
              Каждый прошел тщательный отбор и имеет необходимые сертификаты.
            </p>

            {/* Trust badges */}
            <div className="staff-hero__badges">
              <div className="staff-badge">
                <i className="fas fa-graduation-cap"></i>
                <span>Высшее образование</span>
              </div>
              <div className="staff-badge">
                <i className="fas fa-certificate"></i>
                <span>Сертифицированы</span>
              </div>
              <div className="staff-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Проверены лично</span>
              </div>
              <div className="staff-badge">
                <i className="fas fa-star"></i>
                <span>Средний рейтинг 4.9</span>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Grid */}
        <section className="staff-grid-section">
          <div className="container">
            {loading ? (
              <div className="staff-loading">
                <div className="loading-spinner"></div>
                <p>Загружаем информацию о специалистах...</p>
              </div>
            ) : (
              <div className="staff-grid">
                {staff.map((specialist) => (
                  <div
                    key={specialist.id}
                    className={`staff-card ${psychologist === specialist.id ? 'staff-card--highlighted' : ''}`}
                    ref={(el) => {
                      if (el) {
                        specialistRefs.current[specialist.id] = el;
                      }
                    }}
                  >
                    {/* Card header */}
                    <div className="staff-card__header">
                      <div className="staff-card__photo">
                        {specialist.photo && !imageErrors.has(specialist.id) ? (
                          <Image
                            src={specialist.photo}
                            alt={specialist.name}
                            width={80}
                            height={80}
                            className="staff-card__avatar"
                            onError={() => handleImageError(specialist.id)}
                            unoptimized
                          />
                        ) : (
                          <div className="staff-card__initials">
                            {getInitials(specialist.name)}
                          </div>
                        )}
                      </div>
                      <div className="staff-card__info">
                        <h3 className="staff-card__name">{specialist.name}</h3>
                        <p className="staff-card__speciality">{specialist.speciality}</p>
                        <div className="staff-card__rating">
                          <div className="staff-card__stars">
                            {renderStars(specialist.rating || 5)}
                          </div>
                          <span className="staff-card__rating-text">
                            {specialist.rating || 5}.0 ({specialist.numberOfClients || 0}+ клиентов)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card meta */}
                    <div className="staff-card__meta">
                      <div className="staff-card__meta-item">
                        <i className="fas fa-briefcase"></i>
                        <span>Опыт: {specialist.experience} лет</span>
                      </div>
                      <div className="staff-card__meta-item">
                        <i className="fas fa-users"></i>
                        <span>{specialist.numberOfClients || 0}+ клиентов</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="staff-card__about">
                      <p className={expandedDescriptions.has(specialist.id) ? '' : 'staff-card__about-truncated'}>
                        {expandedDescriptions.has(specialist.id)
                          ? specialist.aboutMe
                          : truncateText(specialist.aboutMe)}
                      </p>
                      {specialist.aboutMe.length > 150 && (
                        <button
                          className="staff-card__toggle"
                          onClick={() => toggleDescription(specialist.id)}
                          type="button"
                        >
                          {expandedDescriptions.has(specialist.id) ? 'Свернуть' : 'Читать далее'}
                          <i className={`fas ${expandedDescriptions.has(specialist.id) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </button>
                      )}
                    </div>

                    {/* Action */}
                    <button
                      className="staff-card__cta"
                      onClick={() => handleBookingClick(specialist.id)}
                      type="button"
                    >
                      <i className="fas fa-calendar-alt"></i>
                      Записаться на консультацию
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!loading && staff.length === 0 && (
              <div className="staff-empty">
                <div className="staff-empty__icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                <h3>Специалисты временно недоступны</h3>
                <p>Мы работаем над пополнением команды. Попробуйте зайти позже.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="staff-cta">
          <div className="container">
            <div className="staff-cta__content">
              <div className="staff-cta__icon">
                <i className="fas fa-comments"></i>
              </div>
              <h2 className="staff-cta__title">Не нашли подходящего специалиста?</h2>
              <p className="staff-cta__description">
                Свяжитесь с нами, и мы поможем подобрать психолога под ваш запрос бесплатно
              </p>
              <div className="staff-cta__buttons">
                <a
                  href="https://wa.me/996509339333"
                  className="btn btn--primary btn--large"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i>
                  Написать в WhatsApp
                </a>
                <a
                  href="https://t.me/legko_psychology"
                  className="btn btn--secondary btn--large"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-telegram"></i>
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default StaffPage;
