import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SiteHeader } from '@/components/site-header';
import '../globals.css';

function isValidLocale(locale: string): locale is (typeof routing.locales)[number] {
  return routing.locales.some((supportedLocale) => supportedLocale === locale);
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased transition-colors dark:bg-slate-900 dark:text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}