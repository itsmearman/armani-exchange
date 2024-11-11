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
console.log(width);

  return (
    <nav className="font-IranSans h-[5rem] fixed bottom-0 md:top-0 w-full flex px-6 shadow-xl justify-between">
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
            { width < 768 ? 
            <Image src={data.route == slug ? data.imgActive : data.img} width={20} height={20} alt="" className="mx-auto text-center"/>
            : null}
            {data.title}
          </Link>
        ))}
      </div>
      <Link href={"/"}>
        <Image src={Logo} width={150} height={100} alt="" className="invisible md:visible"/>
      </Link>
    </nav>
  );
}