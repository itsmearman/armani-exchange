import React from 'react'
import AbutUsVeiw from '@/src/view/about-us'
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ locale }: { locale: string }): Promise<Metadata> {
  const t = await getTranslations(locale);
  
  return {
    title: t("AboutUsTitle"),
    description: t("AboutUsTitleDescription"),
  };
}
export default function AboutUs() {
  return (
    <AbutUsVeiw/>
  )
}
