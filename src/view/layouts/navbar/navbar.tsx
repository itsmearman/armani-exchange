"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Login } from "iconsax-react";
import Logo from "@/public/Logo.png";
import LogoMD from "@/public/Logo1.png";
import ThemeSwitcher from "@/src/components/theme/ThemeSwitcher";
import LocaleSwitcher from "@/src/components/locale/LocaleSwitcher";
import { useAuth } from "@/src/contexts/AuthContext";
import useNavbarItems, { isNavActive } from "./navbarItem";

function UserAvatar({
  name,
  avatarUrl,
  size = 32,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl.split("?")[0]}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold uppercase text-blue-600 dark:bg-green-500/15 dark:text-green-400"
      style={{ width: size, height: size, fontSize: Math.max(11, size / 2.6) }}
    >
      {name.trim().charAt(0) || "U"}
    </span>
  );
}

export default function Navbar() {
  const items = useNavbarItems();
  const pathname = usePathname();
  const t = useTranslations();
  const { user, loading } = useAuth();

  return (
    <>
      {/* Desktop / tablet top bar */}
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-gray-200/70 bg-white/80 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/80 md:block">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
          <Link href="/" className="shrink-0 transition hover:opacity-90">
            <Image
              src={Logo}
              width={78}
              height={44}
              alt="Armani Exchange"
              priority
            />
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-gray-200/80 bg-gray-50/80 p-1 dark:border-gray-800 dark:bg-gray-900/70">
            {items.map((item) => {
              const active = isNavActive(pathname, item.route);
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-green-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeSwitcher />

            {!loading && user ? (
              <Link
                href="/profile"
                className="ms-1 flex min-w-0 items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pe-3 ps-1 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <UserAvatar
                  name={user.username}
                  avatarUrl={user.avatarUrl}
                  size={32}
                />
                <div className="min-w-0 py-0.5">
                  <p className="max-w-[110px] truncate text-sm font-semibold leading-tight">
                    {user.username}
                  </p>
                  <p className="text-[10px] leading-tight text-gray-400">
                    {t("profile")}
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="ms-1 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-green-500 dark:text-gray-950 dark:hover:bg-green-400"
              >
                <Login size={16} />
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85 md:hidden">
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 px-3">
          <div className="flex items-center justify-start gap-1">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>

          <Link
            href="/"
            className="flex items-center justify-center justify-self-center"
          >
            <Image
              src={LogoMD}
              width={92}
              height={34}
              alt="Armani Exchange"
              className="h-[34px] w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center justify-end">
            {!loading && user ? (
              <Link
                href="/profile"
                title={user.username}
                className="inline-flex items-center justify-center"
              >
                <UserAvatar
                  name={user.username}
                  avatarUrl={user.avatarUrl}
                  size={34}
                />
              </Link>
            ) : (
              <Link 
                href="/login"
                className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white dark:bg-green-500 dark:text-gray-950"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/80 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90 md:hidden">
        <ul className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-4 items-center">
          {items.map((item) => {
            const active = isNavActive(pathname, item.route);
            const Icon = item.Icon;
            return (
              <li key={item.route} className="flex justify-center">
                <Link
                  href={item.route}
                  className={`flex min-w-[4.5rem] flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition ${
                    active
                      ? "text-blue-600 dark:text-green-400"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-blue-50 dark:bg-green-500/15"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon
                      size={22}
                      variant={active ? "Bulk" : "Linear"}
                      className={
                        active
                          ? "fill-blue-600 dark:fill-green-400"
                          : "stroke-current"
                      }
                    />
                  </span>
                  <span className="text-[11px] font-medium leading-none">
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
