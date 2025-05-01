"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoadPage from "./Loading"; // فرض کردم این یک صفحه لودینگ سبک داری
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/spot");
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ورود کاربر
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error(signInError);
      setError(t("invalidEmailOrPassword"));
      setLoading(false);
      return;
    }

    // دریافت session مطمئن برای ادامه
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error("Error getting session:", sessionError);
      setError(t("sessionError") || "مشکلی در ورود رخ داد.");
      setLoading(false);
      return;
    }

    // همه چیز اوکی: انتقال به اسپات
    router.replace("/spot");
  };

  if (loading) return <LoadPage />;

  return (
    <div className="max-w-md mx-auto mt-28 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("login")}</h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email")}
          type="email"
          className="border p-3 w-full rounded-lg bg-white dark:bg-gray-900"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("password")}
          type="password"
          className="border p-3 w-full rounded-lg bg-white dark:bg-gray-900"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 w-full rounded-lg transition-colors duration-200"
        >
          {t("login")}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
      <p className="text-center mt-4">
        {t("noAccount")}{" "}
        <a
          href="/signup"
          className="text-blue-500 hover:text-green-500 font-bold transition-colors duration-200"
        >
          {t("register")}
        </a>
      </p>
    </div>
  );
}
