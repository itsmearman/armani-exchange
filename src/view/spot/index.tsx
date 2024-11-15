'use client'
import React from 'react';
import {TradingViewChart} from '@/src/components/tradingviewChart';
import OrderBox from './orderbox';

export default function Spot() {
  return (
    <div className='flex flex-col mt-[6rem]'>
          <TradingViewChart />
          <OrderBox/>
    </div>
  );
}
