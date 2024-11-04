import React from 'react';
import { NavbarItem } from './navbarItem';
import Link from 'next/link';

export default function Navbar() {
    const item = NavbarItem;
    return (
        <div className='font-IranSans h-[5rem] fixed bg-red-400 w-full flex justify-center gap-[6rem]'>
            {item.map((data: any, index) => (
                <Link href={data.route} key={index} className='my-[1.8rem]'>
                    {data.title}
                </Link>
            ))}
        </div>
    )
}
