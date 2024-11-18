import React, { useEffect, useState } from "react";

const WebSocketExample = () => {
  const [messages, setMessages] = useState([]); // برای ذخیره پیام‌های دریافت‌شده
  const [socket, setSocket] = useState(null); // اتصال وب‌سوکت

  useEffect(() => {
    // اتصال به WebSocket
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin");

    // ذخیره اتصال
    setSocket(ws);

    // زمانی که اتصال برقرار شد
    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send(JSON.stringify({ type: "subscribe", channel: "price-updates" }));
    };

    // دریافت پیام‌ها
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data]);
    };

    // مدیریت خطاها
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // زمانی که اتصال بسته شد
    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    // پاک‌سازی اتصال هنگام خروج از کامپوننت
    return () => {
      ws.close();
    };
  }, []);

  // ارسال پیام از کلاینت به سرور
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", content: "Hello Server!" }));
    }
  };

  return (
    <div>
      <h1>WebSocket Example</h1>
      <button onClick={sendMessage}>ارسال پیام به سرور</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketExample;
