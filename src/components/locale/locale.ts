'use server';

import { cookies } from 'next/headers';
import { Locale, defaultLocale } from '@/src/i18n/config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  const userCookies = await cookies(); // Await cookies to resolve the Promise
  return userCookies.get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const userCookies = await cookies(); // Await cookies to resolve the Promise
  userCookies.set(COOKIE_NAME, locale); // Ensure that `set` is available
}
