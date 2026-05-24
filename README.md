# MindHatch

A Next.js 16 full-stack app for semantic resume matching, interview preparation, and audit-friendly candidate workflows.

## Stack

- Next.js App Router
- Tailwind CSS
- shadcn/ui-compatible component primitives
- Prisma with SQLite for local development and PostgreSQL for production
- NextAuth.js v5 beta with credentials and Google sign-in
- TanStack Query, Zustand, Recharts, and TanStack Table
- Upstash Redis and QStash
- Stripe, Shippo, ImageKit, Sentry, jsPDF, ExcelJS, and QRCode

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in the secrets.
2. Install dependencies.
3. Run Prisma generate and start the dev server.

```bash
npm install
npm run db:generate
npm run dev
```

## Vercel Deployment

1. Create a Vercel project from this repository.
2. Set `AUTH_SECRET`, `NEXTAUTH_SECRET`, and your production `DATABASE_URL` in Vercel.
3. Set `NEXTAUTH_URL` to your production domain, or set `NEXT_PUBLIC_APP_URL` if you prefer to keep the site origin explicit.
4. The app reads the deployment host from Vercel automatically and uses the uploaded logo in `public/MindHatch Logo.png`.

If you deploy with a persistent database provider, update `DATABASE_URL` to point to that production database before shipping.

## Scripts

- `npm run dev` - start local development
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run db:push` - push the Prisma schema to the database
- `npm run db:studio` - open Prisma Studio
