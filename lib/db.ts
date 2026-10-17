import { promises as fs } from "fs";
import path from "path";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import {
  CryptoBalances,
  Database,
  INITIAL_CASH_BALANCE,
  OrderRecord,
  UserRecord,
  createEmptyCryptoBalances,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

type SqlClient = NeonQueryFunction<false, false>;

let sqlClient: SqlClient | null | undefined;
let schemaReady: Promise<void> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

const emptyDb = (): Database => ({
  users: [],
  orders: [],
  nextOrderId: 1,
});

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function getSql(): SqlClient | null {
  if (sqlClient !== undefined) return sqlClient;

  const url = getDatabaseUrl();
  if (!url) {
    sqlClient = null;
    return sqlClient;
  }

  sqlClient = neon(url);
  return sqlClient;
}

function isServerlessHost() {
  return Boolean(process.env.VERCEL);
}

async function ensureSchema(sql: SqlClient) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          username TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          avatar_url TEXT,
          cash_balance DOUBLE PRECISION NOT NULL DEFAULT 150000,
          crypto_balances JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          asset TEXT NOT NULL,
          amount DOUBLE PRECISION NOT NULL,
          price DOUBLE PRECISION NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id)`;
    })();
  }
  await schemaReady;
}

type UserRow = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  avatar_url: string | null;
  cash_balance: number | string;
  crypto_balances: CryptoBalances | string;
  created_at: string | Date;
};

type OrderRow = {
  id: number;
  user_id: string;
  type: "buy" | "sell";
  asset: string;
  amount: number | string;
  price: number | string;
  created_at: string | Date;
};

function mapUser(row: UserRow): UserRecord {
  const cryptoBalances =
    typeof row.crypto_balances === "string"
      ? (JSON.parse(row.crypto_balances) as CryptoBalances)
      : row.crypto_balances || createEmptyCryptoBalances();

  return {
    id: row.id,
    email: row.email,
    username: row.username,
    passwordHash: row.password_hash,
    avatarUrl: row.avatar_url,
    cashBalance: Number(row.cash_balance),
    cryptoBalances,
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at.toISOString(),
  };
}

function mapOrder(row: OrderRow): OrderRecord {
  return {
    id: Number(row.id),
    userId: row.user_id,
    type: row.type,
    asset: row.asset,
    amount: Number(row.amount),
    price: Number(row.price),
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at.toISOString(),
  };
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

function requireStorage() {
  if (isServerlessHost() && !getDatabaseUrl()) {
    throw new Error(
      "Missing DATABASE_URL. Configure Neon Postgres for Vercel."
    );
  }
}

async function updateFileDb<T>(
  updater: (db: Database) => T | Promise<T>
): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readDbFromFile();
    const result = await updater(db);
    await writeDbToFile(db);
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
  const sql = getSql();
  if (sql) {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT * FROM users WHERE lower(email) = ${email.toLowerCase()} LIMIT 1
    `) as UserRow[];
    return rows[0] ? mapUser(rows[0]) : undefined;
  }

  requireStorage();
  const db = await readDbFromFile();
  return db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export async function findUserById(
  id: string
): Promise<UserRecord | undefined> {
  const sql = getSql();
  if (sql) {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `) as UserRow[];
    return rows[0] ? mapUser(rows[0]) : undefined;
  }

  requireStorage();
  const db = await readDbFromFile();
  return db.users.find((user) => user.id === id);
}

export async function createUser(input: {
  email: string;
  username: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const sql = getSql();
  if (sql) {
    await ensureSchema(sql);
    const existing = await findUserByEmail(input.email);
    if (existing) throw new Error("EMAIL_EXISTS");

    const user: UserRecord = {
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      username: input.username.trim(),
      passwordHash: input.passwordHash,
      cashBalance: INITIAL_CASH_BALANCE,
      cryptoBalances: createEmptyCryptoBalances(),
      createdAt: new Date().toISOString(),
    };

    await sql`
      INSERT INTO users (
        id, email, username, password_hash, cash_balance, crypto_balances, created_at
      ) VALUES (
        ${user.id},
        ${user.email},
        ${user.username},
        ${user.passwordHash},
        ${user.cashBalance},
        ${JSON.stringify(user.cryptoBalances)}::jsonb,
        ${user.createdAt}
      )
    `;

    return user;
  }

  requireStorage();
  return updateFileDb((db) => {
    const exists = db.users.some(
      (user) => user.email.toLowerCase() === input.email.toLowerCase()
    );
    if (exists) throw new Error("EMAIL_EXISTS");

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
  const sql = getSql();
  if (sql) {
    await ensureSchema(sql);
    const current = await findUserById(input.userId);
    if (!current) throw new Error("USER_NOT_FOUND");

    let username = current.username;
    let passwordHash = current.passwordHash;
    let avatarUrl = current.avatarUrl ?? null;

    if (input.username !== undefined) {
      username = input.username.trim();
      if (!username) throw new Error("INVALID_USERNAME");

      const taken = (await sql`
        SELECT id FROM users
        WHERE lower(username) = ${username.toLowerCase()} AND id <> ${input.userId}
        LIMIT 1
      `) as Array<{ id: string }>;
      if (taken[0]) throw new Error("USERNAME_TAKEN");
    }

    if (input.passwordHash) passwordHash = input.passwordHash;
    if (input.avatarUrl !== undefined) avatarUrl = input.avatarUrl;

    const rows = (await sql`
      UPDATE users
      SET
        username = ${username},
        password_hash = ${passwordHash},
        avatar_url = ${avatarUrl}
      WHERE id = ${input.userId}
      RETURNING *
    `) as UserRow[];

    return mapUser(rows[0]);
  }

  requireStorage();
  return updateFileDb((db) => {
    const user = db.users.find((item) => item.id === input.userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    if (input.username !== undefined) {
      const username = input.username.trim();
      if (!username) throw new Error("INVALID_USERNAME");
      const taken = db.users.some(
        (item) =>
          item.id !== input.userId &&
          item.username.toLowerCase() === username.toLowerCase()
      );
      if (taken) throw new Error("USERNAME_TAKEN");
      user.username = username;
    }

    if (input.passwordHash) user.passwordHash = input.passwordHash;
    if (input.avatarUrl !== undefined) user.avatarUrl = input.avatarUrl;

    return user;
  });
}

export async function getOrdersByUserId(
  userId: string
): Promise<OrderRecord[]> {
  const sql = getSql();
  if (sql) {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT * FROM orders
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `) as OrderRow[];
    return rows.map(mapOrder);
  }

  requireStorage();
  const db = await readDbFromFile();
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
  const sql = getSql();
  if (sql) {
    await ensureSchema(sql);
    const user = await findUserById(input.userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    const cost = input.price * input.amount;
    const currentAsset = user.cryptoBalances[input.asset] || 0;

    if (input.type === "buy") {
      if (cost > user.cashBalance) throw new Error("NOT_ENOUGH_CASH");
      user.cashBalance -= cost;
      user.cryptoBalances[input.asset] = currentAsset + input.amount;
    } else {
      if (currentAsset < input.amount) throw new Error("NOT_ENOUGH_CRYPTO");
      user.cashBalance += cost;
      user.cryptoBalances[input.asset] = currentAsset - input.amount;
    }

    const updatedUsers = (await sql`
      UPDATE users
      SET
        cash_balance = ${user.cashBalance},
        crypto_balances = ${JSON.stringify(user.cryptoBalances)}::jsonb
      WHERE id = ${user.id}
      RETURNING *
    `) as UserRow[];

    const orderRows = (await sql`
      INSERT INTO orders (user_id, type, asset, amount, price)
      VALUES (${user.id}, ${input.type}, ${input.asset}, ${input.amount}, ${input.price})
      RETURNING *
    `) as OrderRow[];

    return {
      order: mapOrder(orderRows[0]),
      user: mapUser(updatedUsers[0]),
    };
  }

  requireStorage();
  return updateFileDb((db) => {
    const user = db.users.find((item) => item.id === input.userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    const cost = input.price * input.amount;
    const currentAsset = user.cryptoBalances[input.asset] || 0;

    if (input.type === "buy") {
      if (cost > user.cashBalance) throw new Error("NOT_ENOUGH_CASH");
      user.cashBalance -= cost;
      user.cryptoBalances[input.asset] = currentAsset + input.amount;
    } else {
      if (currentAsset < input.amount) throw new Error("NOT_ENOUGH_CRYPTO");
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
