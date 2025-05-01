"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoadPage from "./Loading";
import { useTranslations } from "next-intl";

export default function SignUpForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    router.prefetch("/spot");
  }, [router]);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) return setError(signUpError.message);

    const user = data.user;
    if (!user) return setError("خطا در دریافت اطلاعات کاربر");

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: user.id, username, email: user.email });

    if (profileError) {
      setLoading(false);
      return setError("ثبت نام انجام شد اما خطا در ذخیره نام کاربری");
    } else {
      window.location.reload();
    }
    router.push("/spot");
  };
  if (loading) return <LoadPage />;

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
            {" "}
            {t("login")}{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
