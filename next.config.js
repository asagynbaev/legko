module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.booka.kg',
        port: '',
        pathname: '/images/user-photos/**',
      },
    ],
    domains: ['img.booka.kg'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Отключаем оптимизацию для внешних изображений, если возникают проблемы
    unoptimized: false,
  },
};
