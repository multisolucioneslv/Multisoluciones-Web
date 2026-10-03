import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

const serviceRows = [
  { number: '01', title: 'webTitle', text: 'webText' },
  { number: '02', title: 'commerceTitle', text: 'commerceText' },
  { number: '03', title: 'systemsTitle', text: 'systemsText' }
] as const;

export default async function ServicesPage() {
  const t = await getTranslations('Services');

  return (
    <div className="space-y-20 sm:space-y-28">
      <header className="grid gap-7 border-b border-border pb-10 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong">{t('eyebrow')}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">{t('title')}</h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-muted md:justify-self-end">{t('intro')}</p>
      </header>

      <div className="divide-y divide-border border-y border-border">
        {serviceRows.map((service) => (
          <article className="grid gap-3 py-8 md:grid-cols-[4rem_1fr_1fr] md:items-start md:gap-8 md:py-10" key={service.number}>
            <span className="pt-1 text-sm font-medium tabular-nums text-brand">{service.number}</span>
            <h2 className="text-2xl font-semibold tracking-tight">{t(service.title)}</h2>
            <p className="max-w-xl text-base leading-7 text-muted">{t(service.text)}</p>
          </article>
        ))}
      </div>

      <section className="flex flex-col gap-6 rounded-[2rem] bg-hero p-8 sm:flex-row sm:items-center sm:justify-between sm:p-11">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">{t('contactTitle')}</h2>
          <p className="mt-3 leading-7 text-muted">{t('contactText')}</p>
        </div>
        <Link className="inline-flex w-fit shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong dark:text-[#10232a]" href="/#contacto">{t('contactAction')} <span aria-hidden="true" className="ml-2">↗</span></Link>
      </section>
    </div>
  );
}
