'use client'
import { useTranslations } from "next-intl"

export default function LoadPage() {
    const t = useTranslations();
  return (
    <div className="flex w-full items-center justify-center ">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-lg font-medium text-gray-800">
          {t("LoadingMessage")}
        </p>
      </div>
    </div>
  )
}
