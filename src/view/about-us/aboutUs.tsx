import React from "react";
import { useTranslations } from "next-intl";

export default function AbutUsVeiw() {
  const t = useTranslations();
  return (
    <div className="h-svh flex flex-col gap-5 items-center justify-center text-2xl text-justify">
      <p className="w-1/2 ">{t("abouttext")}</p>
      <div className="flex flex-row text-center gap-2">{t("email")} :<a href="mailto:arman.t.tehrani@gmail.com" className="text-blue-500 hover:text-green-500">arman.t.tehrani@gmail.com</a></div>
    </div>
  );
}
