'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeToggle } from '@/components/theme-toggle';
import { LocaleSwitcher } from '@/components/locale-switcher';

const navigationItems = [
  { href: '/', key: 'home' },
  { href: '/blog', key: 'blog' },
  { href: '/services', key: 'services' },
  { href: '/resources', key: 'resources' },
  { href: '/projects', key: 'projects' }
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function isActiveRoute(href: string) {
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur transition-colors dark:border-slate-700 dark:bg-slate-900/90">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          <Link href="/" onClick={closeMenu}>
            Jscothserver
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex space-x-6 text-sm font-medium text-slate-700 dark:text-slate-300">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  className={
                    isActiveRoute(item.href)
                      ? 'rounded-full bg-blue-50 px-3 py-2 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950/70 dark:text-blue-200 dark:ring-blue-800'
                      : 'rounded-full px-3 py-2 hover:text-blue-600 dark:hover:text-blue-300'
                  }
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={t('menuToggle')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMenuOpen ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-2 text-base font-medium text-slate-700 dark:text-slate-200">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  onClick={closeMenu}
                  className={
                    isActiveRoute(item.href)
                      ? 'block rounded-2xl bg-blue-50 px-4 py-3 font-semibold text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950/70 dark:text-blue-200 dark:ring-blue-800'
                      : 'block rounded-2xl px-4 py-3 transition hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-300'
                  }
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}