import React, { useState } from "react";

function TradeForm({ prices, onTrade }: any) {
  const [tradeType, setTradeType] = useState("buy");
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [tradeAmount, setTradeAmount]:any = useState(""); // مبلغ معامله
  const [cryptoAmount, setCryptoAmount]:any = useState(""); // مقدار ارز

  const currentPrice = parseFloat(prices[selectedAsset] || 0); // قیمت فعلی

  const handleSubmit = () => {
    const totalAmount = parseFloat(tradeAmount);
    const cryptoQty = parseFloat(cryptoAmount);

    if ((!totalAmount && !cryptoQty) || currentPrice <= 0) {
      alert("لطفاً مبلغ یا مقدار ارز را وارد کنید!");
      return;
    }

    if (totalAmount && cryptoQty) {
      alert("لطفاً فقط یکی از فیلدها (مبلغ یا مقدار ارز) را پر کنید!");
      return;
    }

    const calculatedAmount = totalAmount
      ? totalAmount / currentPrice // محاسبه مقدار ارز از مبلغ
      : cryptoQty; // استفاده از مقدار واردشده ارز

    const calculatedTotal = cryptoQty
      ? cryptoQty * currentPrice // محاسبه مبلغ از مقدار ارز
      : totalAmount; // استفاده از مبلغ واردشده

    if (calculatedAmount <= 0 || calculatedTotal <= 0) {
      alert("مقادیر واردشده معتبر نیستند!");
      return;
    }

    // ارسال معامله به تابع والد
    onTrade(tradeType, selectedAsset, calculatedAmount, calculatedTotal);

    // پاک‌سازی مقادیر
    setTradeAmount("");
    setCryptoAmount("");
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">نوع معامله:</label>
        <select
          value={tradeType}
          onChange={(e) => setTradeType(e.target.value)}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2"
        >
          <option value="buy">خرید</option>
          <option value="sell">فروش</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ارز دیجیتال:</label>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">مبلغ (USD):</label>
        <input
          type="number"
          value={tradeAmount}
          onChange={(e) => {
            setTradeAmount(e.target.value);
            setCryptoAmount(""); // پاک‌سازی مقدار ارز
          }}
          placeholder="مبلغ معامله"
          className="w-full mt-1 border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">مقدار ارز:</label>
        <input
          type="number"
          value={cryptoAmount}
          onChange={(e) => {
            setCryptoAmount(e.target.value);
            setTradeAmount(""); // پاک‌سازی مبلغ معامله
          }}
          placeholder="مقدار ارز (واحد)"
          className="w-full mt-1 border border-gray-300 rounded-lg p-2"
        />
        {!tradeAmount && !cryptoAmount && currentPrice > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            قیمت فعلی: <strong>{currentPrice.toFixed(2)} USD</strong>
          </p>
        )}
      </div>

      {currentPrice > 0 && (tradeAmount || cryptoAmount) && (
        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800">
          <p>
            {tradeAmount
              ? `مقدار ارز محاسبه‌شده: ${(tradeAmount / currentPrice).toFixed(6)}`
              : `مبلغ محاسبه‌شده: ${(cryptoAmount * currentPrice).toFixed(2)} USD`}
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        انجام معامله
      </button>
    </div>
  );
}

export default TradeForm;