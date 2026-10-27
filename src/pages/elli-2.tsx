import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import ChatQuestionnaire from '../components/ChatQuestionnaire';
import { useBookaAssistant } from '../hooks/useBookaAssistant';

/**
 * Пилот: Элли на ассистенте Booka («Вижн») вместо старого подбора на главной.
 * Главная не меняется; страница не индексируется и не входит в sitemap.
 *
 * Все ссылки отсюда и сюда — обычные <a> (полная перезагрузка): виджет живёт вне React
 * и при клиентском переходе остался бы висеть на главной рядом со старой Элли.
 * Поэтому здесь своя шапка, без Header/Footer (в них next/link и кнопка старой Элли).
 */

const BRAND_COLOR = '#6C5CE7'; // --primary в style.css
const WHATSAPP_URL = 'https://wa.me/996700595393';

export default function ElliPilotPage() {
  const [formOpen, setFormOpen] = useState(false);
  // Пока открыта анкета, пузырь прячем: на телефоне он закрывает кнопку «Далее»
  const { status, open, opening } = useBookaAssistant({
    color: BRAND_COLOR,
    subtitle: 'ИИ-помощник Легко',
    hidden: formOpen,
  });

  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('openPrivacyPolicyModal'));
  };

  return (
    <>
      <Head>
        <title>Legko - Подбор психолога с Элли</title>
        <meta name="description" content="Расскажите Элли, что вас беспокоит, — она предложит психологов, покажет свободное время и запишет вас онлайн." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <header className="header">
        <nav className="nav container">
          <div className="nav__brand">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- полная перезагрузка: виджет живёт вне React */}
            <a href="/" className="logo">
              <Image
                src="/images/Group_12_3.png.webp"
                alt="Legko - поиск психологов"
                width={120}
                height={40}
                className="logo__image"
              />
            </a>
          </div>
          {/* Пока открыта анкета, пузырь спрятан — открывать чат из шапки некуда */}
          {status !== 'unavailable' && !formOpen && (
            <div className="nav__actions">
              <button type="button" className="btn btn--primary" onClick={open} aria-busy={opening}>
                Поговорить с Элли
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="hero hero--chat elli2">
        <div className="hero__top container">
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            Онлайн-консультации с проверенными психологами
          </div>
          <h1 className="hero__title">
            Найти своего психолога <span className="hero__title-accent">Легко</span>
          </h1>
          <p className="hero__subtitle">
            Расскажите, что вас беспокоит. Элли — ИИ-помощник Легко: предложит психологов,
            покажет свободное время и запишет вас прямо в чате
          </p>
        </div>

        <div className="hero__container container">
          <p className="sr-only" role="status">
            {status === 'unavailable' ? 'Элли сейчас недоступна' : ''}
          </p>
          <div className={`hero__chat elli2__card ${formOpen ? 'hero__chat--form' : ''}`}>
            {formOpen ? (
              <ChatQuestionnaire onBack={() => setFormOpen(false)} />
            ) : (
              <div className="elli2__body">
                {status === 'unavailable' ? (
                  <div className="elli2__unavailable">
                    <p className="elli2__lead">Элли сейчас недоступна</p>
                    <p className="elli2__hint">
                      Заполните короткую анкету — подберём психолога за пару минут. Или напишите нам.
                    </p>
                    <a
                      href={WHATSAPP_URL}
                      className="btn btn--outline elli2__whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-whatsapp" aria-hidden="true"></i> Написать в WhatsApp
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="chat-header__info">
                      <div className="chat-header__avatar" aria-hidden="true">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div>
                        <div className="chat-header__title">Элли</div>
                        <div className="elli2__hint">ИИ-помощник Легко</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn--primary elli2__cta"
                      onClick={open}
                      aria-disabled={opening}
                      aria-busy={opening}
                    >
                      <i className={`fas ${opening ? 'fa-spinner fa-spin' : 'fa-comment-dots'}`} aria-hidden="true"></i>
                      {opening ? 'Подключаем Элли…' : 'Поговорить с Элли'}
                    </button>
                    <p className="elli2__hint">Ответ может занять до минуты — Элли проверяет расписание психологов</p>
                    <p className="elli2__consent">
                      Начиная чат, вы соглашаетесь с{' '}
                      <a href="#" onClick={openPrivacy}>политикой обработки персональных данных</a>
                    </p>
                  </>
                )}

                <div className="hero__chat-alt">
                  <span className="hero__chat-alt-divider">или</span>
                </div>
                <button type="button" className="hero__chat-cta" onClick={() => setFormOpen(true)}>
                  <span className="hero__chat-cta-icon">
                    <i className="fas fa-clipboard-list" aria-hidden="true"></i>
                  </span>
                  <span className="hero__chat-cta-text">
                    <span className="hero__chat-cta-title">Заполнить короткую анкету</span>
                    <span className="hero__chat-cta-sub">≈2 минуты · подберём психолога под ваш запрос</span>
                  </span>
                  <span className="hero__chat-cta-arrow" aria-hidden="true">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="hero__visual">
            <div className="hero__mascot-wrapper">
              <Image
                src="/images/пушистик радость.webp"
                alt="Элли"
                width={525}
                height={525}
                className="hero__mascot-modern"
                priority
              />
            </div>
          </div>
        </div>

        <div className="hero__stats container">
          <div className="hero__stat">
            <div className="hero__stat-value">1200+</div>
            <div className="hero__stat-label">проведенных сессий</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">4.9/5</div>
            <div className="hero__stat-label">средняя оценка</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">11+</div>
            <div className="hero__stat-label">направлений работы</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">от 1500 с</div>
            <div className="hero__stat-label">за сессию</div>
          </div>
        </div>
      </main>
    </>
  );
}
