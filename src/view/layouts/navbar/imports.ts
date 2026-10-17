"use client";

import useNavbarItems, { isNavActive } from "./navbarItem";
import Link from "next/link";
import Image from "next/image";
import LogoMD from "@/public/Logo1.png";
import Logo from "@/public/Logo.png";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "@/src/components/locale/LocaleSwitcher";
import ThemeSwitcher from "@/src/components/theme/ThemeSwitcher";
import { useTranslations } from "next-intl";

export {
  useNavbarItems,
  isNavActive,
  Link,
  Image,
  LogoMD,
  Logo,
  usePathname,
  LocaleSwitcher,
  ThemeSwitcher,
  useTranslations,
};
