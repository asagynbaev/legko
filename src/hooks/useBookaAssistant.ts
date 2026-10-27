import { useCallback, useEffect, useState } from 'react';
import { config } from '../config/env';

/**
 * Виджет ассистента Booka (booka.life/widget/assistant.js) — плавающий чат в Shadow DOM.
 *
 * Как он живёт (assistant.js v1.2.0):
 * - монтирует <booka-assistant> прямо в body, мимо React, и не умеет размонтироваться
 *   (удалённый хост второй раз не смонтируется — виджет помнит свои элементы);
 * - пузырь появляется только после успешного /start (таймаут 15 с), при выключенном канале
 *   не появляется вовсе. С 1.3.0 виджет шлёт booka:ready / booka:unavailable и держит
 *   BookaAssistant.status; для 1.2.0 остаётся ожидание хоста в DOM с таймером;
 * - повторная загрузка скрипта ничего не делает (guard по window.BookaAssistant).
 *
 * Поэтому страница с виджетом открывается и покидается только полной перезагрузкой
 * (обычные <a>, не next/link). Страховка: хост виден, только пока на body стоит
 * VISIBLE_CLASS (правило в style.css) — его держит этот хук. Уйдём клиентским переходом,
 * даже до ответа /start, — пузырь на других страницах не покажется, а вернёмся — покажется.
 */

declare global {
  interface Window {
    BookaAssistant?: {
      version: string;
      status?: BookaAssistantStatus; // с 1.3.0
      open: () => void;
      close: () => void;
    };
  }
}

export type BookaAssistantStatus = 'loading' | 'ready' | 'unavailable';

const HOST_TAG = 'booka-assistant';
const SCRIPT_ID = 'booka-assistant-script';
const VISIBLE_CLASS = 'booka-assistant-visible';
// Считаем от загрузки скрипта: /start в виджете ждёт до 15 с — даём ему досчитать
const READY_TIMEOUT_MS = 16000;

interface BookaAssistantOptions {
  color: string;
  subtitle: string; // подпись под именем бота, с 1.3.0
  hidden?: boolean; // спрятать пузырь, не теряя переписку (например, пока открыта анкета)
}

export function useBookaAssistant({ color, subtitle, hidden = false }: BookaAssistantOptions) {
  const [status, setStatus] = useState<BookaAssistantStatus>('loading');

  useEffect(() => {
    document.body.classList.toggle(VISIBLE_CLASS, !hidden);
    return () => document.body.classList.remove(VISIBLE_CLASS);
  }, [hidden]);

  useEffect(() => {
    let timer = 0;
    const markUnavailable = () => setStatus((s) => (s === 'ready' ? s : 'unavailable'));
    const startTimer = () => {
      timer = window.setTimeout(markUnavailable, READY_TIMEOUT_MS);
    };

    // Наблюдение не снимаем и после «недоступна»: поздний /start всё равно покажет чат
    const showIfMounted = () => {
      if (!document.querySelector(HOST_TAG)) return false;
      setStatus('ready');
      return true;
    };
    const observer = new MutationObserver(() => {
      if (showIfMounted()) {
        observer.disconnect();
        window.clearTimeout(timer);
      }
    });

    // 404 на /start (канал выключен), сеть — не ждём таймер
    window.addEventListener('booka:unavailable', markUnavailable);

    if (!showIfMounted()) {
      observer.observe(document.body, { childList: true });

      const existing = document.getElementById(SCRIPT_ID);
      if (existing?.dataset.state === 'error' || window.BookaAssistant?.status === 'unavailable') {
        markUnavailable();
      } else if (existing) {
        startTimer();
      } else {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = config.assistantWidgetUrl;
        script.async = true;
        script.dataset.businessId = config.businessId;
        script.dataset.color = color;
        script.dataset.subtitle = subtitle;
        script.onload = startTimer;
        script.onerror = () => {
          script.dataset.state = 'error';
          markUnavailable();
        };
        document.body.appendChild(script);
      }
    }

    return () => {
      window.removeEventListener('booka:unavailable', markUnavailable);
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [color, subtitle]);

  // Нажали до появления виджета — откроем панель, как только он смонтируется
  const [wantOpen, setWantOpen] = useState(false);

  useEffect(() => {
    if (!wantOpen || status === 'loading') return;
    if (status === 'ready') window.BookaAssistant?.open();
    setWantOpen(false);
  }, [wantOpen, status]);

  const open = useCallback(() => {
    if (status === 'ready') window.BookaAssistant?.open();
    else if (status === 'loading') setWantOpen(true);
  }, [status]);

  return { status, open, opening: wantOpen && status === 'loading' };
}
