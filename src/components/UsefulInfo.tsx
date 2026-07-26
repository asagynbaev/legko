import Link from 'next/link';
import { Brain, ShieldCheck, Heart, ArrowRight, BookOpen } from '@phosphor-icons/react';

const CARDS = [
  {
    href: '/specialisty',
    icon: <Brain size={26} />,
    title: 'Психолог, психотерапевт, психиатр — в чём разница?',
    text: 'Все они помогают, но по-разному. Разбираем, кто и с какими запросами работает, чтобы вы знали, кто подойдёт именно вам.',
    more: 'Разобраться в специалистах',
  },
  {
    href: '/pomosh-kg',
    icon: <ShieldCheck size={26} />,
    title: 'Психологическая помощь в Кыргызстане',
    text: 'На какие законы и этические стандарты опирается наш сервис, как защищены ваши данные и куда обратиться в экстренной ситуации.',
    more: 'Наши стандарты',
  },
  {
    href: '/o-nas',
    icon: <Heart size={26} />,
    title: 'Про нас',
    text: 'Почему мы создали «Легко», как подбираем психологов и во что верим. Забота о себе — это важная часть полноценной жизни.',
    more: 'Узнать о нас',
  },
];

const UsefulInfo = () => (
  <section className="useful" id="useful">
    <div className="container">
      <div className="section-header">
        <div className="section-badge">
          <span className="modern-badge">
            <span className="badge-icon"><BookOpen size={15} weight="bold" /></span>
            Полезно знать
          </span>
        </div>
        <h2 className="section-title">
          Прежде чем <span className="gradient-text">начать</span>
        </h2>
        <p className="section-subtitle">
          Короткие материалы, которые помогут сделать выбор осознанно
        </p>
      </div>

      <div className="useful-grid">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="useful-card">
            <span className="useful-card-ic">{c.icon}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <span className="useful-card-more">
              {c.more} <ArrowRight size={16} weight="bold" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default UsefulInfo;
