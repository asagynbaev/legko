/**
 * Env подставляются при сборке (next build).
 * В GitHub Actions передайте их в job, где вызывается npm run build — см. .github/workflows/README.md
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.booka.life/api/v1',
  businessId: process.env.NEXT_PUBLIC_BUSINESS_ID ?? '9369c165-4672-4ca7-90d7-d3efdafccbd6',
  signalrHubUrl: process.env.NEXT_PUBLIC_SIGNALR_HUB_URL ?? 'https://api.booka.life/hubs/psychologist-match',
  bookingBaseUrl: process.env.NEXT_PUBLIC_BOOKING_BASE_URL ?? 'https://booka.life',
  imageHost: process.env.NEXT_PUBLIC_IMAGE_HOST ?? 'img.booka.life',
} as const;
