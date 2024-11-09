"use client";
// import React from "react";
import { NavbarItem } from "./navbarItem";
// import Link from "next/link";
// import Image from "next/image";
// import Logo from '@/public/Logo1.png'
// import Logo from "@/public/Logo.png";
// import { Drawer } from "@mui/material";
// import Button from "@mui/material/Button";
// export default function Navbar() {
//   const item = NavbarItem;
//   const [open, setOpen] = React.useState(false);

//   const toggleDrawer = (newOpen: boolean) => () => {
//     setOpen(newOpen);
//   };

//   return (
// <nav className='font-IranSans h-[5rem] fixed w-full flex px-6 shadow-xl justify-between'>
//     <Link href={"/"}>
//     <Image src={Logo} width={150} height={100} alt='' />
//     </Link>
//     <div className="my-[1.8rem] flex gap-x-8">
//     {item.map((data: any, index) => (
//         <Link href={data.route} key={index} className=' cursor-pointer hover:text-gray-400'>
//             {data.title}
//         </Link>
//     ))}
//     </div>
//     <Link href={"/"}>
//     <Image src={Logo} width={150} height={100} alt='' />
//     </Link>
// </nav>
//     <Drawer open={open} onClose={toggleDrawer(false)} className="bg-red-400">
//       <Button onClick={toggleDrawer(true)}>Open drawer</Button>
//       <div className="my-[1.8rem] flex gap-x-8">
//         {item.map((data: any, index) => (
//           <Link
//             href={data.route}
//             key={index}
//             className=" cursor-pointer hover:text-gray-400"
//           >
//             {data.title}
//           </Link>
//         ))}
//       </div>
//     </Drawer>
//   );
// }
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import { HamburgerMenu } from "@/src/components/icons";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const item = NavbarItem;
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {item.map((text, index) => (
          <Link
            href={data.route}
            key={index}
            className=" cursor-pointer hover:text-gray-400"
          >
            {data.title}
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <HamburgerMenu />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
