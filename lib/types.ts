import { getCryptoNames } from "@/src/config/cryptocurrencies";

export type CryptoBalances = Record<string, number>;

export interface UserRecord {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  avatarUrl?: string | null;
  cashBalance: number;
  cryptoBalances: CryptoBalances;
  createdAt: string;
}

export interface OrderRecord {
  id: number;
  userId: string;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
  createdAt: string;
}

export interface Database {
  users: UserRecord[];
  orders: OrderRecord[];
  nextOrderId: number;
}

export const INITIAL_CASH_BALANCE = 150_000;

export function createEmptyCryptoBalances(): CryptoBalances {
  const balances: CryptoBalances = {};
  getCryptoNames().forEach((name) => {
    balances[name] = 0;
  });
  return balances;
}

export type PublicUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  cashBalance: number;
  cryptoBalances: CryptoBalances;
};
