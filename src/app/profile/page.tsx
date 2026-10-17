import { Profile } from "@/src/view/profile";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("ProfileTitle"),
    description: t("ProfileTitleDescription"),
  };
}

export default function ProfilePage() {
  return <Profile />;
}
