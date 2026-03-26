import { GetServerSideProps } from 'next';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  getMasterById,
  MasterProfile,
  MasterEducation,
  MasterQualification,
} from '../../api/api';
import { config } from '../../config/env';
import StaffHeader from '../../components/StaffHeader';
import Footer from '../../components/Footer';
import {
  Mail,
  Tag,
  Heart,
  GraduationCap,
  Award,
  Lightbulb,
  Globe,
  BadgeDollarSign,
  Clock,
  MessageCircle,
  User,
  CalendarDays,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface StaffProfilePageProps {
  master: MasterProfile | null;
}

/* ---------- helpers ---------- */

function formatEducation(e: MasterEducation) {
  const parts = [e.institution, e.degree, e.fieldOfStudy].filter(
    (p) => p && p !== 'string'
  );
  if (parts.length === 0) return null;
  const sy = e.startDate ? e.startDate.slice(0, 4) : '';
  const ey = e.endDate ? e.endDate.slice(0, 4) : '';
  const period = sy && ey ? `${sy} – ${ey}` : sy || ey;
  return { text: parts.join(', '), period, description: e.description };
}

function formatQualification(q: MasterQualification) {
  const year = q.issueDate ? q.issueDate.slice(0, 4) : '';
  return {
    title: q.title,
    org: q.issuingOrganization,
    year,
    docUrl: q.documentUrl,
    certNum: q.certificateNumber,
  };
}

function getMinPrice(services: MasterProfile['services']) {
  if (!services || services.length === 0) return null;
  const min = services.reduce((m, s) => (s.price < m.price ? s : m), services[0]);
  return { price: min.price, symbol: min.currencySymbol };
}

/* ---------- nav sections ---------- */

const NAV_SECTIONS = [
  { id: 'about', label: 'О себе' },
  { id: 'credentials', label: 'Квалификация' },
  { id: 'letter', label: 'Письмо моему клиенту' },
  { id: 'services', label: 'Услуги' },
  { id: 'booking', label: 'Запись' },
];

/* ========== COMPONENT ========== */

export default function StaffProfilePage({ master }: StaffProfilePageProps) {
  const [activeSection, setActiveSection] = useState('about');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!master) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    for (const ref of Object.values(sectionRefs.current)) {
      if (ref) observer.observe(ref);
    }
    return () => observer.disconnect();
  }, [master]);

  // Timeline scroll-reveal animation
  useEffect(() => {
    if (!master) return;
    const tlObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    const blocks = document.querySelectorAll('.sp-tl__block');
    blocks.forEach((b) => tlObserver.observe(b));
    return () => tlObserver.disconnect();
  }, [master]);

  /* 404 */
  if (!master) {
    return (
      <>
        <Head><title>Специалист не найден — Legko</title></Head>
        <StaffHeader />
        <main className="sp-page">
          <div className="container">
            <div className="sp-not-found">
              <Image src="/images/пушистик грусть.png" alt="" width={180} height={180} unoptimized />
              <h1>Специалист не найден</h1>
              <p>Возможно, профиль был удалён или ссылка устарела.</p>
              <Link href="/staff" className="btn btn--primary btn--large">
                <i className="fas fa-arrow-left" aria-hidden /> К каталогу
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* Data prep */
  const minPrice = getMinPrice(master.services);

  // Build unified timeline: education + qualifications sorted by year desc
  type TimelineItem =
    | { type: 'edu'; period: string; sortYear: number; title: string; subtitle: string; desc: string | null }
    | { type: 'cert'; period: string; sortYear: number; title: string; org: string | null; docUrl: string | null; certNum: string | null };

  const timelineItems: TimelineItem[] = [];

  for (const e of master.educations || []) {
    const fmt = formatEducation(e);
    if (!fmt) continue;
    const sortYear = e.endDate ? parseInt(e.endDate.slice(0, 4), 10) : e.startDate ? parseInt(e.startDate.slice(0, 4), 10) : 0;
    timelineItems.push({
      type: 'edu',
      period: fmt.period,
      sortYear,
      title: e.institution && e.institution !== 'string' ? e.institution : fmt.text,
      subtitle: [e.degree, e.fieldOfStudy].filter((p) => p && p !== 'string').join(', '),
      desc: fmt.description && fmt.description !== 'string' ? fmt.description : null,
    });
  }

  for (const q of master.qualifications || []) {
    const fq = formatQualification(q);
    const sortYear = q.issueDate ? parseInt(q.issueDate.slice(0, 4), 10) : 0;
    timelineItems.push({
      type: 'cert',
      period: fq.year,
      sortYear,
      title: fq.title,
      org: fq.org,
      docUrl: fq.docUrl,
      certNum: fq.certNum,
    });
  }

  // Education first, then certs — each group sorted by year descending
  const eduItems = timelineItems.filter((t) => t.type === 'edu').sort((a, b) => b.sortYear - a.sortYear);
  const certItems = timelineItems.filter((t) => t.type === 'cert').sort((a, b) => b.sortYear - a.sortYear);
  const timeline = [...eduItems, ...certItems];
  const cityName = master.address?.addressLine?.split(',')[0]?.trim() || 'Бишкек';
  const whatsappUrl = 'https://wa.me/996700595393';
  const bookingUrl = `${config.bookingBaseUrl}/master/${master.id}`;

  // Extended fields that may come from API
  const ext = master as MasterProfile & {
    topics?: string[];
    languages?: string[];
    lgbtFriendly?: boolean;
    workMethod?: string;
  };

  // Letters from psychologists to their clients, keyed by name
  const PSYCHOLOGIST_LETTERS: Record<string, string> = {
    'Чолпон Кадралиева': `Я клинический психолог и травматерапевт. В своей работе опираюсь не на идею «собери себя и живи правильно», а на понимание, что у каждой реакции есть своя история. Обычно человек приходит не потому, что он что-то делает не так, а потому что психика научилась когда-то так для выживания.

Вы можете прийти с разными состояниями: тревогой, стыдом, злостью, пустотой, запутанностью, повторяющимися ситуациями в отношениях, ощущением "со мной что-то не так".

Обычно это не проблема характера, а психические защиты установленные в трудных моментах прошлого, которые оказывают слишком большое влияние на ваше настоящее.
Поэтому на сессиях мы не боремся с вами и не боремся с симптомами.
Мы постепенно разбираемся, от чего вас защищает психика и почему именно так.

В работе я бережная и достаточно внимательная к темпу человека.
Я не тороплю рассказывать больше, чем вы готовы, и не давлю, если говорить трудно. Иногда терапия - это разговор, иногда паузы, иногда мы просто учимся замечать, что внутри вообще что-то происходит и об этом можно говорить, чувствовать и выдерживать рядом с другим человеком.

Мне важно, чтобы вам не нужно было быть удобным, сильным или понятным.
Можно сомневаться, злиться, молчать, путаться - это часть процесса.

Мы не будем пытаться «убрать» ваши реакции.
А сделаем так, чтобы необходимость в них постепенно уменьшалась.`,

    'Адинай Жапаралиева': `Кризис – поворотный пункт на жизненном пути, нарушающий наш эмоциональный баланс. В кризисе часто ощущается угроза нашему обычному существованию, которую сложно контролировать и с которой сложно справляться.

Человек, переживающий подобные состояния, как никто, нуждается для скорейшего выздоровления в помощи грамотного психолога, в поддержке, всестороннем анализе своей ситуации, понимании и безусловном приятии, и Вы, конечно же, получите их в нашей работе.

Я помогу Вам не только пройти через жизненные испытания, не разрушая себя, но и вырасти на них, повысить свою самооценку, и окрепнуть, осознать ценность этого опыта для выхода из сценария и построения Сильного, Счастливого и Независимого Я!`,

    'Заира Рамзанова': `Здравствуйте. Вы уже немного прочитали обо мне, поэтому здесь хочу коротко рассказать о том, как я вижу свою работу и чем могу быть полезна.

Я всегда стараюсь смотреть на ситуацию с разных сторон и не ищу «виноватых». Обычно люди действуют из лучших побуждений, но не всегда знают, как по-другому справиться с эмоциями, договориться или донести свои мысли. Часто не хватает конкретных навыков - например, уверенного общения, понимания своих чувств или способов справляться со стрессом. В этом процессе я становлюсь поддержкой и помогаю разобраться шаг за шагом.

Я работаю и с подростками (примерно с 14 лет). Подростковый возраст – это сложный переходный период, в котором возникают те же переживания, что и у взрослых: тревога, одиночество, конфликты, неуверенность в себе. И очень важно, когда в это время есть возможность поговорить с нейтральным взрослым, который выслушает, не осудит и поможет понять, что происходит.

Также я работаю с семьями - родителями и подростками, партнёрами, семьями с детьми. В семейной работе я не встаю ни на чью сторону. Моя задача - помочь вам услышать друг друга, снизить напряжение и найти такой способ взаимодействия, который подойдёт именно вашей семье.

Если вы чувствуете, что запутались, устали от конфликтов или просто хотите, чтобы в отношениях стало спокойнее и понятнее - можно начать с одной встречи.`,

    'Заира Рамазанова': `Здравствуйте. Вы уже немного прочитали обо мне, поэтому здесь хочу коротко рассказать о том, как я вижу свою работу и чем могу быть полезна.

Я всегда стараюсь смотреть на ситуацию с разных сторон и не ищу «виноватых». Обычно люди действуют из лучших побуждений, но не всегда знают, как по-другому справиться с эмоциями, договориться или донести свои мысли. Часто не хватает конкретных навыков - например, уверенного общения, понимания своих чувств или способов справляться со стрессом. В этом процессе я становлюсь поддержкой и помогаю разобраться шаг за шагом.

Я работаю и с подростками (примерно с 14 лет). Подростковый возраст – это сложный переходный период, в котором возникают те же переживания, что и у взрослых: тревога, одиночество, конфликты, неуверенность в себе. И очень важно, когда в это время есть возможность поговорить с нейтральным взрослым, который выслушает, не осудит и поможет понять, что происходит.

Также я работаю с семьями - родителями и подростками, партнёрами, семьями с детьми. В семейной работе я не встаю ни на чью сторону. Моя задача - помочь вам услышать друг друга, снизить напряжение и найти такой способ взаимодействия, который подойдёт именно вашей семье.

Если вы чувствуете, что запутались, устали от конфликтов или просто хотите, чтобы в отношениях стало спокойнее и понятнее - можно начать с одной встречи.`,

    'Асел Молдош': `Работаю с детьми, подростками, взрослыми и семейными парами в индивидуальном формате и на групповых тренингах. Вы можете обратиться ко мне с любым вопросом, даже самым деликатным, – здесь вы получите поддержку, понимание и бережное отношение. Вместе мы будем исследовать ваши транзакции - взаимодействия и обмены информацией с окружающими, чтобы выявить, какие из них способствуют вашему благополучию, а какие могут вызывать негативные реакции.`,

    'Анна Анастасиади': `Здравствуйте!

Я верю в терапию, где полностью можно быть собой. В работу, где не нужно быть удобным, сильным или правильным.

Для меня психология не про поиск недостатков. Это про возвращение к себе. К своим чувствам. К своим границам. К своей внутренней опоре. Я работаю бережно и глубоко. Мне важно не просто выслушать, а помочь вам понять глубинные причины того, что происходит в жизни, чтобы изменения были устойчивыми, а не временными.
В моих ценностях – уважение и принятие личности. Терапия для меня – зрелый диалог двух взрослых людей. Про ответственность, честность и постепенное возвращение к своей внутренней опоре.

Только совместная работа, где вы постепенно начинаете слышать себя и видеть яснее.

Если вам важно не просто поговорить, а по-настоящему разобраться – буду рядом.

С любовью, Анна
Практикующий психолог`,

    'Наталья Джунковская': `Иногда страшно идти к психологу.
Страшно быть непонятой. Осуждённой. «Слишком чувствительной».

Со мной можно говорить о сложном.
О том, о чём стыдно, больно или трудно признаться даже себе.

Я не оцениваю и не воспитываю.
Я поддерживаю и помогаю разобраться.

В работе для меня важны безопасность, уважение и профессиональность.
Вы не обязаны справляться в одиночку.`,

    'Александр Клеваков': `Мой подход к работе основан на создании уважительной и безопасной среды, где вы можете быть живым и свободно исследовать себя, задавать вопросы, сомневаться, испытывать разные чувства и эмоции.
Вместе мы выясним, что делает вас по-настоящему счастливым, что этому мешает, и самое главное – что с этим можно делать.

Человек – это то, на что он направляет своё внимание. Моя задача, как психолога, – помочь вам осознать, куда направлены ваше внимание и жизненная энергия. Это осознание станет отправной точкой для кардинального улучшения качества вашей жизни.`,

    'Астра Исаева': `Я являюсь членом Международной ассоциации КПТ и Американской ассоциации EMDR в Кыргызстане.

Я работаю бережно, экологично и с уважением к темпу клиента.
Важной частью терапии считаю создание безопасного пространства, где можно открыто говорить о сложных чувствах и постепенно восстанавливать внутреннюю устойчивость.`,

    'Виктор Толмасов': `В работе придерживаюсь 4 принципов: конфиденциальность, профессионализм, принятие, честность.`,

    'Джамиля Абилдаева': `Дорогой читатель,

Если ты видишь это письмо, скорее всего, внутри уже есть что-то, с чем тяжело оставаться одному.

Тревога, усталость, повторяющиеся и неработающие более сценарии из жизни, ощущение «я вроде справляюсь, но больше так не могу» – у каждого это звучит по-своему, но не все понимают, что это такое и как с этим справиться. И я здесь, чтобы хоть немного помочь тебе внести ясность в то, что с тобой происходит.

Я не обещаю тебе быстрых изменений и «исцеление за одну встречу». Психотерапия – это в первую очередь работа. Зачастую непростая. Но это работа, в которой ты не обязан быть удобным или правильным.

На сессиях со мной можно говорить честно. Можно злиться, путаться, молчать, плакать. Можно не знать, с чего начать – потому что мы начнём вместе. Я аккуратна с границами, внимательна к деталям и не обесцениваю то, что для тебя важно, даже если это кажется «мелочью».

Мне важно не просто выслушать, а помочь тебе увидеть закономерности, которые ты, возможно, уже сам ощущаешь, но продолжаешь проживать их на автомате. Понять, где ты теряешься и постепенно вернуть ощущение опоры – на себя.
Если ты привык справляться самостоятельно, возможно, решение обратиться за помощью будет непростым. Но иногда самый взрослый шаг – это разрешить себе поддержку.

Если откликается, то я здесь и готова помочь тебе!`,

    'Акылай Шамкеева': `Если вы читаете это – возможно, внутри уже есть усталость.
От тревоги. От повторяющихся сценариев. От ощущения, что «я стараюсь, но снова не так».
Может быть, вы привыкли справляться сами – быть сильной, удобной, понимающей. А то, что происходит внутри, оставлять при себе.
В терапии не нужно быть хорошей или правильной. Не нужно держаться и соответствовать ожиданиям. Здесь можно быть настоящей – со своими сомнениями, злостью, страхом, уязвимостью.

Я работаю в гештальт-подходе с применением инструментов КПТ. Мне важно не только разобраться в ваших мыслях и реакциях, но и помочь вам лучше почувствовать себя – свои границы, желания, потребности.
Мы будем вместе смотреть, откуда берётся тревога, почему повторяются одни и те же отношения и в каких моментах вы теряете опору. Постепенно вы начнёте лучше понимать себя и по-другому выстраивать свою жизнь.

Я не оцениваю и не даю готовых рецептов. Я рядом, чтобы вы могли услышать себя и научиться опираться на себя.

Если вам откликается – буду рада пройти этот путь вместе.`,
  };

  // Use custom letter if available, otherwise fall back to generated letter
  const getLetterText = (name: string, aboutMe: string): string => {
    if (PSYCHOLOGIST_LETTERS[name]) {
      return PSYCHOLOGIST_LETTERS[name];
    }
    // Fallback: generate from aboutMe
    const firstName = name.split(' ')[0];
    return [
      'Здравствуйте,',
      '',
      'Если вы читаете это — значит, вы уже сделали важный шаг. Сам поиск поддержки требует смелости, и я хочу, чтобы вы знали: вы не одни в этом.',
      '',
      aboutMe,
      '',
      'Вы заслуживаете пространство, где вас услышат без осуждения. Где можно быть собой. Где перемены происходят в вашем ритме.',
      '',
      'Я буду рада, если мы пройдём этот путь вместе.',
      '',
      `С теплом, ${firstName}`,
    ].join('\n');
  };

  const letterText = master.aboutMe ? getLetterText(master.name, master.aboutMe) : '';

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Head>
        <title>{master.name} — психолог | Legko</title>
        <meta
          name="description"
          content={`${master.name} — ${master.speciality}. Опыт ${master.experience} лет. Запишитесь на консультацию на Legko.live`}
        />
      </Head>
      <StaffHeader />

      <main className="sp-page">
        {/* ===== HERO ===== */}
        <section className="sp-hero">
          <div className="sp-hero__gradient">
            <div className="sp-hero__decor sp-hero__decor--1" />
            <div className="sp-hero__decor sp-hero__decor--2" />
            <div className="sp-hero__decor sp-hero__decor--3" />

            <div className="container">
              <div className="sp-hero__layout">
                {/* Photo */}
                <div className="sp-hero__photo-col">
                  <div className="sp-hero__photo-wrap">
                    {master.photo ? (
                      <Image
                        src={master.photo}
                        alt={master.name}
                        width={220}
                        height={220}
                        className="sp-hero__photo"
                        unoptimized
                        priority
                      />
                    ) : (
                      <div className="sp-hero__initials">
                        {master.name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="sp-hero__info">
                  <h1 className="sp-hero__name">{master.name}</h1>
                  <p className="sp-hero__speciality">{master.speciality}</p>

                  <div className="sp-hero__chips">
                    <span className="sp-hero__chip">
                      <i className="fas fa-briefcase" aria-hidden />
                      {master.experience} лет опыта
                    </span>
                    {master.rating > 0 && (
                      <span className="sp-hero__chip sp-hero__chip--rating">
                        <i className="fas fa-star" aria-hidden />
                        {master.rating.toFixed(1)}
                      </span>
                    )}
                    <span className="sp-hero__chip">
                      <i className="fas fa-map-marker-alt" aria-hidden />
                      {cityName}
                    </span>
                    {master.numberOfClients > 0 && (
                      <span className="sp-hero__chip">
                        <i className="fas fa-users" aria-hidden />
                        {master.numberOfClients}+ клиентов
                      </span>
                    )}
                    {minPrice && (
                      <span className="sp-hero__chip">
                        <i className="fas fa-tag" aria-hidden />
                        от {minPrice.price.toLocaleString('ru-RU')} {minPrice.symbol}
                      </span>
                    )}
                  </div>

                  <a href={bookingUrl} className="sp-hero__cta" target="_blank" rel="noopener noreferrer">
                    <CalendarDays width={20} height={20} color="currentColor" aria-hidden />
                    Записаться
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="sp-trust-bar">
            <div className="container">
              <div className="sp-trust-bar__inner">
                <div className="sp-trust-bar__item">
                  <div className="sp-trust-bar__icon"><i className="fas fa-shield-alt" aria-hidden /></div>
                  <div>
                    <span className="sp-trust-bar__value">Проверен</span>
                    <span className="sp-trust-bar__label">командой Legko</span>
                  </div>
                </div>
                <div className="sp-trust-bar__item">
                  <div className="sp-trust-bar__icon"><i className="fas fa-graduation-cap" aria-hidden /></div>
                  <div>
                    <span className="sp-trust-bar__value">Высшее</span>
                    <span className="sp-trust-bar__label">образование</span>
                  </div>
                </div>
                <div className="sp-trust-bar__item">
                  <div className="sp-trust-bar__icon"><i className="fas fa-certificate" aria-hidden /></div>
                  <div>
                    <span className="sp-trust-bar__value">{certItems.length} сертификат{certItems.length === 1 ? '' : certItems.length < 5 ? 'а' : 'ов'}</span>
                    <span className="sp-trust-bar__label">подтверждено</span>
                  </div>
                </div>
                <div className="sp-trust-bar__item">
                  <div className="sp-trust-bar__icon"><i className="fas fa-calendar-check" aria-hidden /></div>
                  <div>
                    <span className="sp-trust-bar__value">{master.experience} лет</span>
                    <span className="sp-trust-bar__label">практики</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DOT NAV (desktop) ===== */}
        <nav className="sp-dotnav" aria-label="Навигация по секциям">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`sp-dotnav__dot ${activeSection === s.id ? 'sp-dotnav__dot--active' : ''}`}
              onClick={() => scrollTo(s.id)}
              aria-label={s.label}
              title={s.label}
            >
              <span className="sp-dotnav__tooltip">{s.label}</span>
            </button>
          ))}
        </nav>

        {/* ===== CONTENT ===== */}
        <div className="container">
          <div className="sp-content">

            {/* 1. О себе — текст описания */}
            {master.aboutMe && (
              <section className="sp-section sp-section--divided" id="about" ref={(el) => { sectionRefs.current.about = el; }}>
                <div className="sp-section__header">
                  <User width={20} height={20} color="#6C5CE7" aria-hidden />
                  <h2 className="sp-section__title">О себе</h2>
                </div>
                <p className="sp-about-text">{master.aboutMe}</p>

                {ext.topics && ext.topics.length > 0 && (
                  <div className="sp-about__topics">
                    <div className="sp-section__header">
                      <Tag width={20} height={20} color="#6C5CE7" aria-hidden />
                      <h3 className="sp-section__subtitle">С чем работаю</h3>
                    </div>
                    <div className="sp-topics">
                      {ext.topics.map((topic, i) => (
                        <span key={i} className="sp-topic-chip">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}

                {ext.lgbtFriendly && (
                  <div className="sp-lgbt-badge">
                    <Heart width={20} height={20} color="currentColor" aria-hidden />
                    Работаю с ЛГБТ+
                  </div>
                )}
              </section>
            )}

            {/* 2. Метод работы — отдельный блок */}
            {ext.workMethod && (
              <section className="sp-section sp-section--divided">
                <div className="sp-section__header">
                  <Lightbulb width={20} height={20} color="#6C5CE7" aria-hidden />
                  <h2 className="sp-section__title">Метод работы</h2>
                </div>
                <p className="sp-about-text">{ext.workMethod}</p>
              </section>
            )}

            {/* 4. Языки работы */}
            {ext.languages && ext.languages.length > 0 && (
              <section className="sp-section sp-section--divided">
                <div className="sp-section__header">
                  <Globe width={20} height={20} color="#6C5CE7" aria-hidden />
                  <h2 className="sp-section__title">Языки работы</h2>
                </div>
                <div className="sp-languages">
                  {ext.languages.map((lang, i) => (
                    <span key={i} className="sp-language-chip">
                      <Globe width={16} height={16} color="currentColor" aria-hidden />
                      {lang}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Образование + сертификаты — zigzag таймлайн */}
            {timeline.length > 0 && (
              <section className="sp-section sp-section--wide sp-section--divided" id="credentials" ref={(el) => { sectionRefs.current.credentials = el; }}>
                <div className="sp-section__header">
                  <GraduationCap width={20} height={20} color="#6C5CE7" aria-hidden />
                  <h2 className="sp-section__title">Образование и квалификация</h2>
                </div>
                <div className="sp-tl">
                  {timeline.map((item, i) => (
                    <div key={i} className="sp-tl__block">
                      <div className="sp-tl__marker">
                        {item.type === 'edu'
                          ? <GraduationCap width={18} height={18} color="#fff" aria-hidden />
                          : <Award width={18} height={18} color="#fff" aria-hidden />
                        }
                      </div>
                      <div className="sp-tl__card">
                        <div className="sp-tl__card-accent" />
                        {item.period && (
                          <span className="sp-tl__year">{item.period}</span>
                        )}
                        <h4 className="sp-tl__title">{item.title}</h4>
                        {item.type === 'edu' && item.subtitle && (
                          <p className="sp-tl__sub">{item.subtitle}</p>
                        )}
                        {item.type === 'edu' && item.desc && (
                          <p className="sp-tl__sub">{item.desc}</p>
                        )}
                        {item.type === 'cert' && item.org && (
                          <p className="sp-tl__sub">{item.org}</p>
                        )}
                        {item.type === 'cert' && (item.certNum || item.docUrl) && (
                          <div className="sp-tl__footer">
                            {item.certNum && (
                              <span className="sp-tl__cert-num">№ {item.certNum}</span>
                            )}
                            {item.docUrl && (
                              <a href={item.docUrl} target="_blank" rel="noopener noreferrer" className="sp-tl__doc-link">
                                <ExternalLink width={12} height={12} color="currentColor" aria-hidden />
                                Документ
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Письмо моему клиенту */}
            {letterText && (
              <section className="sp-section sp-section--divided" id="letter" ref={(el) => { sectionRefs.current.letter = el; }}>
                <div className="sp-section__header">
                  <Mail width={20} height={20} color="#6C5CE7" aria-hidden />
                  <h2 className="sp-section__title">Письмо моему клиенту</h2>
                </div>
                <blockquote className="sp-letter">
                  <span className="sp-letter__quote" aria-hidden>&ldquo;</span>
                  {letterText.split('\n').map((line, i) => (
                    line === '' ? <br key={i} /> : <p key={i}>{line}</p>
                  ))}
                </blockquote>
              </section>
            )}

            {/* Inline CTA after letter */}
            <div className="sp-inline-cta">
              <p className="sp-inline-cta__text">Готовы начать? Запишитесь на первую консультацию</p>
              <a href={bookingUrl} className="sp-inline-cta__btn" target="_blank" rel="noopener noreferrer">
                <CalendarDays width={18} height={18} color="currentColor" aria-hidden />
                Записаться
              </a>
            </div>

            {/* 7. Услуги и цены */}
            {master.services && master.services.length > 0 && (
              <section className="sp-section sp-section--divided" id="services" ref={(el) => { sectionRefs.current.services = el; }}>
                <div className="sp-section__header">
                  <BadgeDollarSign width={20} height={20} color="#6C5CE7" aria-hidden />
                  <h2 className="sp-section__title">Услуги и цены</h2>
                </div>
                <div className="sp-services-grid">
                  {master.services.map((s) => (
                    <div key={s.id} className="sp-service-tile">
                      <h3 className="sp-service-tile__name">{s.name}</h3>
                      <span className="sp-service-tile__duration">
                        <Clock width={14} height={14} color="currentColor" aria-hidden />
                        {s.duration} мин
                      </span>
                      <span className="sp-service-tile__price">
                        {s.price.toLocaleString('ru-RU')} {s.currencySymbol}
                      </span>
                      <a href={bookingUrl} className="sp-service-tile__btn" target="_blank" rel="noopener noreferrer">
                        <CalendarDays width={14} height={14} color="currentColor" aria-hidden />
                        Записаться
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Как записаться — иконки вместо цифр */}
            <section className="sp-section sp-section--divided" id="booking" ref={(el) => { sectionRefs.current.booking = el; }}>
              <div className="sp-section__header">
                <CalendarDays width={20} height={20} color="#6C5CE7" aria-hidden />
                <h2 className="sp-section__title">Как записаться</h2>
              </div>
              <div className="sp-steps">
                <div className="sp-step">
                  <span className="sp-step__icon">
                    <MessageCircle width={24} height={24} color="#fff" aria-hidden />
                  </span>
                  <div className="sp-step__body">
                    <h3>Напишите нам</h3>
                    <p>Свяжитесь через WhatsApp — расскажите, с чем хотите работать</p>
                  </div>
                </div>
                <div className="sp-steps__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                </div>
                <div className="sp-step">
                  <span className="sp-step__icon">
                    <CalendarDays width={24} height={24} color="#fff" aria-hidden />
                  </span>
                  <div className="sp-step__body">
                    <h3>Подберём время</h3>
                    <p>Согласуем удобное время для первой консультации</p>
                  </div>
                </div>
                <div className="sp-steps__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                </div>
                <div className="sp-step">
                  <span className="sp-step__icon">
                    <Sparkles width={24} height={24} color="#fff" aria-hidden />
                  </span>
                  <div className="sp-step__body">
                    <h3>Начните терапию</h3>
                    <p>Первая сессия — знакомство и план вашей работы</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="sp-cta">
              <div className="sp-cta__inner">
                <Image
                  src="/images/пушистик радость.png"
                  alt=""
                  width={120}
                  height={120}
                  className="sp-cta__mascot"
                  unoptimized
                  aria-hidden
                />
                <div className="sp-cta__content">
                  <h2 className="sp-cta__title">Готовы сделать первый шаг?</h2>
                  <p className="sp-cta__text">
                    Запишитесь на первую консультацию — это начало перемен к лучшему
                  </p>
                  <a href={bookingUrl} className="sp-cta__btn" target="_blank" rel="noopener noreferrer">
                    <CalendarDays width={20} height={20} color="currentColor" aria-hidden />
                    Записаться
                  </a>
                </div>
              </div>
            </section>

            {/* Back */}
            <div className="sp-back">
              <Link href="/staff" className="sp-back__link">
                <ArrowLeft width={16} height={16} color="currentColor" aria-hidden />
                Все специалисты
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="sp-sticky-cta">
        <a href={bookingUrl} className="sp-sticky-cta__btn" target="_blank" rel="noopener noreferrer">
          <CalendarDays width={20} height={20} color="currentColor" aria-hidden />
          Записаться
        </a>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<StaffProfilePageProps> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const res = await getMasterById(id);
    if (res?.code === 200 && res.message) {
      return { props: { master: res.message } };
    }
    return { notFound: true };
  } catch {
    return { notFound: true };
  }
};
