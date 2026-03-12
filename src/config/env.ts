export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  businessId: process.env.NEXT_PUBLIC_BUSINESS_ID!,
  signalrHubUrl: process.env.NEXT_PUBLIC_SIGNALR_HUB_URL!,
  bookingBaseUrl: process.env.NEXT_PUBLIC_BOOKING_BASE_URL!,
  imageHost: process.env.NEXT_PUBLIC_IMAGE_HOST!,
} as const;
