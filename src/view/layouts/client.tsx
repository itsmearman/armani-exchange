"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/src/store/store";
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function Client({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
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
      <SessionContextProvider supabaseClient={supabaseClient}>
        {children}
      </SessionContextProvider>
    </Provider>
  )
}
