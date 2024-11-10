"use client";
import React from "react";
import { NavbarItem } from "./navbarItem";
import Link from "next/link";
import Image from "next/image";
// import Logo from "@/public/Logo1.png";
import Logo from "@/public/Logo.png";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const item = NavbarItem;
  const slug = usePathname();
  console.log(slug);

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
            <Image src={data.route == slug ? data.imgActive : data.img} width={20} height={20} alt="" className="mx-auto text-center"/>
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

//drawer

// import * as React from "react";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";
// import Button from "@mui/material/Button";
// import List from "@mui/material/List";
// import { HamburgerMenu } from "@/src/components/icons";
// import Link from "next/link";

// export default function TemporaryDrawer() {
//   const [open, setOpen] = React.useState(false);
//   const item = NavbarItem;
//   const toggleDrawer = (newOpen: boolean) => () => {
//     setOpen(newOpen);
//   };

//   const DrawerList = (
//     <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
//       <div className="flex flex-col items-center gap-9 pt-4">
//         {item.map((text, index) => (
//           <Link
//             href={text.route}
//             key={index}
//             className=" cursor-pointer hover:text-gray-400"
//           >
//             {text.title}
//           </Link>
//         ))}
//       </div>
//     </Box>
//   );

//   return (
//     <div>
//       <Button onClick={toggleDrawer(true)}>
//         <HamburgerMenu />
//       </Button>
//       <Drawer open={open} onClose={toggleDrawer(false)}>
//         {DrawerList}
//       </Drawer>
//     </div>
//   );
// }
