# Armani Exchange

Next.js crypto exchange simulator with a self-contained backend (no Supabase).

## Stack

- **TypeScript** + **Next.js** (App Router)
- **Next.js API Routes** for auth, profile, orders, and live prices proxy
- **Local JSON file** (`data/db.json`) in development
- **Upstash Redis** on Vercel / serverless
- **JWT httpOnly cookies** (`jose`) + **bcryptjs** password hashing
- **Redux Toolkit** for client trading state
- **next-intl** for FA/EN localization
- **IRANSansX FaNum** fonts for Persian numerals

## Features

1. Buy and sell supported cryptocurrencies with live CoinGecko prices
2. Account balances and order history
3. Email/password signup & login (starts with **$150,000** test cash)
4. Profile edit + avatar upload
5. Responsive UI + dark mode
6. Multi-language support (FA / EN)

## Getting started (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Locally, data is stored in `data/db.json` (Upstash is optional).

## Deploy on Vercel

Vercel’s filesystem is **read-only**, so Redis is required in production:

1. Create a free Redis DB at [Upstash Console](https://console.upstash.com)
2. Copy **REST URL** and **REST TOKEN**
3. In Vercel → Project → Settings → Environment Variables, add:

| Name | Value |
|------|--------|
| `AUTH_SECRET` | a long random string |
| `UPSTASH_REDIS_REST_URL` | from Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | from Upstash |

4. Redeploy the project
5. Sign up again on production (local DB does not sync to Redis)

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account + session |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/profile` | Balances + profile |
| PATCH | `/api/profile` | Update username/password |
| POST | `/api/profile/avatar` | Upload avatar |
| GET | `/api/orders` | User orders |
| POST | `/api/orders` | Place trade |
| GET | `/api/prices` | Live prices proxy |

## Notes

- Session cookie name: `ae_session`
- Avatars are stored as data URLs in the database (works on Vercel)
- Set a strong `AUTH_SECRET` before deploying
