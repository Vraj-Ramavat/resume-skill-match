import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default('file:./prisma/dev.db'),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  QSTASH_TOKEN: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  SHIPPO_API_TOKEN: z.string().optional(),
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().optional()
});

export const env = envSchema.parse(process.env);

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `https://${value}`;
}

export function getSiteOrigin() {
  const nextAuthUrl = normalizeSiteUrl(env.NEXTAUTH_URL);
  if (nextAuthUrl) {
    return nextAuthUrl;
  }

  const publicAppUrl = normalizeSiteUrl(env.NEXT_PUBLIC_APP_URL);
  if (publicAppUrl) {
    return publicAppUrl;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return undefined;
}
