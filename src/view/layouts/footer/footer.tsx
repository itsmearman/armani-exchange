import React from 'react'
import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from '../navbar/imports';

export default function Footer() {
  const t = useTranslations();
  return (
    <div className='invisible md:visible flex flex-col gap-4  items-center justify-center bg-blue-100 text-xl text-blue-500 p-2'>
      <LocaleSwitcher />
      <p>
        {t("createdarman")}
      </p>
    </div>
  )
}
