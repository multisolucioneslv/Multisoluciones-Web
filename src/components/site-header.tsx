'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeToggle } from '@/components/theme-toggle';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { BrandLogo } from '@/components/brand-logo';

const navigationItems = [
  { href: '/', key: 'home' },
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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl transition-colors">
      <nav className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="text-sm font-bold tracking-tight text-foreground sm:text-xl">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 sm:gap-3">
            <BrandLogo />
            <span className="leading-tight"><span>Multisoluciones</span><span className="block text-brand sm:ml-1 sm:inline">Web</span></span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <ul className="flex space-x-2 text-sm font-medium text-muted">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  className={
                    isActiveRoute(item.href)
                      ? 'rounded-full bg-surface px-3 py-2 text-brand-strong ring-1 ring-border'
                      : 'rounded-full px-3 py-2 transition-colors hover:text-brand-strong'
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

        <div className="flex items-center gap-3 lg:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={t('menuToggle')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-brand hover:text-brand-strong"
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
          className="border-t border-border bg-background px-5 py-4 lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-2 text-base font-medium text-muted">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  onClick={closeMenu}
                  className={
                    isActiveRoute(item.href)
                      ? 'block rounded-2xl bg-surface px-4 py-3 font-semibold text-brand-strong ring-1 ring-border'
                      : 'block rounded-2xl px-4 py-3 transition hover:bg-surface hover:text-brand-strong'
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
