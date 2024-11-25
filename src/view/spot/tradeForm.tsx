import React, { useState } from "react";

function TradeForm({ prices, onTrade }:any) {
  const [tradeType, setTradeType] = useState("buy");
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [tradeAmount, setTradeAmount] = useState("");

  const handleSubmit = () => {
    const amount = parseFloat(tradeAmount);
    if (amount > 0) {
      onTrade(tradeType, selectedAsset, amount);
      setTradeAmount("");
    } else {
      alert("لطفاً مقدار معتبر وارد کنید!");
    }
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
        <label className="block text-sm font-medium text-gray-700">مقدار:</label>
        <input
          type="number"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
          placeholder="مقدار (واحد ارز)"
          className="w-full mt-1 border border-gray-300 rounded-lg p-2"
        />
      </div>

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
