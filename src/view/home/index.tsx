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
        grabCursor={true}
        modules={[EffectCards]}
        className="w-60 h-80"
      >
        {slider.map((data,index)=>(
        <SwiperSlide key={index} className={`content-center text-center align-middle items-center rounded-[18px] text-2xl font-bold text-white bg-[rgb(${data.color})]`}>
          <Link href={data.route}>
          {data.title}
          </Link>
        </SwiperSlide>
        ))
        }
      </Swiper>
    </div>
  );
}
