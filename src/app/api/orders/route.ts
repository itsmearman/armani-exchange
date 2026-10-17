import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, toPublicUser } from "@/lib/auth";
import { getOrdersByUserId, placeTrade } from "@/lib/db";
import { getCryptoByName } from "@/src/config/cryptocurrencies";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getOrdersByUserId(user.id);
  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      type: order.type,
      asset: order.asset,
      amount: order.amount,
      price: order.price,
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const type = body.type as "buy" | "sell";
    const asset = String(body.asset || "");
    const amount = Number(body.amount);
    const price = Number(body.price);

    if (type !== "buy" && type !== "sell") {
      return NextResponse.json({ error: "Invalid trade type" }, { status: 400 });
    }

    if (!getCryptoByName(asset)) {
      return NextResponse.json({ error: "Unknown crypto" }, { status: 400 });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const { order, user } = await placeTrade({
      userId: sessionUser.id,
      type,
      asset,
      amount,
      price,
    });

    return NextResponse.json({
      order: {
        id: order.id,
        type: order.type,
        asset: order.asset,
        amount: order.amount,
        price: order.price,
      },
      user: toPublicUser(user),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TRADE_FAILED";

    if (message === "NOT_ENOUGH_CASH") {
      return NextResponse.json({ error: "notEnoughCash" }, { status: 400 });
    }
    if (message === "NOT_ENOUGH_CRYPTO") {
      return NextResponse.json({ error: "notEnoughCrypto" }, { status: 400 });
    }

    console.error("Trade error:", error);
    return NextResponse.json({ error: "orderFailed" }, { status: 500 });
  }
}
