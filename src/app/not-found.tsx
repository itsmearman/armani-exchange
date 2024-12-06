import React from 'react'
import NotFoundView from '../view/notFound'
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ locale }: { locale: string }): Promise<Metadata> {
  const t = await getTranslations(locale);
  
  return {
    title: t("NotFoundTitle"),
    description: t("NotFoundTitleDescription"),
  };
}
export default function NotFound() {
  return (
    <NotFoundView/>
  )
}
