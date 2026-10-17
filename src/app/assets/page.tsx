import { Assets } from "@/src/view/assets";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("AssetsTitle"),
    description: t("AssetsTitleDescription"),
  };
}

export default function AssetsPage() {
  return <Assets />;
}
