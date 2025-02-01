import React from 'react'
import OfflineView from '@/src/view/offline'
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
    <OfflineView/>
  )
}
