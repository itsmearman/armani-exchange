import { Home2, WalletMoney, Profile2User, Trade } from "iconsax-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

export type NavIconProps = {
  size?: number;
  className?: string;
  variant?: "Linear" | "Outline" | "TwoTone" | "Bulk" | "Broken" | "Bold";
};

export type NavItem = {
  title: string;
  route: string;
  Icon: ComponentType<NavIconProps>;
};

export default function useNavbarItems(): NavItem[] {
  const t = useTranslations();

  return [
    {
      title: t("home"),
      route: "/",
      Icon: Home2,
    },
    {
      title: t("myAssets"),
      route: "/assets",
      Icon: WalletMoney,
    },
    {
      title: t("trade"),
      route: "/spot",
      Icon: Trade,
    },
    {
      title: t("aboutUs"),
      route: "/about-us",
      Icon: Profile2User,
    },
  ];
}

export function isNavActive(pathname: string, route: string) {
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}
