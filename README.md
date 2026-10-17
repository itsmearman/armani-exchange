# Armani Exchange

Next.js crypto exchange simulator with a self-contained backend (no Supabase).

## Stack

- **TypeScript** + **Next.js** (App Router)
- **Next.js API Routes** for auth, profile, orders, and live prices proxy
- **Local JSON file** (`data/db.json`) in development (without `DATABASE_URL`)
- **Neon Postgres** for Vercel / production
- **JWT httpOnly cookies** (`jose`) + **bcryptjs** password hashing
- **Redux Toolkit**, **next-intl**, **IRANSansX FaNum**

## Getting started (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

If `DATABASE_URL` is set, Neon is used even locally. Otherwise data goes to `data/db.json`.

## Deploy on Vercel + Neon

1. Create a project at [console.neon.tech](https://console.neon.tech)
2. Copy the connection string (`DATABASE_URL`)
3. In Vercel → Project → Settings → Environment Variables add:

| Name | Value |
|------|--------|
| `AUTH_SECRET` | a long random string |
| `DATABASE_URL` | Neon connection string |

4. Redeploy
5. Sign up again on production (tables are auto-created on first request)

## Notes

- Session cookie: `ae_session`
- Avatars are stored as data URLs in Postgres
- Never commit `.env.local` or real database passwords
