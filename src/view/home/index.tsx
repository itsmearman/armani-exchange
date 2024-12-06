import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link';
export default function HomeTrade() {
    const t = useTranslations();
    return (
        <div className="h-svh  md:h-[38.2rem] pt-[8rem] px-8">
            <div className="grid gap-y-10">
                <p className="text-center md:text-start font-bold text-2xl text-green-600">
                    {t("homeText")}
                </p>
                <p className="text-center md:text-start font-bold text-2xl text-blue-600">
                    {t("homeWelcomeText")}
                </p>
                <Link href={'/spot'} className='mx-auto w-[12rem] content-center text-center h-10 rounded-full md:mx-7 shadow-md bg-green-500 text-white hover:bg-blue-500 transition-all duration-100'>
                    {t("homeSpotButtonText")}
                </Link>
                <p className="text-center md:text-start text-blue-500 mt-[-2rem]">
                    {t("homeHelperText")}
                </p>
            </div>
        </div>
    )
}
