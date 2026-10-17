"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { DocumentUpload, Logout } from "iconsax-react";
import LoadPage from "@/src/components/Loading";
import { useAuth } from "@/src/contexts/AuthContext";
import { updateProfileRequest, uploadAvatarRequest } from "@/src/lib/api";

export default function Profile() {
  const t = useTranslations();
  const router = useRouter();
  const { user, loading: authLoading, refresh, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resolveError = (code: string) => {
    const map: Record<string, string> = {
      invalidUsername: t("invalidUsername"),
      usernameTaken: t("usernameTaken"),
      weakPassword: t("weakPassword"),
      currentPasswordRequired: t("currentPasswordRequired"),
      wrongPassword: t("wrongPassword"),
      passwordMismatch: t("passwordMismatch"),
      nothingToUpdate: t("nothingToUpdate"),
      updateFailed: t("updateFailed"),
      noFile: t("noFile"),
      invalidImageType: t("invalidImageType"),
      imageTooLarge: t("imageTooLarge"),
      uploadFailed: t("uploadFailed"),
    };
    return map[code] || code;
  };

  const avatarSrc =
    previewUrl ||
    (user?.avatarUrl ? user.avatarUrl.split("?")[0] : null);

  const handleAvatarPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingAvatar(true);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      await uploadAvatarRequest(file);
      await refresh();
      toast.success(t("avatarUpdated"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "uploadFailed";
      setError(resolveError(message));
      setPreviewUrl(null);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavingProfile(true);

    try {
      await updateProfileRequest({ username });
      await refresh();
      toast.success(t("profileUpdated"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "updateFailed";
      setError(resolveError(message));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout Error:", error);
      setLoggingOut(false);
    }
  };

  const handleSavePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfileRequest({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(t("passwordUpdated"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "updateFailed";
      setError(resolveError(message));
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading || !user) return <LoadPage />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 pb-28 pt-[6.5rem] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 md:pb-10 md:pt-24">
      <div className="mx-auto w-full max-w-2xl space-y-4 px-3 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("profile")}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {t("profileDescription")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/assets"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              {t("myAssets")}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <Logout size={18} variant="Bold" />
              {loggingOut ? t("LoadingMessage") : t("logout")}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={user.username}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-100 dark:ring-green-500/20"
                />
              ) : (
                <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold uppercase text-blue-600 dark:bg-green-500/15 dark:text-green-400">
                  {user.username.charAt(0)}
                </span>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarPick}
              />
            </div>

            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <div className="text-center sm:text-start">
                <p className="text-lg font-semibold">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {uploadingAvatar ? t("uploadingAvatar") : t("avatarHint")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-green-500 dark:text-gray-950 dark:hover:bg-green-400"
              >
                <DocumentUpload size={20} variant="Bold" />
                {uploadingAvatar ? t("uploadingAvatar") : t("uploadAvatar")}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40">
              {error}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">
                {t("email")}
              </label>
              <input
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-gray-400">
                {t("username")}
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                required
                minLength={2}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile || username === user.username}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:text-gray-950 dark:hover:bg-green-400"
            >
              {savingProfile ? t("LoadingMessage") : t("saveProfile")}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-4 text-sm font-semibold">{t("changePassword")}</h2>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">
                {t("currentPassword")}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">
                {t("newPassword")}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">
                {t("confirmPassword")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              {savingPassword ? t("LoadingMessage") : t("updatePassword")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
