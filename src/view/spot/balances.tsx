import React from "react";
import { useTranslations } from "next-intl";

interface BalancesProps {
  cashBalance: number;
  cryptoBalance: {
    [key: string]: number;
  };
}

function Balances({ cashBalance, cryptoBalance }: BalancesProps) {
  const t = useTranslations();

  return (
    <div className="shadow-md dark:shadow-white/50 rounded-lg p-6 w-full max-w-lg items-center text-center">
      <p className="text-sm">
          {t("balance") + " " + t("cash")} :
          <strong className="font-light text-lg">
            {cashBalance.toFixed(2)}{" "}
          </strong>
        </p>
      {Object.entries(cryptoBalance).map(([currency, amount], index) => (
        <p key={index} className="text-sm">
          {t("balance") + " " + t(`${currency}`)} :
          <strong className="font-light text-lg">
            {amount.toFixed(currency === "bitcoin" ? 6 : 4)}{" "}
          </strong>
        </p>
      ))}
    </div>
  );
}

export default Balances;
