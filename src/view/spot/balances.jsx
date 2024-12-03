import React from "react";

function Balances({ cashBalance, cryptoBalance }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md justify-items-center">
      <p className="text-sm text-gray-800">
      <strong className="font-light text-lg text-black">$ {cashBalance.toFixed(2)}{" "}</strong>
        : موجودی نقدی
      </p>
      <p className="text-sm text-gray-800">
      <strong className="font-light text-lg text-black">BTC {cryptoBalance.bitcoin.toFixed(6)}{" "}</strong>
        : موجودی بیت‌کوین
      </p>
      <p className="text-sm text-gray-800">
      <strong className="font-light text-lg text-black">ETH {cryptoBalance.ethereum.toFixed(4)}{" "}</strong>
        : موجودی اتریوم
      </p>
    </div>
  );
}

export default Balances;
