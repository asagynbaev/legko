import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getStaffByBusinessId, getMasterById, MasterProfile } from '../../api/api';
import { config } from '@/config/env';
import Image from 'next/image';
import Head from 'next/head';
import StaffHeader from '../../components/StaffHeader';
import Footer from '../../components/Footer';
import StaffProfileModal from '../../components/StaffProfileModal';
import {
  STAFF_ABOUT_MAP,
  STAFF_EXPERIENCE_MAP,
  STAFF_FORMAT_MAP,
  STAFF_PRICE_MAP,
  STAFF_SORT_ORDER,
  STAFF_SPECIALITY_MAP,
} from '../../constants/staffContent';

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

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 6;

const StaffPage = () => {
  const router = useRouter();
  const { psychologist } = router.query;
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [profileModal, setProfileModal] = useState<{
    open: boolean;
    loading: boolean;
    error: string | null;
    master: MasterProfile | null;
  }>({ open: false, loading: false, error: null, master: null });
  const specialistRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    getStaffByBusinessId().then((res) => {
      if (res && Array.isArray(res.message)) {
        const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
        const normalized = res.message.map((item: StaffMember) => ({
          ...item,
          name: normalize(item.name),
        }));
        const sorted = [...normalized].sort((a, b) => {
          const idxA = STAFF_SORT_ORDER.indexOf(a.name);
          const idxB = STAFF_SORT_ORDER.indexOf(b.name);
          const orderA = idxA >= 0 ? idxA : STAFF_SORT_ORDER.length;
          const orderB = idxB >= 0 ? idxB : STAFF_SORT_ORDER.length;
          return orderA - orderB;
        });
        setStaff(sorted);
      }
      setLoading(false);
    });
  }, []);

  const visibleStaff = staff.slice(0, visibleCount);
  const hasMore = visibleCount < staff.length;
  const showLoadMore = !loading && hasMore;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, staff.length));
  };

  // При переходе по ссылке ?psychologist=id показываем достаточно карточек, чтобы эта была в списке
  useEffect(() => {
    if (psychologist && typeof psychologist === 'string' && !loading && staff.length > 0) {
      const index = staff.findIndex((s) => s.id === psychologist);
      if (index >= 0) {
        setVisibleCount((prev) => Math.max(prev, index + 1));
      }
    }
  }, [psychologist, loading, staff]);

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
  }, [psychologist, loading, staff, visibleCount]);

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
    window.open(`${config.bookingBaseUrl}/master/${specialistId}`, '_blank');
  };

  const handleOpenProfile = (masterId: string) => {
    router.push(`/staff/${masterId}`);
  };

  const handleCloseProfile = () => {
    setProfileModal({ open: false, loading: false, error: null, master: null });
  };

  const handleImageError = (specialistId: string) => {
    setImageErrors((prev) => new Set(prev).add(specialistId));
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
              <>
              <div className="staff-grid">
                {visibleStaff.map((specialist) => (
                  <div
                    key={specialist.id}
                    className={`staff-card staff-card--alter ${psychologist === specialist.id ? 'staff-card--highlighted' : ''}`}
                    ref={(el) => {
                      if (el) specialistRefs.current[specialist.id] = el;
                    }}
                  >
                    <div className="staff-card__photo-wrap">
                      {specialist.photo && !imageErrors.has(specialist.id) ? (
                        <Image
                          src={specialist.photo}
                          alt={specialist.name}
                          fill
                          className="staff-card__img"
                          onError={() => handleImageError(specialist.id)}
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                      ) : (
                        <div className="staff-card__initials">{getInitials(specialist.name)}</div>
                      )}
                      <div className="staff-card__photo-overlay" />
                      <div className="staff-card__photo-caption">
                        <h3 className="staff-card__name">{specialist.name}</h3>
                        <p className="staff-card__speciality">{STAFF_SPECIALITY_MAP[specialist.name] || specialist.speciality}</p>
                        <p className="staff-card__meta-line">
                          {STAFF_EXPERIENCE_MAP[specialist.name] || `Опыт ${specialist.experience} лет`}
                          {specialist.numberOfClients > 0 && ` • ${specialist.numberOfClients}+ клиентов`}
                        </p>
                        <div className="staff-card__rating-inline">
                          <i className="fas fa-star" />
                          <span>{(specialist.rating || 5).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="staff-card__details-block">
                      <div className="staff-card__detail-row">
                        <span className="staff-card__detail-label">Стоимость консультации</span>
                        <span className="staff-card__detail-value">{STAFF_PRICE_MAP[specialist.name] || 'от 1500 с'}</span>
                      </div>
                      <div className="staff-card__detail-row">
                        <span className="staff-card__detail-label">Формат приёма</span>
                        <span className="staff-card__detail-value">
                          {STAFF_FORMAT_MAP[specialist.name] || specialist.address?.trim() || 'Онлайн'}
                        </span>
                      </div>
                    </div>
                    <div className="staff-card__about">
                      <p className="staff-card__about-truncated">
                        {STAFF_ABOUT_MAP[specialist.name] || specialist.aboutMe}
                      </p>
                      <a
                        href={`/staff/${specialist.id}`}
                        className="staff-card__more-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenProfile(specialist.id);
                        }}
                      >
                        ещё...
                      </a>
                    </div>
                    <div className="staff-card__actions">
                      <button
                        type="button"
                        className="staff-card__cta staff-card__cta--secondary"
                        onClick={() => handleOpenProfile(specialist.id)}
                      >
                        <i className="fas fa-user-circle" aria-hidden></i>
                        Посмотреть анкету
                      </button>
                      <button
                        className="staff-card__cta"
                        onClick={() => handleBookingClick(specialist.id)}
                        type="button"
                      >
                        <i className="fas fa-calendar-alt" aria-hidden></i>
                        Записаться
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showLoadMore && (
                <div className="staff-load-more">
                  <button
                    type="button"
                    className="btn btn--primary btn--large staff-load-more__btn"
                    onClick={handleLoadMore}
                  >
                    Показать ещё
                  </button>
                  <p className="staff-load-more__hint">
                    Показано {visibleStaff.length} из {staff.length}
                  </p>
                </div>
              )}
              </>
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

      {profileModal.open && (
        <StaffProfileModal
          master={profileModal.master}
          loading={profileModal.loading}
          error={profileModal.error}
          onClose={handleCloseProfile}
          onBook={handleBookingClick}
        />
      )}
    </>
  );
};

export default StaffPage;
