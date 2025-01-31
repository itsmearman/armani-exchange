import React from 'react'
import { useTranslations } from 'next-intl'
export default function NotFoundView() {
  const t = useTranslations();
  return (
    <div className='h-[95svh] flex flex-col items-center justify-center bg-gray-100 text-2xl'>
      <p className='font-bold text-4xl'>404</p>
      <p className=''>{t("notFound")}</p>
    </div>
  )
}
