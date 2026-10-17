"use client";

import { useEffect, useMemo, useState } from "react";

type TradingViewChartProps = {
  symbol: string;
};

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };

    syncTheme();
    setReady(true);

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      symbol,
      interval: "60",
      theme,
      style: "1",
      locale: "en",
      timezone: "Etc/UTC",
      enable_publishing: "false",
      hide_side_toolbar: "true",
      allow_symbol_change: "false",
      save_image: "false",
      calendar: "false",
      withdateranges: "true",
      studies: "[]",
    });

    return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
  }, [symbol, theme]);

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:h-[480px]">
      {ready ? (
        <iframe
          key={`${symbol}-${theme}`}
          title={`TradingView ${symbol}`}
          src={src}
          className="h-full w-full border-0"
          allow="fullscreen"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          Loading chart...
        </div>
      )}
    </div>
  );
}
