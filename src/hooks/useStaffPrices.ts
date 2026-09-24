import { useEffect, useState } from 'react';
import { STAFF_PRICE_MAP } from '../constants/staffContent';

/**
 * Цены «от» для карточек специалистов — из тех же услуг Booka, что и на странице профиля.
 * Пока цены не загрузились (или API недоступен) — фолбэк на STAFF_PRICE_MAP.
 */
export function useStaffPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/staff-prices', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, number>) => setPrices(data || {}))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (id: string, name: string) => {
    const price = prices[id];
    if (price) return `от ${price} с`;
    return STAFF_PRICE_MAP[name] || 'от 1500 с';
  };
}
