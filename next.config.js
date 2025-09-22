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
    // Улучшенная обработка внешних изображений
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
  },
};
