import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart } from '@phosphor-icons/react';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Про нас — сервис психологической поддержки | Legko</title>
        <meta name="description" content="«Легко» — сервис психологической поддержки, где можно найти своего психолога онлайн. Индивидуальные консультации, группы, лекции и работа с компаниями. Наша цель — сделать помощь доступной каждому." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://legko.live/o-nas" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Про нас — Legko" />
        <meta property="og:description" content="Почему мы создали «Легко» и во что верим. Забота о себе — важная часть полноценной жизни." />
        <meta property="og:url" content="https://legko.live/o-nas" />
        <meta property="og:locale" content="ru_RU" />
      </Head>
      <Header />

      <section className="article-hero">
        <div className="article-wrap">
          <span className="fp-eyebrow"><span className="fp-eyebrow-dot"></span>Про нас</span>
          <h1 className="article-title">Потому что вместе <em>действительно легче</em></h1>
          <p className="article-lead">
            «Легко» — это сервис психологической поддержки, где можно найти своего психолога и получить
            помощь в комфортном онлайн-формате.
          </p>
        </div>
      </section>

      <section className="article-body">
        <div className="article-wrap">
          <div className="article-section">
            <p>
              Мы создали «Легко», потому что знаем: иногда бывает сложно справляться с тревогой, стрессом,
              конфликтами, выгоранием или жизненными переменами в одиночку. И в такие моменты важно, чтобы
              рядом был специалист, который поможет разобраться в ситуации и найти решение.
            </p>
            <p>
              Мы тщательно подбираем психологов, чтобы каждый клиент мог чувствовать себя в безопасности,
              быть услышанным и получить профессиональную поддержку.
            </p>
            <p>
              Кроме индивидуальных консультаций, мы проводим групповые встречи, лекции, тренинги и работаем
              с компаниями — помогая людям лучше понимать себя, выстраивать здоровые отношения и бережнее
              относиться к своему психологическому состоянию.
            </p>
            <p>
              Мы верим, что забота о себе — это <strong>не роскошь и не признак слабости</strong>. Это важная
              часть полноценной жизни. Наша цель — сделать качественную психологическую помощь доступной каждому.
            </p>

            <div className="callout callout--accent">
              <span className="callout-ic"><Heart size={20} weight="fill" /></span>
              <span>Потому что <strong>вместе действительно легче.</strong></span>
            </div>
          </div>

          <div className="article-cta">
            <h3>Готовы сделать первый шаг?</h3>
            <p>Расскажите Элли, что вас беспокоит — и мы подберём психолога, который подойдёт именно вам.</p>
            <Link href="/" className="btn btn--primary btn--large">Найти своего психолога</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
