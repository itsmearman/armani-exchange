import Spot from "@/src/view/spot/index";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  
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
