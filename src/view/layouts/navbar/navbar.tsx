import React from 'react';
import { NavbarItem } from './navbarItem';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/Logo1.png'
export default function Navbar() {
    const item = NavbarItem;
    return (
        <div className='font-IranSans h-[5rem] fixed bg-red-400 w-full flex justify-center gap-12'>
            <Link href={"/"}>
            <Image src={Logo} width={50} height={50} alt='' className='my-[0.8rem] w-auto' />
            </Link>
            {item.map((data: any, index) => (
                <Link href={data.route} key={index} className='my-[1.8rem]'>
                    {data.title}
                </Link>
            ))}
        </div>
    )
}
