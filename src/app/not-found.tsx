import React from 'react'
import NotFoundView from '../view/notFound'
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  
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
