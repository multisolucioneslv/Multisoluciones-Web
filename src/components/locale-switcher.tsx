'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { routing, usePathname, useRouter } from '@/i18n/routing';
import { FlagIcon } from '@/components/flag-icon';

const localeNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  ko: '한국어',
  pt: 'Português'
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Navigation');
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function selectLocale(nextLocale: string) {
    setIsOpen(false);
    if (nextLocale === locale) {
      return;
    }
    router.replace({ pathname }, { locale: nextLocale });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t('localeSwitcher')}
        title={t('localeSwitcher')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
      >
        <FlagIcon locale={locale} className="h-4 w-6" />
        <span>{locale.toUpperCase()}</span>
      </button>

      {isOpen ? (
        <ul
          role="menu"
          aria-label={t('localeSwitcher')}
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          {routing.locales.map((option) => {
            const isActive = option === locale;
            return (
              <li key={option} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => selectLocale(option)}
                  aria-current={isActive ? 'true' : undefined}
                  className={isActive
                    ? 'flex w-full items-center gap-3 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200'
                    : 'flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'}
                >
                  <FlagIcon locale={option} />
                  <span>{localeNames[option]}</span>
                  {isActive ? <span aria-hidden="true">✓</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
