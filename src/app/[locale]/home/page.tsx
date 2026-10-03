import { getTranslations } from 'next-intl/server';

export default async function HomeAliasPage() {
  const t = await getTranslations('Home');

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <h1 className="text-3xl font-bold text-slate-950 dark:text-white">{t('title')}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">{t('text')}</p>
    </div>
  );
}