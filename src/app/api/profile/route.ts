import { NextRequest, NextResponse } from "next/server";
import {
  getSessionUser,
  hashPassword,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";
import { findUserById, updateUserProfile } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl || null,
    cashBalance: user.cashBalance,
    cryptoBalances: user.cryptoBalances,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const username =
      body.username !== undefined ? String(body.username).trim() : undefined;
    const currentPassword =
      body.currentPassword !== undefined
        ? String(body.currentPassword)
        : undefined;
    const newPassword =
      body.newPassword !== undefined ? String(body.newPassword) : undefined;

    if (username !== undefined && username.length < 2) {
      return NextResponse.json(
        { error: "invalidUsername" },
        { status: 400 }
      );
    }

    let passwordHash: string | undefined;

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "weakPassword" },
          { status: 400 }
        );
      }
      if (!currentPassword) {
        return NextResponse.json(
          { error: "currentPasswordRequired" },
          { status: 400 }
        );
      }

      const fullUser = await findUserById(sessionUser.id);
      if (!fullUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const valid = await verifyPassword(
        currentPassword,
        fullUser.passwordHash
      );
      if (!valid) {
        return NextResponse.json(
          { error: "wrongPassword" },
          { status: 400 }
        );
      }

      passwordHash = await hashPassword(newPassword);
    }

    if (username === undefined && !passwordHash) {
      return NextResponse.json(
        { error: "nothingToUpdate" },
        { status: 400 }
      );
    }

    const user = await updateUserProfile({
      userId: sessionUser.id,
      username,
      passwordHash,
    });

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UPDATE_FAILED";

    if (message === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "usernameTaken" }, { status: 409 });
    }
    if (message === "INVALID_USERNAME") {
      return NextResponse.json({ error: "invalidUsername" }, { status: 400 });
    }

    console.error("Profile update error:", error);
    return NextResponse.json({ error: "updateFailed" }, { status: 500 });
  }
}
