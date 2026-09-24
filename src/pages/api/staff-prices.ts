import type { NextApiRequest, NextApiResponse } from 'next';
import { getStaffByBusinessId, getMasterById } from '../../api/api';

/**
 * Минимальная цена услуг по каждому специалисту: { [staffId]: price }.
 * Считается так же, как на странице профиля (getMinPrice в staff/[id].tsx),
 * чтобы цена на карточке и в профиле совпадала.
 * Кэшируется на CDN, чтобы не дёргать get-master-by-id на каждого посетителя.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const staffRes = await getStaffByBusinessId();
    const staff: { id: string }[] = Array.isArray(staffRes?.message) ? staffRes.message : [];

    const entries = await Promise.all(
      staff.map(async (s) => {
        try {
          const { message } = await getMasterById(s.id);
          const prices = (message?.services || []).map((svc) => svc.price).filter((p) => p > 0);
          return prices.length ? ([s.id, Math.min(...prices)] as const) : null;
        } catch {
          return null;
        }
      })
    );

    const prices: Record<string, number> = {};
    for (const e of entries) if (e) prices[e[0]] = e[1];

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    res.status(200).json(prices);
  } catch (error) {
    console.error('[staff-prices]', error);
    res.status(502).json({});
  }
}
