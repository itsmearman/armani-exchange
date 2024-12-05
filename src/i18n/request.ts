import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies(); // Await to resolve the Promise
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = cookieLocale || 'fa'; // Default to 'fa'

  try {
    const messages = (await import(`../../messages/${locale}/${locale}.json`)).default;

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}"`, error);

    // Fallback to default locale and messages
    const fallbackMessages = (await import(`../../messages/fa/fa.json`)).default;

    return {
      locale: 'fa',
      messages: fallbackMessages,
    };
  }
});
