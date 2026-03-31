import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getStaffByBusinessId, getMasterById, MasterProfile } from '../../api/api';
import { config } from '@/config/env';
import Image from 'next/image';
import Head from 'next/head';
import StaffHeader from '../../components/StaffHeader';
import Footer from '../../components/Footer';
import StaffProfileModal from '../../components/StaffProfileModal';

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

// Custom sort order for the staff gallery
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

// Per-psychologist price display in the gallery
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

// Per-psychologist session format display
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

// Per-psychologist speciality (subtitle) override
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

// Per-psychologist experience display
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

// Per-psychologist about text for gallery cards
const STAFF_ABOUT_MAP: Record<string, string> = {
  'Чолпон Кадралиева': 'Терапия у меня строится бережно и индивидуально, с опорой на Вашу историю, состояние и то, что происходит в жизни сейчас. Часто ко мне приходят с социальной тревогой, когда в общении постоянно включаются вина и стыд. Если кажется, что Вас оценивают, что Вы "не так сказали", "не так выглядите", "не так себя ведете", и после встреч с людьми остаётся напряжение, прокручивание разговоров, усталость, вам ко мне. Еще одна важная часть моей работы, отношения. Как Вы чувствуете себя рядом с людьми, в социуме, в близости. Как Вы выбираете, подстраиваетесь, отдаляетесь, терпите, молчите или, наоборот, защищаетесь. Мы исследуем, что происходит между Вами и другими, и что происходит внутри Вас, какие потребности остаются без ответа, какие границы сложно держать, какие сценарии повторяются',
  'Адинай Жапаралиева': 'Я психолог, сопровождаю людей, столкнувшихся с насилием, помогая им вернуть опору на себя и двигаться к безопасной и устойчивой жизни. Работаю со взрослыми клиентами, переживающими трудные жизненные периоды и последствия травматического опыта. Использую методы КПТ, экзистенциальной терапии и нарративной экспозиционной терапии.',
  'Заира Рамзанова': 'Работаю с подростками с 14 лет, также помогаю родителям лучше понимать подростка и выстраивать контакт без постоянных конфликтов. Вместе разбираем тревогу, перепады настроения, замкнутость, сложности с границами и общением. Подход научный, без эзотерики, в темпе, который выдерживается.',
  'Заира Рамазанова': 'Работаю с подростками с 14 лет, также помогаю родителям лучше понимать подростка и выстраивать контакт без постоянных конфликтов. Вместе разбираем тревогу, перепады настроения, замкнутость, сложности с границами и общением. Подход научный, без эзотерики, в темпе, который выдерживается.',
  'Асел Молдош': 'Если в отношениях появилась измена, напряжение, недоверие, много боли и вопросов без ответов, вам подойдет работа со мной. Мы бережно разбираем, что произошло, как это влияет на Вас и пару, что сейчас важно восстановить, и как дальше выстраивать границы, диалог и безопасность, независимо от того, хотите ли Вы сохранять отношения или нет. Также я работаю с запросами про сексуальность и интимную сферу, когда есть дискомфорт, снижение желания, трудности с возбуждением или оргазмом, боль, страх близости, стыд, вина, сложность говорить о своих потребностях. На моих консультациях много поддержки, ясности и конкретных шагов, чтобы стало спокойнее, понятнее и ближе к Вашей реальной жизни.',
  'Анна Анастасиади': 'Я работаю с теми, кто чувствует: «Так больше не хочу». С теми, кто устал повторять знакомые и болезненные сценарии. В нашей работе мы не ищем быстрые решения. Мы аккуратно разбираем ваши внутренние механизмы, чтобы изменения стали устойчивыми.',
  'Наталья Джунковская': 'Моя основная тема: пережитое насилие, физическое, эмоциональное, сексуализированное. Если после опыта остались страх, стыд, вина, ощущение "со мной что-то не так", трудности с границами и доверием, тревога, напряжение в теле, сложности в близости или отношениях, с этим можно прийти. В терапии мы двигаемся в Вашем темпе, без давления и оценок, чтобы постепенно вернуть чувство безопасности, ясности и права быть собой.',
  'Александр Клеваков': 'В своей практике я использую разнообразные подходы, подбирая индивидуальные методики для каждого человека. Моя цель как специалиста – помочь вам наладить гармоничные отношения с собой и окружающими, а также выявить поведенческие и эмоциональные паттерны, влияющие на качество вашей жизни.',
  'Астра Исаева': 'Я практикующий психолог, работаю с травматическим опытом. Ко мне приходят, когда внутри много тревоги, усталости и напряжения, когда выгорание уже не проходит само, а отношения начинают изматывать или повторяются одни и те же болезненные сценарии. На встречах мы разбираем, что именно поддерживает тяжёлые состояния, учимся снижать эмоциональную нагрузку, замечать свои границы и потребности, и находить более устойчивые способы реагирования. Работа идёт в Вашем темпе, с опорой на безопасность и ясность, чтобы становилось легче жить, общаться и справляться с тем, что раньше выбивало из колеи.',
  'Виктор Толмасов': 'Я клинический психолог, гештальт терапевт, гештальт консультант. Помогаю при депрессии, ОКР, РПП, ПТСР, СДВГ, работаю совместно с психиатрами при шизофрении. Работаю с запросами: потеря близкого, работы, смысла жизни, низкая самооценка, страхи, панические атаки, семейные проблемы, суицидальные мысли, состояния после экстремальных ситуация и любые другие переживания.',
  'Джамиля Абилдаева': 'Привет! Ко мне приходят, когда хочется лучше понять себя и свою жизнь, но внутри больше вопросов, чем ответов. В эти моменты привычные опоры не работают, меняется настроение и мотивация, и приходит ощущение "я не там". Моя основная тема, личностное развитие, возрастные кризисы и поиск себя. В работе мы бережно разбираем, что с Вами происходит сейчас, какие ценности и желания действительно Ваши, что мешает двигаться дальше, и где Вы себя теряете. Постепенно появится больше ясности, смысла и внутренней опоры, станет легче выбирать то, что подходит именно Вам.',
  'Акылай Шамкеева': 'Помогаю лучше понимать себя, свои чувства, мысли и то, как тело реагирует на стресс и переживания. Вместе мы разбираем, почему повторяются одни и те же ситуации, и ищем, что можно изменить, чтобы стало легче и спокойнее. Частая тема, поиск себя и личностные кризисы. Когда Вы словно "застряли", потеряли опору, не понимаете, чего хотите, или сложно сделать выбор. В терапии мы проясняем, что для Вас важно, где Вы себя теряете, и как шаг за шагом возвращать ясность и внутреннюю устойчивость.',
  'Жылдыз Мади': 'Привет. Меня зовут Жылдыз. Я - психолог, работаю в гештальт-подходе. Я помогаю девушкам и женщинам в сложных ситуациях, находящихся в токсичных и абьюзивных отношениях с партнёром или родителями, работаю с детскими травмами, низкой самооценкой, неуверенностью в себе. Помогаю пережить горе и утрату.',
  'Руфина Мажитова': 'Здравствуйте, меня зовут Руфина, я практикующий психолог, окончила бакалавр, гештальт терапевт. Практику начинала работая с детками, как детский психолог-дефектолог. Сейчас работаю как с детьми/подростками, так и взрослыми. На терапии использую различные методы: арт терапия, мак карты, психодрама, телесно ориентированная терапия и тд подбирая индивидуальный подход.',
  'Алина Сасаза': 'Привет! Меня зовут Алина и практикующий психолог. Я научу тебя осознанности и мы вместе пойдем в твое детство, проживем его и взрастим в тебе внутреннюю опору! Мой опыт работы был психологом-консультантом в туристической фирме, я работала долгое время преподавателей на кафедре "Психология", работа коррекционным педагогом с детьми с инвалидностью, педагогом по дошкольной подготовке, работала психологом-тренер в строительной компании, банке. Параллельно работала практикующим психологом-консультантом, выпустила успешно не одну тренинговую группу, прохожу супервизии раз в полгода и несколько лет нахожусь в личной терапии.',
  'Ксения Антонова': 'Привет, я Ксения! Работаю в мягком и уважительном подходе. Помогаю женщинам и мужчинам любого возраста глубоко разобраться в себе, снизить тревожность и повысить радость, научиться управлять эмоциями, улучшить или построить отношения, выйти из замкнутого круга. Методы: Транзактный анализ и Символдрама.',
  'Вера Романенко': 'Привет, меня зовут Вера. Провожу психологические консультации в методе экзистенциального анализа. Помогаю взрослым в сложных жизненных ситуациях найти опоры и ценности, чтобы мочь жить с внутренним согласием. В работе достаточно бережная, принимающая и толерантная. Конфиденциальность гарантирую.',
};

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
        const sorted = [...res.message].sort((a, b) => {
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
