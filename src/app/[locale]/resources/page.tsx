import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { RocketLaunchIcon, ArrowRightIcon, PresentationIcon } from '@phosphor-icons/react/ssr';

export default async function ResourcesPage() {
  const t = await getTranslations('Resources');
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-hero p-8 ring-1 ring-border lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-strong">{t('eyebrow')}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">{t('title')}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{t('intro')}</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <Link href="/resources/quelea" className="group rounded-3xl border border-border bg-surface p-8 text-foreground transition hover:border-brand">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-brand/15 px-3 py-1 text-sm font-semibold text-brand-strong">{t('available')}</span>
            <ArrowRightIcon size={24} aria-hidden="true" />
          </div>
          <PresentationIcon size={64} weight="duotone" aria-hidden="true" className="mt-8 text-brand-strong" />
          <h2 className="mt-6 text-3xl font-semibold">{t('queleaTitle')}</h2>
          <p className="mt-3 leading-7 text-muted">{t('queleaText')}</p>
          <span className="mt-8 inline-flex font-semibold text-brand-strong">{t('openResource')}</span>
        </Link>
        <article className="flex flex-col justify-center overflow-hidden rounded-3xl border border-dashed border-brand/40 bg-hero p-8 sm:p-10">
          <div className="flex items-center gap-5 border-b border-brand/20 pb-7">
            <RocketLaunchIcon size={64} weight="duotone" aria-hidden="true" className="shrink-0 text-brand-strong" />
            <p lang="en" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Coming soon</p>
          </div>
          <h2 className="mt-7 text-2xl font-semibold text-foreground">{t('moreTitle')}</h2>
          <p className="mt-3 leading-7 text-muted">{t('moreText')}</p>
        </article>
      </section>
    </div>
  );
}
