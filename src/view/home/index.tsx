import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link';
export default function HomeTrade() {
    const t = useTranslations();
    return (
        <div className="h-svh pt-[8rem] px-8">
            <div className="grid gap-y-10">
                <p className="text-center font-bold text-2xl text-green-600">
                    {t("homeText")}
                </p>
                <p className="text-center font-bold text-2xl text-blue-600">
                    {t("homeWelcomeText")}
                </p>
                <Link href={'/spot'} className='mx-auto w-[12rem] content-center text-center h-10 rounded-full shadow-md bg-green-500 text-white hover:bg-blue-500 transition-all duration-100'>
                    {t("homeSpotButtonText")}
                </Link>
                <p className="text-center text-blue-500 mt-[-2rem]">
                    {t("homeHelperText")}
                </p>
            </div>
        </div>
    )
}

// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SliderItem from "./sliderItem";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-cards";
// import { EffectCards, Pagination, Navigation } from "swiper/modules";
// import Link from "next/link";
// import Image from "next/image";

// export default function App() {
//   const slider = SliderItem();

//   return (
//     <>
//       <div className="py-[8rem] hidden md:block">
//         <Swiper
//           effect="cards"
//           loop={true}
//           pagination={{
//             clickable: true,
//             renderBullet: (index, className) => `
//             <span 
//               class="${className}" 
//               style="width: 12px; height: 12px; background: rgba(255, 255, 255, 1);"
//             ></span>
//           `,
//           }}
//           modules={[Pagination]}
//           className="w-full h-96"
//         >
//           {slider.map((data, index) => (
//             <SwiperSlide
//               key={index}
//               style={{ backgroundColor: `rgb(150,150,150)` }}
//               className=" text-xl font-bold text-white"
//             >
//               <Image
//                 src={data.img}
//                 width={100}
//                 height={100}
//                 alt=""
//                 className="pl-10 mb-12 my-20"
//               />
//               <Link href={data.route}>
//                 <button className="w-1/4 h-10 bg-blue-900 rounded-3xl hover:bg-blue-700 hover:text-blue-200 shadow-xl mx-10">
//                   {data.title}
//                 </button>
//               </Link>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//       <div className="py-[8rem] md:hidden">
//         <Swiper
//           effect="cards"
//           loop={true}
//           grabCursor={true}
//           modules={[EffectCards]}
//           className={`w-60 h-80 `}
//           direction={"vertical"}
//         >
//           {slider.map((data, index) => (
//             <SwiperSlide
//               key={index}
//               style={{ backgroundColor: `rgb(${data.color})` }}
//               className="content-center text-center items-center rounded-[18px] text-xl font-bold text-white"
//             >
//               <Image
//                 src={data.img}
//                 width={100}
//                 height={100}
//                 alt=""
//                 className="mx-auto mb-12"
//               />
//               <Link href={data.route}>
//                 <button className="w-10/12 h-10 bg-blue-900 rounded-3xl hover:bg-blue-700 hover:text-blue-200 shadow-xl">
//                   {data.title}
//                 </button>
//               </Link>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </>
//   );
// }
