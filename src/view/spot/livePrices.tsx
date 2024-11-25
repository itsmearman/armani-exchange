import React from "react";

function LivePrices({ prices }:any) {
  return (
    <div className="bg-white shadow rounded-lg p-6 items-center text-center w-full max-w-md">
      <h2 className="text-lg font-bold text-gray-800">قیمت زنده</h2>
      <p className="text-sm text-gray-600">
        <strong className="font-semibold text-gray-800">
          بیت‌کوین: {prices.bitcoin ? ` ${prices.bitcoin} ` : "در حال دریافت..."}
        </strong>
      </p>
      <p className="text-sm text-gray-600">
        <strong className="font-semibold text-gray-800">
          اتریوم: {prices.ethereum ? ` ${prices.ethereum} ` : "در حال دریافت..."}
        </strong>
      </p>
    </div>
  );
}

export default LivePrices;
