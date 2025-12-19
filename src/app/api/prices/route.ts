import { NextResponse } from "next/server";
import { getCoinGeckoIds } from "@/src/config/cryptocurrencies";

export async function GET() {
  try {
    const ids = getCoinGeckoIds();
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
