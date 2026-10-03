import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function ResourcesDriversPage() {
  const t = await getTranslations('ResourcesDrivers');

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">{t('eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{t('title')}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{t('text')}</p>
      </section>

      <Link
        href="/resources"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
      >
        {t('back')}
      </Link>
    </div>
  );
}