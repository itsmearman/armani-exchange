"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Logo from "@/public/Logo.png";
import LocaleSwitcher from "@/src/components/locale/LocaleSwitcher";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/spot", key: "trade" },
  { href: "/assets", key: "myAssets" },
  { href: "/profile", key: "profile" },
  { href: "/about-us", key: "aboutUs" },
] as const;

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 hidden border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white dark:border-gray-800 dark:from-gray-950 dark:to-gray-900 md:block">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <Link href="/" className="inline-block">
              <Image src={Logo} width={96} height={52} alt="Armani Exchange" />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {t("footerTagline")}
            </p>
            <a
              href="https://www.linkedin.com/in/arman-tabibzade-tehrani/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:text-green-400 dark:hover:border-green-500/40 dark:hover:bg-green-500/10"
            >
              LinkedIn
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("quickLinks")}
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-green-400"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("label")}
            </h3>
            <LocaleSwitcher />
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              {t("footerSupport")}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            © {year} Armani Exchange. {t("allRightsReserved")}
          </p>
          <p className="text-xs text-gray-400">{t("createdarman")}</p>
        </div>
      </div>
    </footer>
  );
}
