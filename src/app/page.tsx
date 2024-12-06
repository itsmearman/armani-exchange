import Home from "@/src/view/index";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  
  return {
    title: t("HomeTitle"),
    description: t("HomeTitleDescription"),
  };
}

export default function HomePage() {
  return <Home />;
}
