import React from "react";
import { useTranslations } from "next-intl";

export default function AbutUsVeiw() {
  const t = useTranslations();
  return (
    <div className="h-svh md:h-[38.2rem] flex flex-col gap-5 items-center justify-center bg-gray-50 text-2xl">
      <div className="flex flex-col text-center gap-2">{t("phone")}<a href="tel:09212871700" className="text-green-500 hover:text-blue-500">09212871700</a></div>
      <div className="flex flex-col text-center gap-2">{t("email")}<a href="mailto:arman.t.tehrani@gmail.com" className="text-blue-500 hover:text-green-500">arman.t.tehrani@gmail.com</a></div>
    </div>
  );
}
