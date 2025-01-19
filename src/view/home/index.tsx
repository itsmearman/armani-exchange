// import React from 'react'
// import { useTranslations } from 'next-intl'
// import Link from 'next/link';
// export default function HomeTrade() {
//     const t = useTranslations();
//     return (
//         <div className="h-svh pt-[8rem] px-8">
//             <div className="grid gap-y-10">
//                 <p className="text-center font-bold text-2xl text-green-600">
//                     {t("homeText")}
//                 </p>
//                 <p className="text-center font-bold text-2xl text-blue-600">
//                     {t("homeWelcomeText")}
//                 </p>
//                 <Link href={'/spot'} className='mx-auto w-[12rem] content-center text-center h-10 rounded-full shadow-md bg-green-500 text-white hover:bg-blue-500 transition-all duration-100'>
//                     {t("homeSpotButtonText")}
//                 </Link>
//                 <p className="text-center text-blue-500 mt-[-2rem]">
//                     {t("homeHelperText")}
//                 </p>
//             </div>
//         </div>
//     )
// }

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderItem from "./sliderItem";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import Link from "next/link";

export default function App() {
    const slider = SliderItem();
  return (
    <div className="py-[8rem]">
      <Swiper
        effect={"cards"}
        loop={true}
        grabCursor={true}
        modules={[EffectCards]}
        className="w-60 h-80"
      >
        {slider.map((data,index)=>(
        <SwiperSlide key={index} 
        style={{ backgroundColor: `rgb(${data.color})` }}
        className="content-center text-center align-middle items-center rounded-[18px] text-xl font-bold text-white">
          <Link href={data.route}>
          <button className="w-10/12 h-10 bg-blue-900 rounded-[18px] hover:bg-blue-700 hover:text-blue-200 shadow-xl">
          {data.title}
          </button>
          </Link>
        </SwiperSlide>
        ))
        }
      </Swiper>
    </div>
  );
}
