import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import SpecialistCard from './SpecialistCard';
import { getStaffByBusinessId } from '../api/api';

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

// Same sort order as /staff page
const STAFF_SORT_ORDER = [
  'Чолпон Кадралиева',
  'Адинай Жапаралиева',
  'Заира Рамзанова',
  'Заира Рамазанова',
  'Асел Молдош',
  'Анна Анастасиади',
  'Наталья Джунковская',
  'Александр Клеваков',
  'Астра Исаева',
  'Виктор Толмасов',
  'Джамиля Абилдаева',
  'Акылай Шамкеева',
  'Жылдыз Мади',
  'Руфина Мажитова',
  'Алина Сасаза',
  'Ксения Антонова',
  'Вера Романенко',
  'Джамал Дуйшекеева',
];

const STAFF_SPECIALITY_MAP: Record<string, string> = {
  'Чолпон Кадралиева': 'Травматерапевт. Секс-терапевт. Клинический психолог. Специалист по социальной тревоге',
  'Адинай Жапаралиева': 'Психолог-консультант. Исламский психолог',
  'Заира Рамзанова': 'Подростковый и семейный психолог. КПТ-Терапевт',
  'Заира Рамазанова': 'Подростковый и семейный психолог. КПТ-Терапевт',
  'Асел Молдош': 'Клинический психолог, сексолог',
  'Анна Анастасиади': 'Психолог. Коуч. Профайлер',
  'Наталья Джунковская': 'Психолог. Гештальт-терапевт',
  'Александр Клеваков': 'Психолог, психодиагност, гештальт-консультант',
  'Астра Исаева': 'Психолог. EMDR-терапевт',
  'Виктор Толмасов': 'Экзистенциальный терапевт. Семейный психолог. Логотерапевт',
  'Джамиля Абилдаева': 'Психолог. КПТ-терапевт',
  'Акылай Шамкеева': 'Психолог. Гештальт и КПТ терапевт',
  'Жылдыз Мади': 'Психолог. Гештальт-терапевт',
  'Руфина Мажитова': 'Психолог. Гештальт-терапевт',
  'Алина Сасаза': 'Социальный психолог. Психолог-консультант. Психолог-тренер',
  'Ксения Антонова': 'Психолог',
  'Вера Романенко': 'Психолог',
  'Джамал Дуйшекеева': 'Психолог',
};

const STAFF_EXPERIENCE_MAP: Record<string, string> = {
  'Чолпон Кадралиева': 'Опыт работы с 2020 года',
  'Адинай Жапаралиева': 'Опыт работы с 2019 года',
  'Заира Рамзанова': 'Опыт работы с 2023 года',
  'Заира Рамазанова': 'Опыт работы с 2023 года',
  'Асел Молдош': 'Опыт работы с 2019 года',
  'Анна Анастасиади': 'Опыт работы с 2018 года',
  'Наталья Джунковская': 'Опыт работы с 2006 года',
  'Александр Клеваков': 'Опыт работы с 2021 года',
  'Астра Исаева': 'Опыт работы с 2021 года',
  'Виктор Толмасов': 'Опыт работы с 2015 года',
  'Джамиля Абилдаева': 'Опыт работы с 2024 года',
  'Акылай Шамкеева': 'Опыт работы с 2022 года',
  'Жылдыз Мади': 'Опыт работы с 2014 года',
  'Руфина Мажитова': 'Опыт работы с 2022 года',
  'Алина Сасаза': 'Опыт работы с 2018 года',
  'Ксения Антонова': 'Опыт работы с 2022 года',
  'Вера Романенко': 'Опыт работы с 2017 года',
  'Джамал Дуйшекеева': 'Опыт работы с 2006 года',
};

const STAFF_PRICE_MAP: Record<string, string> = {
  'Чолпон Кадралиева': 'от 1000 с',
  'Адинай Жапаралиева': 'от 2500 с',
  'Заира Рамзанова': 'от 1500 с',
  'Заира Рамазанова': 'от 1500 с',
  'Асел Молдош': 'от 4000 с',
  'Анна Анастасиади': 'от 3500 с',
  'Наталья Джунковская': 'от 2500 с',
  'Александр Клеваков': 'от 1200 с',
  'Астра Исаева': 'от 2500 с',
  'Виктор Толмасов': '4000 с',
  'Джамиля Абилдаева': 'от 1000 с',
  'Акылай Шамкеева': 'от 2000 с',
  'Жылдыз Мади': 'от 2000 с',
  'Руфина Мажитова': 'от 2000 с',
  'Алина Сасаза': 'от 2000 с',
  'Ксения Антонова': 'от 2000 с',
  'Вера Романенко': 'от 2000 с',
  'Джамал Дуйшекеева': 'от 2000 с',
};

const STAFF_FORMAT_MAP: Record<string, string> = {
  'Чолпон Кадралиева': 'Онлайн',
  'Адинай Жапаралиева': 'Онлайн/оффлайн',
  'Заира Рамзанова': 'Онлайн/оффлайн',
  'Заира Рамазанова': 'Онлайн/оффлайн',
  'Асел Молдош': 'Онлайн/оффлайн',
  'Анна Анастасиади': 'Онлайн/оффлайн',
  'Наталья Джунковская': 'Онлайн/оффлайн',
  'Александр Клеваков': 'Онлайн',
  'Астра Исаева': 'Онлайн/оффлайн',
  'Виктор Толмасов': 'Онлайн',
  'Джамиля Абилдаева': 'Онлайн',
  'Акылай Шамкеева': 'Онлайн/оффлайн',
  'Жылдыз Мади': 'Онлайн/оффлайн',
  'Руфина Мажитова': 'Онлайн/оффлайн',
  'Алина Сасаза': 'Онлайн/оффлайн',
  'Ксения Антонова': 'Онлайн',
  'Вера Романенко': 'Онлайн/оффлайн',
  'Джамал Дуйшекеева': 'Онлайн',
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
          const sorted = [...res.message].sort((a: StaffItem, b: StaffItem) => {
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
