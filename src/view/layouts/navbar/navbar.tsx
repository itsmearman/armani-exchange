"use client";
import React from "react";
import NavbarItem from "./navbarItem";
import Link from "next/link";
import Image from "next/image";
import LogoMD from "@/public/Logo1.png";
import Logo from "@/public/Logo.png";
import { usePathname } from "next/navigation";
import { useWidth } from "@/src/components/windowDimensions";
// import { ProfileCircle } from "iconsax-react";
import LocaleSwitcher from "@/src/components/locale/LocaleSwitcher";
import { Notification } from "iconsax-react";

export default function Navbar() {
  const item = NavbarItem();
  const slug = usePathname();
  const width = useWidth();


  return (
    <>
      <nav className="h-[5rem] fixed bottom-0 md:top-0 w-full flex px-6 shadow-lg justify-between bg-white">
        <Link href={"/"} className="hidden md:block">
          <Image src={Logo} width={150} height={100} alt="" />
        </Link>
        <div className="my-[1rem] md:my-[1.8rem] flex gap-x-8 mx-auto">
          {item.map((data, index) => (
            <Link
              href={data.route}
              key={index}
              className=" justify-items-center cursor-pointer hover:text-gray-400"
            >
              {width < 768 ? (data.route === slug ? (<>{data.imgActive}<span className="text-blue-600">{data.title}</span></>) : (<>{data.img}<span>{data.title}</span></>)) : (data.route === slug ? (<span className="text-blue-600">{data.title}</span>) : (<span>{data.title}</span>))}
            </Link>
          ))}
        </div>
        <div className="hidden md:block my-auto gap-4">
          <LocaleSwitcher />
          {/* <ProfileCircle size={42} color="black" className="invisible md:visible mx-auto rtl:ml-0 ltr:mr-0" /> */}
        </div>
      </nav>
      <div className="h-[5rem] visible md:invisible fixed top-0  w-full flex px-6 shadow-lg justify-between bg-white">
        <div className="my-auto px-4">
        <Notification
          size="32"
          color="black"
        />
        </div>   
          <Image src={LogoMD} width={100} alt="" className="mx-auto"/>
        <div className="my-auto gap-4">
          <LocaleSwitcher />
        </div>
      </div>
    </>
  );
}