import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

function isValidLocale(locale: string): locale is (typeof routing.locales)[number] {
  return routing.locales.some((supportedLocale) => supportedLocale === locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // Ensure that a valid locale is used
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
