import Home from "@/src/view/index";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ locale }: { locale: string }): Promise<Metadata> {
  const t = await getTranslations(locale);
  
  return {
    title: t("HomeTitle"),
    description: t("HomeTitleDescription"),
  };
}

export default function HomePage() {
  return <Home />;
}
