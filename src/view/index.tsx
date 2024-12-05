import React from "react";
import { useTranslations } from "next-intl";
export default function Home() {
  const t = useTranslations();
  return (
    <div className="h-[46.5rem]  pt-[8rem] text-center md:pt-[15rem]">
      <div className="grid gap-y-10">
      <p className="font-light">
        {t("homeText")}
      </p>
      </div>
    </div>
  );
}
