'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as THREE from 'three';

export default function HomeTrade() {
    const t = useTranslations();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Three.js animation setup
    useEffect(() => {
        if (!canvasRef.current) return;
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create floating coins
        const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
        const coinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x22c55e, // Green color matching your theme
            metalness: 0.8,
            roughness: 0.3,
        });
        
        const coins: THREE.Mesh[] = [];
        for (let i = 0; i < 15; i++) {
            const coin = new THREE.Mesh(coinGeometry, coinMaterial);
            coin.position.x = (Math.random() - 0.5) * 20;
            coin.position.y = (Math.random() - 0.5) * 20;
            coin.position.z = (Math.random() - 0.5) * 20 - 10;
            coin.rotation.x = Math.random() * Math.PI;
            coin.rotation.y = Math.random() * Math.PI;
            
            // Store random rotation speeds
            coin.userData = {
                rotationSpeedX: (Math.random() - 0.5) * 0.01,
                rotationSpeedY: (Math.random() - 0.5) * 0.01,
                floatSpeed: Math.random() * 0.005 + 0.002
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
        
        camera.position.z = 15;
        
        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Animate each coin
            coins.forEach(coin => {
                coin.rotation.x += coin.userData.rotationSpeedX;
                coin.rotation.y += coin.userData.rotationSpeedY;
                coin.position.y += Math.sin(Date.now() * coin.userData.floatSpeed) * 0.01;
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        setIsLoaded(true);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            coins.forEach(coin => {
                coin.geometry.dispose();
                if (coin.material instanceof THREE.Material) {
                    coin.material.dispose();
                }
            });
        };
    }, []);
    
    return (
        <div className="min-h-screen overflow-hidden">
            {/* Three.js Canvas Background */}
            <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full -z-10"
            />
            
            {/* Content */}
            <div className="pt-[8rem] px-4 md:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="text-green-600">{t("homeText")}</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-600">
                            {t("homeWelcomeText")}
                        </p>
                        <Link 
                            href="/spot" 
                            className="inline-block px-8 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            {t("homeSpotButtonText")}
                        </Link>
                        <p className="mt-4 text-blue-500">
                            {t("homeHelperText")}
                        </p>
                    </div>
                    
                    {/* Stats Card */}
                    <div className="md:w-1/2 max-w-md">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                            <h2 className="text-xl font-bold mb-4 text-green-600">بازار ارزهای دیجیتال</h2>
                            
                            {/* Market Stats */}
                            <div className="space-y-4">
                                {[
                                    { name: 'بیتکوین', symbol: 'BTC', price: '$43,256.78', change: '+2.4%', color: 'text-green-500' },
                                    { name: 'اتریوم', symbol: 'ETH', price: '$3,287.45', change: '+1.8%', color: 'text-green-500' },
                                    { name: 'کاردانو', symbol: 'ADA', price: '$0.58', change: '-0.7%', color: 'text-red-500' }
                                ].map((coin, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-3">
                                                <span className="font-bold text-blue-600 dark:text-blue-400">{coin.symbol.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{coin.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{coin.price}</p>
                                            <p className={`text-xs ${coin.color}`}>{coin.change}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    {[
                        {
                            title: 'معاملات آسان',
                            description: 'خرید و فروش ارزهای دیجیتال با چند کلیک ساده',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )
                        },
                        {
                            title: 'قیمت‌های لحظه‌ای',
                            description: 'دسترسی به قیمت‌های لحظه‌ای ارزهای دیجیتال',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            )
                        },
                        {
                            title: 'امنیت بالا',
                            description: 'معاملات امن با بالاترین استانداردهای امنیتی',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            )
                        }
                    ].map((feature, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transform transition-all duration-300 hover:scale-105">
                            <div className="text-green-600 dark:text-green-500 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-blue-600">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
