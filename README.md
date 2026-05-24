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

## Scripts

- `npm run dev` - start local development
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run db:push` - push the Prisma schema to the database
- `npm run db:studio` - open Prisma Studio
