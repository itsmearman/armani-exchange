import React from "react";

function Balances({ cashBalance, cryptoBalance }:any) {
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md justify-items-center">
      <p className="text-sm text-gray-600">
        $ {cashBalance.toFixed(2)}{" "}
        <strong className="font-semibold text-gray-800">: موجودی نقدی</strong>
      </p>
      <p className="text-sm text-gray-600">
        BTC {cryptoBalance.bitcoin.toFixed(6)}{" "}
        <strong className="font-semibold text-gray-800">: موجودی بیت‌کوین</strong>
      </p>
      <p className="text-sm text-gray-600">
        ETH {cryptoBalance.ethereum.toFixed(4)}{" "}
        <strong className="font-semibold text-gray-800">: موجودی اتریوم</strong>
      </p>
    </div>
  );
}

export default Balances;
