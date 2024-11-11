import { useEffect } from 'react';

export const TradingViewChart = () => {
  useEffect(() => {
    // Dynamically load TradingView script
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new window.TradingView.widget({
        container_id: 'technical-analysis',
        width: 600,
        height: 600,
        symbol: "BITSTAMP:BTCUSD",
        interval: "D",
        timezone: "exchange",
        theme: "White",
        style: "1",
        toolbar_bg: "#f1f3f6",
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        hideideas: true,
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650"
      });
    };
  }, []);

  return <div id="technical-analysis"></div>;
};
