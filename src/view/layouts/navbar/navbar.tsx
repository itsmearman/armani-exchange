"use client";
import React from "react";
import { NavbarItem } from "./navbarItem";
import Link from "next/link";
import Image from "next/image";
// import Logo from "@/public/Logo1.png";
import Logo from "@/public/Logo.png";
import { usePathname } from "next/navigation";
import { useWidth } from "@/src/components/windowDimensions";

export default function Navbar() {
  const item = NavbarItem;
  const slug = usePathname();
  const  width = useWidth();

  return (
    <nav className="font-IranSans h-[5rem] fixed bottom-0 md:top-0 w-full flex px-6 shadow-lg justify-between bg-white">
      <Link href={"/"} className="invisible md:visible">
        <Image src={Logo} width={150} height={100} alt="" />
      </Link>
      <div className="my-[1.8rem] flex gap-x-8">
        {item.map((data: any, index) => (
          <Link
            href={data.route}
            key={index}
            className="cursor-pointer hover:text-gray-400"
          >
            {width < 768 ? (data.route === slug ? (<>{data.imgActive}<span className="text-blue-600">{data.title}</span></>) : (<>{data.img}<span>{data.title}</span></>)):(data.route === slug ? (<span className="text-blue-600">{data.title}</span>) : (<span>{data.title}</span>))}
          </Link>
        ))}
      </div>
      <Link href={"/"}>
        <Image src={Logo} width={150} height={100} alt="" className="invisible md:visible"/>
      </Link>
    </nav>
  );
}