const path = require('path');

module.exports = {
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.booka.life/api/v1/:path*',
      },
    ];
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
