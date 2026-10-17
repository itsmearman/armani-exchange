"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadPage from "./Loading";
import { useTranslations } from "next-intl";
import { useAuth } from "@/src/contexts/AuthContext";

export default function SignUpForm() {
  const t = useTranslations();
  const { signup, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/spot");
  }, [router]);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(username, email, password);
      router.replace("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Signup failed";
      setError(message);
      setLoading(false);
    }
  };

  if (loading || authLoading) return <LoadPage />;

  return (
    <div className="max-w-md mx-auto mt-28">
      <h1 className="text-xl font-bold mb-4 text-center">{t("signup")}</h1>
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleSignUp} className="space-y-6">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("username")}
            className="border p-2 w-full rounded bg-white dark:bg-gray-900"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            type="email"
            className="border p-2 w-full rounded bg-white dark:bg-gray-900"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password")}
            type="password"
            className="border p-2 w-full rounded bg-white dark:bg-gray-900"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 w-full rounded-lg"
          >
            {t("createacc")}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <p className="p-3">
          {t("haveacc")}{" "}
          <a
            className="text-blue-500 hover:text-green-500 font-bold"
            href="/login"
          >
            {t("login")}
          </a>
        </p>
      </div>
    </div>
  );
}
