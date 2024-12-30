'use client'
import React from 'react'
import { Provider } from "react-redux";
import { store } from "@/src/store/store";

export default function Client({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}
