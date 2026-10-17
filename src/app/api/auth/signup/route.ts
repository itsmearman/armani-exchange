import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
  toPublicUser,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const username = String(body.username || "").trim();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, username, passwordHash });
    const token = await createSessionToken(user.id);

    const response = NextResponse.json({
      user: toPublicUser(user),
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    const message =
      error instanceof Error && error.message.includes("UPSTASH")
        ? "Server storage is not configured"
        : "Signup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
