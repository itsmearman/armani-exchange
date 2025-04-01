"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as THREE from "three";
import items from "./items";
import { updatePrices, useDispatch, useSelector } from "../spot/imports";
import { RootState } from "@/src/store/store";

export default function HomeTrade() {
  const t = useTranslations();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  
  // دریافت قیمت‌ها از Redux store
  const { bitcoin, ethereum, cardano } = useSelector(
    (state: RootState) => state.prices
  );
  
  // برای نمایش تغییرات قیمت
  const [priceChanges, setPriceChanges] = useState({
    bitcoin: { value: 0, isUp: true },
    ethereum: { value: 0, isUp: true },
    cardano: { value: 0, isUp: true }
  });
  
  // ذخیره قیمت‌های قبلی برای محاسبه تغییرات
  const prevPrices = useRef({ bitcoin: 0, ethereum: 0, cardano: 0 });

  // محاسبه تغییرات قیمت
  useEffect(() => {
    if (prevPrices.current.bitcoin > 0) {
      setPriceChanges({
        bitcoin: {
          value: ((bitcoin - prevPrices.current.bitcoin) / prevPrices.current.bitcoin) * 100,
          isUp: bitcoin >= prevPrices.current.bitcoin
        },
        ethereum: {
          value: ((ethereum - prevPrices.current.ethereum) / prevPrices.current.ethereum) * 100,
          isUp: ethereum >= prevPrices.current.ethereum
        },
        cardano: {
          value: ((cardano - prevPrices.current.cardano) / prevPrices.current.cardano) * 100,
          isUp: cardano >= prevPrices.current.cardano
        }
      });
    }
    
    // بروزرسانی قیمت‌های قبلی
    prevPrices.current = { bitcoin, ethereum, cardano };
  }, [bitcoin, ethereum, cardano]);

  // Three.js animation setup
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    // Set initial size
    const updateSize = () => {
      if (containerRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    
    updateSize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating coins - adjust number based on screen size
    const coinCount = window.innerWidth < 768 ? 8 : 15;
    const coinSize = window.innerWidth < 768 ? 0.8 : 1;

    const coinGeometry = new THREE.CylinderGeometry(coinSize, coinSize, 0.2, 32);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Green color matching your theme
      metalness: 0.8,
      roughness: 0.3,
    });

    const coins: THREE.Mesh[] = [];
    for (let i = 0; i < coinCount; i++) {
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      // Adjust position range based on screen size
      const positionRange = window.innerWidth < 768 ? 15 : 20;
      coin.position.x = (Math.random() - 0.5) * positionRange;
      coin.position.y = (Math.random() - 0.5) * positionRange;
      coin.position.z = (Math.random() - 0.5) * positionRange - 10;
      coin.rotation.x = Math.random() * Math.PI;
      coin.rotation.y = Math.random() * Math.PI;

      // Store random rotation speeds
      const speedFactor = window.innerWidth < 768 ? 0.7 : 1;
      coin.userData = {
        rotationSpeedX: (Math.random() - 0.5) * 0.01 * speedFactor,
        rotationSpeedY: (Math.random() - 0.5) * 0.01 * speedFactor,
        floatSpeed: Math.random() * 0.005 * speedFactor + 0.002,
      };

      scene.add(coin);
      coins.push(coin);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Adjust camera position based on screen size
    camera.position.z = window.innerWidth < 768 ? 12 : 15;

    // Handle window resize
    const handleResize = () => {
      updateSize();
      
      // Adjust camera position based on screen size
      camera.position.z = window.innerWidth < 768 ? 12 : 15;
      
      // Adjust coin visibility based on screen size
      coins.forEach((coin, index) => {
        if (window.innerWidth < 768 && index >= 8) {
          coin.visible = false;
        } else {
          coin.visible = true;
        }
      });
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate each coin
      coins.forEach((coin) => {
        if (coin.visible) {
          coin.rotation.x += coin.userData.rotationSpeedX;
          coin.rotation.y += coin.userData.rotationSpeedY;
          coin.position.y +=
            Math.sin(Date.now() * coin.userData.floatSpeed) * 0.01;
        }
      });

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);
    
    // WebSocket connection for live prices
    const ws = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(updatePrices(data));
    };
    
    ws.onopen = () => {
      console.log("WebSocket opened");
    };

    ws.onclose = () => {
      console.warn("WebSocket closed. Reconnecting...");
    };

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      coins.forEach((coin) => {
        coin.geometry.dispose();
        if (coin.material instanceof THREE.Material) {
          coin.material.dispose();
        }
      });
      ws.close();
    };
  }, [dispatch]);
  
  const Items = items();
  
  // تابع فرمت‌کننده قیمت
  const formatPrice = (price: number) => {
    if (price > 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    } else if (price > 1) {
      return `$${price}`;
    } else {
      return `$${price}`;
    }
  };
  
  // تابع برای نمایش تغییرات قیمت
  const formatChange = (change: number, isUp: boolean) => {
    const absChange = Math.abs(change);
    const formattedChange = absChange > 0.00001 ? absChange.toFixed(3) : "0.00";
    return `${isUp ? '+' : '-'}${formattedChange}%`;
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      {/* Content */}
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 text-center md:rtl:text-right md:ltr:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              <span className="text-green-600">{t("homeText")}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-blue-600">
              {t("homeWelcomeText")}
            </p>
            <Link
              href="/spot"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-green-500 text-white font-medium hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t("homeSpotButtonText")}
            </Link>
            <p className="mt-3 md:mt-4 text-blue-500 text-sm sm:text-base">
              {t("homeHelperText")}
            </p>
          </div>

          {/* Live Prices Card */}
          <div className="w-full md:w-1/2 max-w-md mt-8 md:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-green-600">
                {t("livePrice")}
              </h2>

              {/* Live Prices */}
              <div className="space-y-3 sm:space-y-4">
                {[
                  { 
                    name: t("bitcoin"), 
                    symbol: t("bitcoinsymbol"), 
                    price: bitcoin, 
                    change: priceChanges.bitcoin.value,
                    isUp: priceChanges.bitcoin.isUp
                  },
                  { 
                    name: t("ethereum"), 
                    symbol: t("ethereumsymbol"), 
                    price: ethereum, 
                    change: priceChanges.ethereum.value,
                    isUp: priceChanges.ethereum.isUp
                  },
                  { 
                    name: t("cardano"), 
                    symbol: t("cardanosymbol"), 
                    price: cardano, 
                    change: priceChanges.cardano.value,
                    isUp: priceChanges.cardano.isUp
                  },
                ].map((coin, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-2 sm:mx-3">
                        <span className="font-bold text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                          {coin.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{coin.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base">
                        {coin.price ? formatPrice(coin.price) : t("fetching")}
                      </p>
                      <p className={`text-xs ${coin.isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isLoaded? "isloadeding" : coin.price ? formatChange(coin.change, coin.isUp) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/spot"
                  className="block w-full text-center py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                >
                  {t("trade")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 md:mt-16 mb-20 md:mb-8">
          {Items.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transform transition-all duration-300 hover:scale-105"
            >
              <div className="text-green-600 dark:text-green-500 mb-3 sm:mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-blue-600">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
