import { getTranslations } from 'next-intl/server';

const services = [
  { key: 'web', titleKey: 'services_web', textKey: 'services_web_desc' },
  { key: 'dev', titleKey: 'services_dev', textKey: 'services_dev_desc' },
  { key: 'app', titleKey: 'services_app', textKey: 'services_app_desc' },
  { key: 'special', titleKey: 'services_special', textKey: 'services_special_desc' }
] as const;

const projects = [
  { key: 'appfood', imageKey: 'project_appfood_image', nameKey: 'project_appfood_name', textKey: 'project_appfood_desc' },
  { key: 'courses', imageKey: 'project_courses_image', nameKey: 'project_courses_name', textKey: 'project_courses_desc' },
  { key: 'torestaurantes', imageKey: 'project_torestaurantes_image', nameKey: 'project_torestaurantes_name', textKey: 'project_torestaurantes_desc' }
] as const;

export default async function IndexPage() {
  const t = await getTranslations('Index');

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">{t('title')}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{t('hero_title')}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{t('hero_subtitle')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:text-blue-400"
          >
            {t('hero_cta')}
          </a>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-950 dark:text-white">{t('services_title')}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.key}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">{t(service.titleKey)}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{t(service.textKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">{t('projects_title')}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t('projects_subtitle')}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.key}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div
                role="img"
                aria-label={t(project.imageKey)}
                className="flex h-40 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400 dark:bg-slate-900/60 dark:text-slate-500"
              >
                {t(project.nameKey)}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{t(project.nameKey)}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{t(project.textKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm dark:ring-1 dark:ring-slate-700 lg:p-12">
        <h2 className="text-3xl font-bold md:text-4xl">{t('contact_title')}</h2>
        <form className="mt-8 grid gap-5" action="#" method="post">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              {t('contact_name')}
              <input
                type="text"
                name="name"
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-normal text-white outline-none transition focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              {t('contact_email')}
              <input
                type="email"
                name="email"
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-normal text-white outline-none transition focus:border-blue-400"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
            {t('contact_service')}
            <input
              type="text"
              name="service"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-normal text-white outline-none transition focus:border-blue-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
            {t('contact_message')}
            <textarea
              name="message"
              rows={5}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-normal text-white outline-none transition focus:border-blue-400"
            />
          </label>
          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {t('contact_submit')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}