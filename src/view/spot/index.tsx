'use client'
import React from 'react';
import {TradingViewChart} from '@/src/components/tradingviewChart';

export default function Spot() {
  return (
    <div className = "mx-auto pt-[5rem] flex justify-evenly flex-col">
          <h1 className='text-center'>Crypto Chart</h1>
          {/* <TradingViewChart /> */}
    </div>
  );
}
