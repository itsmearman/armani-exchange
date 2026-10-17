// لیست ارزهای دیجیتال پشتیبانی شده
// این فایل مرکزی برای مدیریت ارزها استفاده می‌شود

export interface Cryptocurrency {
  id: string; // ID در CoinGecko API
  name: string; // نام انگلیسی برای استفاده در کد
  displayName: string; // نام نمایشی
  symbol: string; // نماد (BTC, ETH, ...)
  tradingViewSymbol: string;
}

// لیست ارزهای پشتیبانی شده
export const SUPPORTED_CRYPTOCURRENCIES: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "bitcoin",
    displayName: "Bitcoin",
    symbol: "BTC",
    tradingViewSymbol: "BINANCE:BTCUSDT",
  },
  {
    id: "ethereum",
    name: "ethereum",
    displayName: "Ethereum",
    symbol: "ETH",
    tradingViewSymbol: "BINANCE:ETHUSDT",
  },
  {
    id: "cardano",
    name: "cardano",
    displayName: "Cardano",
    symbol: "ADA",
    tradingViewSymbol: "BINANCE:ADAUSDT",
  },
  {
    id: "solana",
    name: "solana",
    displayName: "Solana",
    symbol: "SOL",
    tradingViewSymbol: "BINANCE:SOLUSDT",
  },
  {
    id: "binancecoin",
    name: "binancecoin",
    displayName: "Binance Coin",
    symbol: "BNB",
    tradingViewSymbol: "BINANCE:BNBUSDT",
  },
  {
    id: "ripple",
    name: "ripple",
    displayName: "Ripple",
    symbol: "XRP",
    tradingViewSymbol: "BINANCE:XRPUSDT",
  },
  {
    id: "polkadot",
    name: "polkadot",
    displayName: "Polkadot",
    symbol: "DOT",
    tradingViewSymbol: "BINANCE:DOTUSDT",
  },
  {
    id: "dogecoin",
    name: "dogecoin",
    displayName: "Dogecoin",
    symbol: "DOGE",
    tradingViewSymbol: "BINANCE:DOGEUSDT",
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

