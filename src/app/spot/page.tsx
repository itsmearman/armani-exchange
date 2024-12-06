import Spot from "@/src/view/spot/index";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ locale }: { locale: string }): Promise<Metadata> {
  const t = await getTranslations(locale);
  
  return {
    title: t("SpotTitle"),
    description: t("SpotTitleDescription"),
  };
}

export default function SpotPage() {
  return (
    <Spot/>
  );
}
