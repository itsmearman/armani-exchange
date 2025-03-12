"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/src/store/store";

export default function Client({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  return <Provider store={store}>{children}</Provider>;
}
