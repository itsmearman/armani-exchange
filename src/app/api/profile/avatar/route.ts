import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, toPublicUser } from "@/lib/auth";
import { updateUserProfile } from "@/lib/db";

export const runtime = "nodejs";

const MAX_SIZE = 1 * 1024 * 1024; // 1MB (stored as data URL)
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "noFile" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "invalidImageType" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "imageTooLarge" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const avatarUrl = `data:${file.type};base64,${base64}`;

    const user = await updateUserProfile({
      userId: sessionUser.id,
      avatarUrl,
    });

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "uploadFailed" }, { status: 500 });
  }
}
