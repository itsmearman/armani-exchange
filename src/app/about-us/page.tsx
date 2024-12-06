import React from 'react'
import AbutUsView from '@/src/view/about-us'
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  
  return {
    title: t("AboutUsTitle"),
    description: t("AboutUsTitleDescription"),
  };
}
export default function AboutUs() {
  return (
    <AbutUsView/>
  )
}
