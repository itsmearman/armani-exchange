import React from "react";
import { useTranslations } from "next-intl";

export default function AbutUsVeiw() {
  const t = useTranslations();
  return (
    <div className="h-[95svh] flex flex-col gap-5 items-center justify-center bg-gray-50 text-2xl">
      <div className="flex flex-col text-center gap-2">{t("email")}<a href="mailto:arman.t.tehrani@gmail.com" className="text-blue-500 hover:text-green-500">arman.t.tehrani@gmail.com</a></div>
    </div>
  );
}
