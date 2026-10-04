import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { PhoneCallIcon, WhatsappLogoIcon, SquaresFourIcon, ArrowRightIcon, ChatsCircleIcon, BlueprintIcon, CodeIcon } from '@phosphor-icons/react/ssr';
import { Link } from '@/i18n/routing';
import { ContactForm } from '@/components/contact-form';
import { IndustryShowcase } from '@/components/industry-showcase';
import { ServiceCards } from '@/components/service-cards';
import { getVisualCopy } from '@/components/visual-copy';

export default async function IndexPage() {
  const t = await getTranslations('HomePage');
  const copy = getVisualCopy(await getLocale());

  return (
    <div className="space-y-28 sm:space-y-36">
      <section className="relative overflow-hidden rounded-[2rem] bg-hero px-7 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative grid gap-12 lg:grid-cols-[1.45fr_0.55fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-strong">{t('eyebrow')}</p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
              {t('title')}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">{t('intro')}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-[#10232a]" href="tel:+17023379581">
                <PhoneCallIcon size={20} aria-hidden="true" className="mr-2" />{t('callAction')}
              </a>
              <Link className="inline-flex items-center justify-center rounded-full border border-brand/50 bg-background/60 px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-brand hover:bg-background" href="/services">
                <SquaresFourIcon size={20} aria-hidden="true" className="mr-2" />{t('servicesAction')}
              </Link>
            </div>
          </div>
          <p className="max-w-xs border-l border-brand/40 pl-5 text-base leading-7 text-muted lg:justify-self-end">{t('heroNote')}</p>
        </div>
      </section>

      <section aria-labelledby="services-heading">
        <div className="grid gap-5 border-b border-border pb-9 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong">{t('servicesEyebrow')}</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl" id="services-heading">{t('servicesTitle')}</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted md:justify-self-end">{t('servicesIntro')}</p>
        </div>
        <ServiceCards items={[
          { title: t('serviceWeb'), text: t('serviceWebText') },
          { title: t('serviceCommerce'), text: t('serviceCommerceText') },
          { title: t('serviceSystems'), text: t('serviceSystemsText') }
        ]} />
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-strong hover:underline" href="/services">
          <SquaresFourIcon size={20} aria-hidden="true" />{t('serviceMore')} <ArrowRightIcon size={18} aria-hidden="true" />
        </Link>
      </section>

      <IndustryShowcase />

      <section className="grid gap-10 rounded-[2rem] border border-border bg-surface px-7 py-10 sm:px-11 sm:py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong">{t('approachEyebrow')}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t('approachTitle')}</h2>
        </div>
        <div>
          <p className="max-w-2xl text-lg leading-8 text-muted">{t('approachText')}</p>
          <ol className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            {[t('approachStepOne'), t('approachStepTwo'), t('approachStepThree')].map((step, index) => (
              <li className="text-sm leading-6" key={step}>
                {(() => { const Icon = [ChatsCircleIcon, BlueprintIcon, CodeIcon][index]; return <Icon aria-hidden="true" size={36} weight="duotone" className="mb-4 text-brand-strong" />; })()}
                <h3 className="font-semibold">{step}</h3>
                <p className="mt-2 text-muted">{copy.steps[index]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="projects-heading">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong">{t('projectsEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" id="projects-heading">{t('projectsTitle')}</h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-muted">{t('projectsIntro')}</p>
        </div>
        <div className="grid gap-5 pt-7 lg:grid-cols-2">
          <Link className="group rounded-3xl border border-border bg-background p-7 transition hover:border-brand/60 hover:bg-surface sm:p-9" href="/projects#rescuvo">
            <Image src="/project-previews/rescuvo.webp" alt={copy.projectAlt[0]} width={1265} height={712} className="mb-6 aspect-video w-full rounded-2xl object-cover object-top" sizes="(min-width: 1024px) 550px, 100vw" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-strong">01 · Rescuvo</p>
            <h3 className="mt-8 text-2xl font-semibold tracking-tight">{t('rescuvoName')}</h3>
            <p className="mt-3 max-w-lg leading-7 text-muted">{t('rescuvoText')}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-strong">{t('projectsMore')} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
          </Link>
          <Link className="group rounded-3xl border border-border bg-background p-7 transition hover:border-brand/60 hover:bg-surface sm:p-9" href="/projects#aprendiendo-a-programar">
            <Image src="/project-previews/course.webp" alt={copy.projectAlt[1]} width={1280} height={720} className="mb-3 aspect-video w-full rounded-2xl object-cover object-top" sizes="(min-width: 1024px) 550px, 100vw" />
            <p className="mb-6 text-xs text-muted">{copy.courseCaption}</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-strong">02 · Education</p>
            <h3 className="mt-8 text-2xl font-semibold tracking-tight">{t('courseName')}</h3>
            <p className="mt-3 max-w-lg leading-7 text-muted">{t('courseText')}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-strong">{t('projectsMore')} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
          </Link>
        </div>
      </section>

      <section className="grid gap-10 rounded-[2rem] bg-foreground px-7 py-10 text-background sm:px-11 sm:py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-14" id="contacto">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">{t('contactEyebrow')}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t('contactTitle')}</h2>
          <p className="mt-4 max-w-md leading-7 text-background/75">{t('contactText')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="inline-flex items-center gap-2 rounded-full border border-background/35 px-5 py-3 text-sm font-semibold transition hover:bg-background/10" href="tel:+17023379581"><PhoneCallIcon size={20} aria-hidden="true" />{t('callAction')}</a>
            <a className="inline-flex items-center gap-2 rounded-full border border-background/35 px-5 py-3 text-sm font-semibold transition hover:bg-background/10" href="https://wa.me/17023379581?text=Hola%2C%20me%20interesa%20crear%20o%20mejorar%20mi%20sitio%20web.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n." rel="noreferrer" target="_blank"><WhatsappLogoIcon size={20} aria-hidden="true" />{t('whatsappAction')}</a>
          </div>
        </div>
        <div className="rounded-3xl bg-background p-6 text-foreground sm:p-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
