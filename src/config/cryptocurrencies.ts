// لیست ارزهای دیجیتال پشتیبانی شده
// این فایل مرکزی برای مدیریت ارزها استفاده می‌شود

export interface Cryptocurrency {
  id: string; // ID در CoinGecko API
  name: string; // نام انگلیسی برای استفاده در کد
  displayName: string; // نام نمایشی
  symbol: string; // نماد (BTC, ETH, ...)
}

// لیست ارزهای پشتیبانی شده
export const SUPPORTED_CRYPTOCURRENCIES: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "bitcoin",
    displayName: "Bitcoin",
    symbol: "BTC",
  },
  {
    id: "ethereum",
    name: "ethereum",
    displayName: "Ethereum",
    symbol: "ETH",
  },
  {
    id: "cardano",
    name: "cardano",
    displayName: "Cardano",
    symbol: "ADA",
  },
  {
    id: "solana",
    name: "solana",
    displayName: "Solana",
    symbol: "SOL",
  },
  {
    id: "binancecoin",
    name: "binancecoin",
    displayName: "Binance Coin",
    symbol: "BNB",
  },
  {
    id: "ripple",
    name: "ripple",
    displayName: "Ripple",
    symbol: "XRP",
  },
  {
    id: "polkadot",
    name: "polkadot",
    displayName: "Polkadot",
    symbol: "DOT",
  },
  {
    id: "dogecoin",
    name: "dogecoin",
    displayName: "Dogecoin",
    symbol: "DOGE",
  },
];

// تابع کمکی برای گرفتن لیست ID های CoinGecko
export function getCoinGeckoIds(): string {
  return SUPPORTED_CRYPTOCURRENCIES.map((crypto) => crypto.id).join(",");
}

// تابع کمکی برای گرفتن نام ارزها
export function getCryptoNames(): string[] {
  return SUPPORTED_CRYPTOCURRENCIES.map((crypto) => crypto.name);
}

// تابع کمکی برای پیدا کردن ارز بر اساس نام
export function getCryptoByName(name: string): Cryptocurrency | undefined {
  return SUPPORTED_CRYPTOCURRENCIES.find((crypto) => crypto.name === name);
}

