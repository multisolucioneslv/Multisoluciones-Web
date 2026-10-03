import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SiteHeader } from '@/components/site-header';
import '../globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: { default: t('title'), template: `%s | ${t('title').split(' | ')[0]}` },
    description: t('description'),
    applicationName: 'Multisoluciones Web'
  };
}

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
      <body className="min-h-screen antialiased transition-colors">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-10">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
