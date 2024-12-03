import React from "react";

function LivePrices({ prices }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 items-center text-center w-full max-w-md">
      <h2 className="text-lg font-bold text-black">قیمت زنده</h2>
      <p className="text-sm text-gray-900">
          بیت‌کوین   : 
          <strong className="font-light text-lg text-black">{prices.bitcoin ? ` ${prices.bitcoin} ` : "در حال دریافت..."}
        </strong>
      </p>
      <p className="text-sm text-gray-900">
          اتریوم  : 
          <strong className="font-light text-lg text-black">{prices.ethereum ? ` ${prices.ethereum} ` : "در حال دریافت..."}
        </strong>
      </p>
    </div>
  );
}

export default LivePrices;
