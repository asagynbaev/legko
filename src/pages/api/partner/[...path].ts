import type { NextApiRequest, NextApiResponse } from 'next';

const PARTNER_API_KEY = process.env.PARTNER_API_KEY;
const BASE_URL = 'https://api.booka.life/api/partner/v1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!PARTNER_API_KEY) {
    return res.status(500).json({ error: 'Partner API key not configured' });
  }

  const { path } = req.query;
  const pathStr = Array.isArray(path) ? path.join('/') : path || '';

  // Разрешаем только безопасные пути
  if (!/^[a-zA-Z0-9\-_/]+$/.test(pathStr)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const url = new URL(`${BASE_URL}/${pathStr}`);

  // Прокидываем query-параметры (кроме path)
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    if (typeof value === 'string') {
      url.searchParams.set(key, value);
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const fetchOptions: RequestInit = {
      method: req.method || 'GET',
      headers: {
        'X-API-Key': PARTNER_API_KEY,
        'Accept-Language': 'ru',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), fetchOptions);
    clearTimeout(timeout);

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { error: 'Empty response' });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return res.status(504).json({ error: 'Partner API timeout' });
    }
    return res.status(502).json({ error: 'Partner API unavailable' });
  }
}
