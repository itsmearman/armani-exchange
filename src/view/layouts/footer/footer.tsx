import React from 'react'
import { useTranslations } from 'next-intl'
export default function Footer() {
  const t = useTranslations();
  return (
    <div className=' invisible h-[2rem] md:visible flex items-center justify-center bg-blue-100 text-xl text-blue-500'>{t("createdarman")}</div>
  )
}
