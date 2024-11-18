'use client'
// import React from 'react';
// import {TradingViewChart} from '@/src/components/tradingviewChart';
// import OrderBox from './orderbox';
// import WebSocketExample from './websocket';

// export default function Spot() {
//   return (
//     <div className='flex flex-col mt-[6rem]'>
//           <TradingViewChart />
//           <OrderBox/>
//           <WebSocketExample/>
//     </div>
//   );
// }




//محاسبه سود و زیان

// import React, { useEffect, useState } from "react";

// const ProfitLossCalculator = () => {
//   const [price, setPrice] = useState(0); // قیمت زنده
//   const [buyPrice, setBuyPrice] = useState(""); // قیمت خرید کاربر
//   const [quantity, setQuantity] = useState(""); // مقدار خریداری‌شده
//   const [profitLoss, setProfitLoss] = useState(null); // مقدار سود یا زیان

//   useEffect(() => {
//     // اتصال به WebSocket CoinCap
//     const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin");

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.bitcoin) {
//         setPrice(parseFloat(data.bitcoin));
//       }
//     };

//     ws.onclose = () => {
//       console.log("WebSocket Disconnected");
//     };

//     // پاک‌سازی اتصال WebSocket
//     return () => {
//       ws.close();
//     };
//   }, []);

//   // محاسبه سود یا زیان
//   const calculateProfitLoss = () => {
//     if (!buyPrice || !quantity || !price) {
//       alert("لطفاً قیمت خرید، مقدار و قیمت فعلی را وارد کنید!");
//       return;
//     }
//     const cost = parseFloat(buyPrice) * parseFloat(quantity); // هزینه کل خرید
//     const currentValue = price * parseFloat(quantity); // ارزش فعلی
//     const result = currentValue - cost; // محاسبه سود یا زیان
//     setProfitLoss(result);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
//       <h1>محاسبه سود و زیان معامله</h1>

//       {/* نمایش قیمت زنده بیت‌کوین */}
//       <p>
//         <strong>قیمت زنده بیت‌کوین:</strong> {price ? `${price.toFixed(1)} USD` : "در حال دریافت..."}
//       </p>

//       {/* فرم ورود اطلاعات */}
//       <div style={{ marginBottom: "20px" }}>
//         <label>قیمت خرید (USD):</label>
//         <input
//           type="number"
//           value={buyPrice}
//           onChange={(e) => setBuyPrice(e.target.value)}
//           placeholder="قیمت خرید"
//           style={{ display: "block", width: "100%", marginBottom: "10px" }}
//         />
//         <label>مقدار خریداری‌شده (BTC):</label>
//         <input
//           type="number"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           placeholder="مقدار"
//           style={{ display: "block", width: "100%", marginBottom: "10px" }}
//         />
//         <button onClick={calculateProfitLoss} style={{ padding: "10px 20px", cursor: "pointer" }}>
//           محاسبه سود و زیان
//         </button>
//       </div>

//       {/* نمایش نتیجه */}
//       {profitLoss !== null && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>نتیجه:</h3>
//           <p>
//             {profitLoss > 0 ? (
//               <span className="text-green-600">سود: {profitLoss.toFixed(1)} USD</span>
//             ) : profitLoss < 0 ? (
//               <span className="text-red-700">زیان: {profitLoss.toFixed(1)} USD</span>
//             ) : (
//               "بدون سود یا زیان"
//             )}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfitLossCalculator;




//   ثبت سفارش 


// import React, { useState } from "react";
// import { Line } from "react-chartjs-2";
// import { Container, Grid, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // ثبت ماژول‌های Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // داده‌های نمونه برای نمودار
// const data = {
//   labels: ["10:00", "10:05", "10:10", "10:15", "10:20"],
//   datasets: [
//     {
//       label: "قیمت بیت‌کوین",
//       data: [29200, 29300, 29250, 29400, 29350],
//       borderColor: "rgba(75,192,192,1)",
//       backgroundColor: "rgba(75,192,192,0.2)",
//     },
//   ],
// };

// // گزینه‌های نمودار
// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
// };

// const SpotTrade = () => {
//   const [orders, setOrders] = useState([]); // ذخیره سفارشات
//   const [formData, setFormData] = useState({ price: "", amount: "", type: "" }); // داده‌های فرم

//   // مدیریت تغییرات فرم
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ثبت سفارش
//   const handleOrderSubmit = (type) => {
//     if (!formData.price || !formData.amount) {
//       alert("لطفاً مقدار و قیمت را وارد کنید!");
//       return;
//     }
//     const newOrder = {
//       ...formData,
//       type,
//       id: Date.now(), // ایجاد یک شناسه یکتا
//     };
//     setOrders((prev) => [newOrder, ...prev]);
//     setFormData({ price: "", amount: "", type: "" }); // بازنشانی فرم
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Spot Trade
//       </Typography>
//       <Grid container spacing={3}>
//         {/* نمودار قیمت */}
//         <Grid item xs={12} md={8}>
//           <Paper style={{ padding: 16 }}>
//             <Typography variant="h6">نمودار قیمت</Typography>
//             <div style={{ height: "400px" }}>
//               <Line data={data} options={options} />
//             </div>
//           </Paper>
//         </Grid>

//         {/* فرم ارسال سفارش */}
//         <Grid item xs={12} md={4}>
//           <Paper style={{ padding: 16 }}>
//             <Typography variant="h6">ارسال سفارش</Typography>
//             <TextField
//               label="قیمت"
//               name="price"
//               type="number"
//               value={formData.price}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//             />
//             <TextField
//               label="مقدار"
//               name="amount"
//               type="number"
//               value={formData.amount}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={() => handleOrderSubmit("خرید")}
//             >
//               خرید
//             </Button>
//             <Button
//               variant="outlined"
//               color="secondary"
//               fullWidth
//               style={{ marginTop: 8 }}
//               onClick={() => handleOrderSubmit("فروش")}
//             >
//               فروش
//             </Button>
//           </Paper>
//         </Grid>

//         {/* لیست سفارشات */}
//         <Grid item xs={12}>
//           <Paper style={{ padding: 16 }}>
//             <Typography variant="h6">لیست سفارشات</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>قیمت</TableCell>
//                   <TableCell>مقدار</TableCell>
//                   <TableCell>نوع</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={3} align="center">
//                       سفارشی وجود ندارد
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   orders.map((order) => (
//                     <TableRow key={order.id}>
//                       <TableCell>{order.price}</TableCell>
//                       <TableCell>{order.amount}</TableCell>
//                       <TableCell>{order.type}</TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default SpotTrade;




//تبدیل ارز دیچیتال به دلار

// import React, { useEffect, useState } from "react";

// const AccountBalance = () => {
//   const [prices, setPrices] = useState({}); // قیمت‌های زنده ارزها
//   const [balances, setBalances] = useState([
//     { asset: "bitcoin", amount: 0 },
//     { asset: "ethereum", amount: 0 },
//   ]); // موجودی کاربر
//   const [totalValue, setTotalValue] = useState(0); // ارزش کل دارایی

//   // اتصال به WebSocket CoinCap
//   useEffect(() => {
//     const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum");

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setPrices((prevPrices) => ({ ...prevPrices, ...data }));
//     };

//     ws.onclose = () => {
//       console.log("WebSocket Disconnected");
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   // محاسبه ارزش کل دارایی
//   useEffect(() => {
//     const total = balances.reduce((sum, { asset, amount }) => {
//       const price = prices[asset] || 0;
//       return sum + price * amount;
//     }, 0);
//     setTotalValue(total);
//   }, [prices, balances]);

//   // مدیریت تغییر مقدار موجودی
//   const handleBalanceChange = (index, amount) => {
//     setBalances((prevBalances) =>
//       prevBalances.map((balance, i) =>
//         i === index ? { ...balance, amount: parseFloat(amount) || 0 } : balance
//       )
//     );
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
//       <h1>موجودی حساب</h1>

//       <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
//         <thead>
//           <tr>
//             <th style={{ border: "1px solid #ccc", padding: "8px" }}>ارز دیجیتال</th>
//             <th style={{ border: "1px solid #ccc", padding: "8px" }}>موجودی (واحد)</th>
//             <th style={{ border: "1px solid #ccc", padding: "8px" }}>قیمت زنده (USD)</th>
//             <th style={{ border: "1px solid #ccc", padding: "8px" }}>ارزش (USD)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {balances.map((balance, index) => {
//             const price = prices[balance.asset]; // دریافت قیمت زنده برای ارز
//             const value = price ? price * balance.amount : 0; // محاسبه ارزش
//             return (
//               <tr key={balance.asset}>
//                 <td style={{ border: "1px solid #ccc", padding: "8px", textTransform: "capitalize" }}>
//                   {balance.asset}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   <input
//                     type="number"
//                     value={balance.amount}
//                     onChange={(e) => handleBalanceChange(index, e.target.value)}
//                     style={{ width: "100%" }}
//                   />
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   {price && typeof price === "number" ? price.toFixed(2) : "در حال دریافت..."}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   {value > 0 ? value.toFixed(2) : "0.00"}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <h2>ارزش کل دارایی: {totalValue.toFixed(2)} USD</h2>
//     </div>
//   );
// };

// export default AccountBalance;






//انجام معامعله و نمایش کیف پول


// import React, { useEffect, useState } from "react";

// const TradingApp = () => {
//   const [cashBalance, setCashBalance] = useState(100000); // موجودی نقدی اولیه
//   const [cryptoBalance, setCryptoBalance] = useState({ bitcoin: 0 }); // موجودی ارز دیجیتال
//   const [prices, setPrices] = useState({}); // قیمت زنده ارزها
//   const [tradeAmount, setTradeAmount] = useState(""); // مقدار خرید یا فروش
//   const [selectedAsset, setSelectedAsset] = useState("bitcoin"); // ارز انتخابی
//   const [tradeType, setTradeType] = useState("buy"); // نوع معامله (خرید یا فروش)

//   // اتصال به WebSocket CoinCap
//   useEffect(() => {
//     const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin");

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setPrices((prevPrices) => ({ ...prevPrices, ...data }));
//     };

//     ws.onclose = () => {
//       console.log("WebSocket Disconnected");
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   // انجام معامله
//   const handleTrade = () => {
//     const price = parseFloat(prices[selectedAsset] || 0);
//     const amount = parseFloat(tradeAmount);
  
//     if (!amount || amount <= 0) {
//       alert("لطفاً مقدار معتبر وارد کنید!");
//       return;
//     }
  
//     if (tradeType === "buy") {
//       const cost = price * amount; // هزینه خرید
//       if (cost > cashBalance) {
//         alert("موجودی نقدی کافی نیست!");
//         return;
//       }
//       setCashBalance((prev) => prev - cost); // کاهش موجودی نقدی
//       setCryptoBalance((prev) => ({
//         ...prev,
//         [selectedAsset]: (prev[selectedAsset] || 0) + amount,
//       })); // افزایش موجودی ارز دیجیتال
//     } else if (tradeType === "sell") {
//       if ((cryptoBalance[selectedAsset] || 0) < amount) {
//         alert("موجودی ارز دیجیتال کافی نیست!");
//         return;
//       }
//       const earnings = price * amount; // درآمد فروش
//       setCashBalance((prev) => prev + earnings); // افزایش موجودی نقدی
//       setCryptoBalance((prev) => ({
//         ...prev,
//         [selectedAsset]: (prev[selectedAsset] || 0) - amount,
//       })); // کاهش موجودی ارز دیجیتال
//     }
  
//     setTradeAmount(""); // پاک کردن مقدار معامله
//   };
  

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
//       <h1>سیستم خرید و فروش ارز دیجیتال</h1>

//       {/* نمایش موجودی‌ها */}
//       <div style={{ marginBottom: "20px" }}>
//         <p>
//           <strong>موجودی نقدی:</strong> ${cashBalance.toFixed(2)}
//         </p>
//         <p>
//           <strong>موجودی بیت‌کوین:</strong> {cryptoBalance.bitcoin.toFixed(6)} BTC
//         </p>
//       </div>

//       {/* فرم خرید و فروش */}
//       <div style={{ marginBottom: "20px" }}>
//         <label>نوع معامله:</label>
//         <select value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
//           <option value="buy">خرید</option>
//           <option value="sell">فروش</option>
//         </select>

//         <label style={{ display: "block", marginTop: "10px" }}>ارز دیجیتال:</label>
//         <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}>
//           <option value="bitcoin">Bitcoin (BTC)</option>
//         </select>

//         <label style={{ display: "block", marginTop: "10px" }}>مقدار:</label>
//         <input
//           type="number"
//           value={tradeAmount}
//           onChange={(e) => setTradeAmount(e.target.value)}
//           placeholder="مقدار (واحد ارز)"
//           style={{ width: "100%", marginTop: "5px" }}
//         />

//         <button
//           onClick={handleTrade}
//           style={{
//             marginTop: "10px",
//             padding: "10px 20px",
//             backgroundColor: "#007BFF",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           انجام معامله
//         </button>
//       </div>

//       {/* نمایش قیمت زنده */}
//       <div>
//   <h2>قیمت زنده</h2>
//   <p>
//     <strong>بیت‌کوین:</strong> 
//     {prices.bitcoin && typeof prices.bitcoin === "number"
//       ? `$${prices.bitcoin.toFixed(2)}`
//       : "در حال دریافت..."}
//   </p>
// </div>

//     </div>
//   );
// };

// export default TradingApp;
