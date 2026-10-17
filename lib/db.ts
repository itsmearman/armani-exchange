import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import {
  Database,
  INITIAL_CASH_BALANCE,
  OrderRecord,
  UserRecord,
  createEmptyCryptoBalances,
} from "./types";

const REDIS_KEY = "armani-exchange:db";
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const emptyDb = (): Database => ({
  users: [],
  orders: [],
  nextOrderId: 1,
});

let writeQueue: Promise<void> = Promise.resolve();
let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    redisClient = new Redis({ url, token });
  } else {
    redisClient = null;
  }

  return redisClient;
}

function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

async function ensureDbFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(emptyDb(), null, 2), "utf-8");
  }
}

async function readDbFromFile(): Promise<Database> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Database;
    return {
      users: parsed.users ?? [],
      orders: parsed.orders ?? [],
      nextOrderId: parsed.nextOrderId ?? 1,
    };
  } catch {
    return emptyDb();
  }
}

async function writeDbToFile(db: Database): Promise<void> {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function readDb(): Promise<Database> {
  const redis = getRedis();

  if (redis) {
    const data = await redis.get<Database>(REDIS_KEY);
    if (!data) return emptyDb();
    return {
      users: data.users ?? [],
      orders: data.orders ?? [],
      nextOrderId: data.nextOrderId ?? 1,
    };
  }

  if (isVercel()) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN. File storage is not writable on Vercel."
    );
  }

  return readDbFromFile();
}

async function writeDb(db: Database): Promise<void> {
  const redis = getRedis();

  if (redis) {
    await redis.set(REDIS_KEY, db);
    return;
  }

  if (isVercel()) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN. File storage is not writable on Vercel."
    );
  }

  await writeDbToFile(db);
}

export async function updateDb<T>(
  updater: (db: Database) => T | Promise<T>
): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readDb();
    const result = await updater(db);
    await writeDb(db);
    return result;
  });

  writeQueue = run.then(
    () => undefined,
    () => undefined
  );

  return run;
}

export async function findUserByEmail(
  email: string
): Promise<UserRecord | undefined> {
  const db = await readDb();
  return db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export async function findUserById(
  id: string
): Promise<UserRecord | undefined> {
  const db = await readDb();
  return db.users.find((user) => user.id === id);
}

export async function createUser(input: {
  email: string;
  username: string;
  passwordHash: string;
}): Promise<UserRecord> {
  return updateDb((db) => {
    const exists = db.users.some(
      (user) => user.email.toLowerCase() === input.email.toLowerCase()
    );
    if (exists) {
      throw new Error("EMAIL_EXISTS");
    }

    const user: UserRecord = {
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      username: input.username.trim(),
      passwordHash: input.passwordHash,
      cashBalance: INITIAL_CASH_BALANCE,
      cryptoBalances: createEmptyCryptoBalances(),
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    return user;
  });
}

export async function updateUserProfile(input: {
  userId: string;
  username?: string;
  passwordHash?: string;
  avatarUrl?: string | null;
}): Promise<UserRecord> {
  return updateDb((db) => {
    const user = db.users.find((item) => item.id === input.userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (input.username !== undefined) {
      const username = input.username.trim();
      if (!username) {
        throw new Error("INVALID_USERNAME");
      }
      const taken = db.users.some(
        (item) =>
          item.id !== input.userId &&
          item.username.toLowerCase() === username.toLowerCase()
      );
      if (taken) {
        throw new Error("USERNAME_TAKEN");
      }
      user.username = username;
    }

    if (input.passwordHash) {
      user.passwordHash = input.passwordHash;
    }

    if (input.avatarUrl !== undefined) {
      user.avatarUrl = input.avatarUrl;
    }

    return user;
  });
}

export async function getOrdersByUserId(
  userId: string
): Promise<OrderRecord[]> {
  const db = await readDb();
  return db.orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => b.id - a.id);
}

export async function placeTrade(input: {
  userId: string;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
}): Promise<{ order: OrderRecord; user: UserRecord }> {
  return updateDb((db) => {
    const user = db.users.find((item) => item.id === input.userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const cost = input.price * input.amount;
    const currentAsset = user.cryptoBalances[input.asset] || 0;

    if (input.type === "buy") {
      if (cost > user.cashBalance) {
        throw new Error("NOT_ENOUGH_CASH");
      }
      user.cashBalance -= cost;
      user.cryptoBalances[input.asset] = currentAsset + input.amount;
    } else {
      if (currentAsset < input.amount) {
        throw new Error("NOT_ENOUGH_CRYPTO");
      }
      user.cashBalance += cost;
      user.cryptoBalances[input.asset] = currentAsset - input.amount;
    }

    const order: OrderRecord = {
      id: db.nextOrderId++,
      userId: user.id,
      type: input.type,
      asset: input.asset,
      amount: input.amount,
      price: input.price,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(order);
    return { order, user };
  });
}
