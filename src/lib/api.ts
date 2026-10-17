import { PublicUser } from "@/lib/types";

export type OrderDto = {
  id: number;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
};

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data as T;
}

export async function signupRequest(input: {
  email: string;
  password: string;
  username: string;
}) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ user: PublicUser }>(response);
}

export async function loginRequest(input: {
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ user: PublicUser }>(response);
}

export async function logoutRequest() {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  return parseJson<{ ok: boolean }>(response);
}

export async function meRequest() {
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  if (response.status === 401) {
    return { user: null as PublicUser | null };
  }
  return parseJson<{ user: PublicUser }>(response);
}

export async function profileRequest() {
  const response = await fetch("/api/profile", { cache: "no-store" });
  return parseJson<{
    id: string;
    username: string;
    email: string;
    cashBalance: number;
    cryptoBalances: Record<string, number>;
  }>(response);
}

export async function updateProfileRequest(input: {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ user: PublicUser }>(response);
}

export async function uploadAvatarRequest(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await fetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });
  return parseJson<{ user: PublicUser }>(response);
}

export async function ordersRequest() {
  const response = await fetch("/api/orders", { cache: "no-store" });
  return parseJson<{ orders: OrderDto[] }>(response);
}

export async function tradeRequest(input: {
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
}) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ order: OrderDto; user: PublicUser }>(response);
}
