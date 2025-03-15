import { Trade, Price, Security } from "@/src/components/icons";
import { useTranslations } from "next-intl";

export default function Items() {
  const t = useTranslations();
  const items = [
    {
      title: t("easyTrade"),
      description: t("easyTradeText"),
      icon: <Trade />,
    },
    {
      title: t("PriceCurrent"),
      description: t("PriceCurrentText"),
      icon: <Price />,
    },
    {
      title: t("Security"),
      description: t("SecurityText"),
      icon: <Security />,
    },
  ];
  return items;
}
