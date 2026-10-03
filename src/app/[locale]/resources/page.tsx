import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function ResourcesPage() {
  const t = await getTranslations('Resources');

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">{t('eyebrow')}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{t('title')}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{t('intro')}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/resources/quelea"
          className="group rounded-3xl bg-slate-950 p-8 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:ring-1 dark:ring-slate-700"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">{t('available')}</span>
            <span className="text-2xl" aria-hidden="true">↗</span>
          </div>
          <h2 className="mt-10 text-3xl font-bold">{t('queleaTitle')}</h2>
          <p className="mt-3 leading-7 text-slate-300">{t('queleaText')}</p>
          <span className="mt-8 inline-flex font-semibold text-blue-300 group-hover:text-white">{t('openResource')}</span>
        </Link>

        <Link
          href="/resources/drivers"
          className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">{t('comingSoon')}</span>
            <span className="text-2xl text-slate-400 transition group-hover:text-blue-600 dark:group-hover:text-blue-300" aria-hidden="true">↗</span>
          </div>
          <h2 className="mt-10 text-3xl font-bold text-slate-950 dark:text-white">{t('driversTitle')}</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{t('driversText')}</p>
          <span className="mt-8 inline-flex font-semibold text-blue-700 dark:text-blue-300">{t('openResource')}</span>
        </Link>
      </section>

      <section className="rounded-3xl border border-dashed border-slate-300 p-8 dark:border-slate-600">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t('moreTitle')}</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{t('moreText')}</p>
      </section>
    </div>
  );
}