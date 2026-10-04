import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getVisualCopy } from '@/components/visual-copy';
import { Link } from '@/i18n/routing';

export default async function ProjectsPage() {
  const t = await getTranslations('Projects');
  const copy = getVisualCopy(await getLocale());

  return (
    <div className="space-y-16 sm:space-y-24">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong">{t('eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">{t('title')}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{t('intro')}</p>
      </header>

      <div className="space-y-8">
        <article className="grid gap-8 rounded-[2rem] border border-border bg-background p-7 sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:p-12" id="rescuvo">
          <div className="flex flex-col items-start">
            <span className="rounded-full bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-strong">{t('rescuvoLabel')}</span>
            <h2 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">{t('rescuvoTitle')}</h2>
            <span className="mt-5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted">{t('rescuvoStatus')}</span>
            <a className="mt-8 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong dark:text-[#10232a]" href="https://rescuvo.com" rel="noreferrer" target="_blank">{t('rescuvoAction')} <span aria-hidden="true" className="ml-2">↗</span></a>
          </div>
          <div className="max-w-2xl">
            <Image src="/project-previews/rescuvo.webp" alt={copy.projectAlt[0]} width={1265} height={712} className="mb-7 w-full rounded-2xl" sizes="(min-width: 1024px) 650px, 100vw" />
            <p className="text-lg leading-8 text-muted">{t('rescuvoText')}</p>
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-strong">{t('rescuvoWork')}</p>
            </div>
          </div>
        </article>

        <article className="grid gap-8 rounded-[2rem] bg-surface p-7 sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:p-12" id="aprendiendo-a-programar">
          <div className="flex flex-col items-start">
            <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-strong">{t('courseLabel')}</span>
            <h2 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">{t('courseTitle')}</h2>
            <span className="mt-5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted">{t('courseStatus')}</span>
          </div>
          <div className="max-w-2xl">
            <figure className="mb-7">
              <Image src="/project-previews/course.webp" alt={copy.projectAlt[1]} width={1280} height={720} className="w-full rounded-2xl" sizes="(min-width: 1024px) 650px, 100vw" />
              <figcaption className="mt-3 text-xs text-muted">{copy.courseCaption}</figcaption>
            </figure>
            <p className="text-lg leading-8 text-muted">{t('courseText')}</p>
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-strong">{t('courseWork')}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{t('courseNote')}</p>
            </div>
          </div>
        </article>
      </div>

      <section className="flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{t('contactTitle')}</h2>
        <Link className="inline-flex w-fit shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong dark:text-[#10232a]" href="/#contacto">{t('contactAction')} <span aria-hidden="true" className="ml-2">↗</span></Link>
      </section>
    </div>
  );
}
