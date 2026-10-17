# Armani Exchange

Next.js crypto exchange simulator with a self-contained backend (no Supabase).

## Stack

- **TypeScript** + **Next.js** (App Router)
- **Next.js API Routes** for auth, profile, orders, and live prices proxy
- **JSON file database** (`data/db.json`)
- **JWT httpOnly cookies** (`jose`) + **bcryptjs** password hashing
- **Redux Toolkit** for client trading state
- **next-intl** for FA/EN localization
- **IRANSansX FaNum** fonts for Persian numerals

## Features

1. Buy and sell supported cryptocurrencies with live CoinGecko prices
2. Account balances and order history
3. Email/password signup & login (starts with **$150,000** test cash)
4. Responsive UI + dark mode
5. Multi-language support (FA / EN)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account + session |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/profile` | Balances + profile |
| GET | `/api/orders` | User orders |
| POST | `/api/orders` | Place trade |
| GET | `/api/prices` | Live prices proxy |

## Notes

- Session cookie name: `ae_session`
- Local user data is stored in `data/db.json` (gitignored)
- Set a strong `AUTH_SECRET` before deploying
