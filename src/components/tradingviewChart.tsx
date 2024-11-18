import { useEffect } from 'react';
import { useWidth } from './windowDimensions';

export const TradingViewChart = () => {
  // const width = useWidth();
  // let w: number;
  // let h: number;
  // if(width < 768) {
  //   w=300;
  //   h=300;
  // }else if (width > 768) {
  //   w = 600;
  //   h = 600;
  // }
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new window.TradingView.widget({
        container_id: 'technical-analysis',
        // width: w,
        // height: h,
        width: 900,
        height: 400,
        symbol: "BITSTAMP:BTCUSD",
        interval: "30",
        timezone: "exchange",
        theme: "White",
        style: "1",
        toolbar_bg: "#f1f3f6",
        withdateranges: false,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        save_image: false,
        hideideas: true,
        show_popup_button: false,
      });
    };
  }, []);

  return <div id='technical-analysis' className='z-[-1]'></div>;
};
