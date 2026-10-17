import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, toPublicUser } from "@/lib/auth";
import { updateUserProfile } from "@/lib/db";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

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

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ error: "invalidImageType" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "imageTooLarge" }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    // Remove previous avatars for this user
    const existing = await fs.readdir(uploadDir);
    await Promise.all(
      existing
        .filter((name) => name.startsWith(`${sessionUser.id}.`))
        .map((name) => fs.unlink(path.join(uploadDir, name)).catch(() => undefined))
    );

    const fileName = `${sessionUser.id}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    const avatarUrl = `/uploads/avatars/${fileName}?v=${Date.now()}`;
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
