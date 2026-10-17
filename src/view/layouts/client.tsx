"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/src/store/store";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/src/contexts/AuthContext";

export default function Client({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/spot");
  }, [router]);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
