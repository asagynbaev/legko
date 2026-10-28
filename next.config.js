const path = require('path');

module.exports = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // SAMEORIGIN (не DENY): нужно, чтобы встраивать собственные PDF-документы
          // психологов в галерею. Чужие сайты по-прежнему не могут нас фреймить.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  // Прокси только для путей, которые зовёт браузер (src/api/*: BASE_URL = /api/proxy).
  // Весь Booka API под нашим доменом не открываем — в нём есть телефоны и брони мастеров.
  // Только точные пути: в :path* проходит «..», и Booka сама нормализует его в любой путь.
  async rewrites() {
    // То же значение по умолчанию, что в src/config/env.ts
    const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID ?? '9369c165-4672-4ca7-90d7-d3efdafccbd6';
    const paths = [
      // Старая Элли на главной
      'PsychologistMatch/start',
      'PsychologistMatch/message',
      'PsychologistMatch/create-booking',
      // Запасная загрузка списка психологов, если SSR вернул пустой список
      `Business/staff/get-staff-by-business-id/${businessId}`,
    ];
    return paths.map((p) => ({
      source: `/api/proxy/${p}`,
      destination: `https://api.booka.life/api/v1/${p}`,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.booka.life',
        port: '',
        pathname: '/images/user-photos/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
  },
};
