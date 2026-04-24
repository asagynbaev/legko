import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import SpecialistCard from './SpecialistCard';
import { getStaffByBusinessId } from '../api/api';
import {
  STAFF_EXPERIENCE_MAP,
  STAFF_FORMAT_MAP,
  STAFF_PRICE_MAP,
  STAFF_SORT_ORDER,
  STAFF_SPECIALITY_MAP,
} from '../constants/staffContent';

type StaffItem = {
  id: string;
  name: string;
  photo?: string;
  speciality: string;
  rating?: number;
  experience?: number;
  numberOfClients?: number;
  address?: string | null;
};

const Specialists = () => {
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getStaffByBusinessId()
      .then((res) => {
        if (res && Array.isArray(res.message)) {
          const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
          const normalized = res.message.map((item: StaffItem) => ({
            ...item,
            name: normalize(item.name),
          }));
          const sorted = [...normalized].sort((a: StaffItem, b: StaffItem) => {
            const idxA = STAFF_SORT_ORDER.indexOf(a.name);
            const idxB = STAFF_SORT_ORDER.indexOf(b.name);
            const orderA = idxA >= 0 ? idxA : STAFF_SORT_ORDER.length;
            const orderB = idxB >= 0 ? idxB : STAFF_SORT_ORDER.length;
            return orderA - orderB;
          });
          setStaff(sorted);
        } else {
          setError('Не удалось загрузить данные');
        }
      })
      .catch((err) => {
        console.error('Error loading staff:', err);
        setError('Произошла ошибка при загрузке специалистов');
        setStaff([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const scrollCarousel = (dir: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = 340 + 24;
    el.scrollBy({ left: dir === 'prev' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  const displayList = staff.length > 0 ? staff.slice(0, 6) : [];
  const avgExperience = displayList.length
    ? Math.round(
        displayList.reduce((acc, s) => acc + (s.experience ?? 0), 0) / displayList.length
      ) || 5
    : 5;

  return (
    <section className="specialists-modern" id="specialists">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="modern-badge">
              <span className="badge-icon"></span>
            </span>
          </div>
          <h2 className="section-title">
            Наша команда <span className="gradient-text">психологов</span>
          </h2>
          <p className="section-subtitle">
            Каждый специалист проходит строгий отбор и имеет высшее психологическое образование. Вы можете посмотреть профиль психолога, его специализацию и стоимость консультации
          </p>
        </div>

        <div className="specialists-modern-features">
          <div className="modern-feature-item">
            <div className="feature-icon-wrapper">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <span>Высшее психологическое образование</span>
          </div>
          <div className="modern-feature-item">
            <div className="feature-icon-wrapper">
              <i className="fas fa-heart"></i>
            </div>
            <span>Личная терапия</span>
          </div>
          <div className="modern-feature-item">
            <div className="feature-icon-wrapper">
              <i className="fas fa-users"></i>
            </div>
            <span>Супервизии</span>
          </div>
        </div>

        <div className="specialists-carousel-wrap">
          {loading ? (
            <div className="specialists-loading" aria-live="polite" aria-label="Загрузка специалистов">
              <div className="loading-spinner"></div>
              <span>Загрузка специалистов...</span>
            </div>
          ) : error ? (
            <div className="specialists-error" role="alert">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <p className="specialists-error-note">Показываем примеры специалистов</p>
            </div>
          ) : null}

          {(displayList.length > 0 || !loading) && (
            <>
              <div className="specialists-carousel" ref={carouselRef}>
                {displayList.length > 0
                  ? displayList.map((item) => (
                      <SpecialistCard
                        key={item.id}
                        id={item.id}
                        avatar={item.photo || '/images/пушистик обьятия.png'}
                        name={item.name}
                        title={STAFF_SPECIALITY_MAP[item.name] || item.speciality}
                        rating={item.rating ?? 5}
                        experienceLabel={STAFF_EXPERIENCE_MAP[item.name]}
                        experience={item.experience}
                        numberOfClients={item.numberOfClients}
                        priceFrom={STAFF_PRICE_MAP[item.name] || 'от 1500 с'}
                        location={STAFF_FORMAT_MAP[item.name] || (item.address && item.address.trim() ? item.address : 'Онлайн')}
                        approach={(STAFF_SPECIALITY_MAP[item.name] || item.speciality)?.split(/[,\.\/]/)[0]?.trim() || undefined}
                      />
                    ))
                  : [
                      { name: 'Айдана Мадишова', title: 'Психолог', avatar: '/images/пушистик обьятия.png' },
                      { name: 'Алина Сасаза', title: 'Психолог', avatar: '/images/пушистик самолюбование.png' },
                      { name: 'Мария Иванова', title: 'Психолог-консультант', avatar: '/images/пушистик нежность.png' },
                    ].map((item, idx) => (
                      <SpecialistCard
                        key={idx}
                        avatar={item.avatar}
                        name={item.name}
                        title={item.title}
                        rating={5}
                        priceFrom="От 1500 с"
                        location="Онлайн"
                      />
                    ))}
              </div>
              <div className="specialists-carousel-arrows">
                <button
                  type="button"
                  className="specialists-carousel-arrow"
                  onClick={() => scrollCarousel('prev')}
                  aria-label="Предыдущий"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  type="button"
                  className="specialists-carousel-arrow"
                  onClick={() => scrollCarousel('next')}
                  aria-label="Следующий"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="specialists-modern-cta">
          <Link href="/staff" className="btn btn--primary btn--large">
            <i className="fas fa-search"></i>
            Посмотреть всех специалистов
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Specialists;
