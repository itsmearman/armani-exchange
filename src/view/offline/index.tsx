import React from 'react'
import { useTranslations } from 'next-intl'
export default function NotFoundView() {
  const t = useTranslations();
  return (
    <div className='h-svh flex flex-col items-center justify-center bg-gray-100 text-2xl'>
      <p className='font-bold text-4xl'>your offline</p>
      <p className=''>{t("your offline")}</p>
    </div>
  )
}