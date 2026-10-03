import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';

const officialLinks = {
  website: 'https://quelea.org/',
  resources: 'https://quelea.org/resources',
  windows: 'https://github.com/quelea-projection/Quelea/releases/download/v2024.0/quelea-2024.0.1-x64-windows-install.exe',
  mac: 'https://github.com/quelea-projection/Quelea/releases/download/v2024.0/quelea-2024.0-mac.zip',
  crossPlatform: 'https://github.com/quelea-projection/Quelea/releases/download/v2024.0/quelea-2024.0-crossplatform-install.jar',
  linux: 'https://snapcraft.io/quelea',
  docs: 'https://quelea-projection.github.io/docs/',
  bibleDocs: 'https://quelea-projection.github.io/docs/Bible_tab',
  songDocs: 'https://quelea-projection.github.io/docs/Adding_songs_to_your_database',
  orderDocs: 'https://quelea-projection.github.io/docs/Adding_items_to_Order_of_Service',
  manualEs: 'https://quelea.org/manuals/Quelea%20manual-es.pdf',
  manualEn: 'https://quelea.org/manuals/Quelea%20manual-en.pdf',
  zefania: 'https://sourceforge.net/projects/zefania-sharp/files/Bibles/',
  worshipLeader: 'https://worshipleaderapp.com/en/download-song-database-opensong-openlp-and-quelea',
  spanishBibles: 'https://quelea.discourse.group/t/biblias-para-el-quelea-reina-valera-1960-nueva-version-y-biblia-de-las-americas/785',
  queleaPtBr: 'https://github.com/irnjunior/quelea-portugues-brasil',
  forum: 'https://quelea.discourse.group/'
};

const sf = 'https://sourceforge.net/projects/zefania-sharp/files/Bibles';
const biblePackage = 'https://drive.usercontent.google.com/download?id=1Gp6afKSoaHFaDUPrJ1hvVl9lidhKqvA1&export=download';

const bibleLanguages = [
  {
    code: 'es',
    catalogue: `${sf}/SPA/`,
    catalogueCount: 4,
    versions: [
      {
        name: 'Reina-Valera 1960',
        formatKey: 'package',
        size: '9.5 MB',
        href: biblePackage
      },
      {
        name: 'Reina-Valera',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/SPA/Spanish%20Reina-Valera/SF_2009-01-22_SPA_BIBLE_SPARV_%28SPANISH%20REINA-VALERA%29.zip/download`
      },
      {
        name: 'Reina-Valera 1989',
        formatKey: 'zefania',
        size: '1.4 MB',
        href: `${sf}/SPA/Reina%20Valera%201989/SF_2009-01-20_SPA_RVA_%28REINA%20VALERA%201989%29.zip/download`
      },
      {
        name: 'Biblia de las Américas',
        formatKey: 'zefania',
        size: '1.4 MB',
        href: `${sf}/SPA/Las%20Sagradas%20Escrituras/SF_2009-01-20_SPA_SEV_%28LAS%20SAGRADAS%20ESCRITURAS%29.zip/download`
      },
      {
        name: 'Biblia Platense (Straubinger)',
        formatKey: 'zefania',
        size: '1.6 MB',
        href: `${sf}/SPA/Biblia%20Platense%20%28Straubinger%29/SF_2021-11-29_SPA_SPAPLATENSE_%28Biblia%20Platense%20%28Straubinger%29%29.zip/download`
      },
      {
        name: 'RV1960',
        nameKey: 'sevenPack',
        formatKey: 'packageSeven',
        size: '9.5 MB',
        href: biblePackage
      }
    ]
  },
  {
    code: 'en',
    catalogue: `${sf}/ENG/`,
    catalogueCount: 50,
    versions: [
      {
        name: 'King James Version',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/ENG/King%20James/King%20James%20Version/SF_2009-01-23_ENG_KJV_%28KING%20JAMES%20VERSION%29.zip/download`
      },
      {
        name: 'World English Bible',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/ENG/World%20English%20Bible/SF_2009-01-20_ENG_WEB_%28WORLD%20ENGLISH%20BIBLE%29.zip/download`
      },
      {
        name: 'American Standard Version',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/ENG/American%20Standard%20Version/SF_2009-01-20_ENG_ASV_%28AMERICAN%20STANDARD%20VERSION%29.zip/download`
      },
      {
        name: 'New Heart English Bible',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/ENG/New%20Heart%20English%20Bible/SF_2015-08-15_ENG_NHEB_%28NEW%20HEART%20ENGLISH%20BIBLE%29.zip/download`
      }
    ]
  },
  {
    code: 'ko',
    catalogue: `${sf}/KOR/`,
    catalogueCount: 2,
    versions: [
      {
        name: 'Korean Revised Version 1952-1961',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/KOR/Korean%20Revised%20Version%201952-1961/SF_2022-09-19_KOR_KORRV_%28Korean%20Revised%20Version%201952%201961%29.zip/download`
      },
      {
        name: 'Korean Version',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/KOR/Korean%20Version/SF_2009-01-20_KOR_KOR_%28KOREAN%20VERSION%29.zip/download`
      }
    ]
  },
  {
    code: 'pt',
    catalogue: `${sf}/POR/`,
    catalogueCount: 2,
    versions: [
      {
        name: 'Almeida Corrigida Fiel',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/POR/Portuguese%20Corrigida%20Fiel%20%281753/1995%29/SF_2009-01-20_POR_ACF_%28PORTUGUESE%20CORRIGIDA%20FIEL%20%281753_1995%29%29.zip/download`
      },
      {
        name: 'Portuguese Version',
        formatKey: 'zefania',
        size: '1.3 MB',
        href: `${sf}/POR/Portuguese%20Version/SF_2009-01-20_POR_PORT_%28PORTUGUESE%20VERSION%29.zip/download`
      }
    ]
  }
];

const songLanguages = [
  {
    code: 'es',
    resources: [
      {
        nameKey: 'es',
        archive: false,
        size: '2.8 MB',
        counts: { songs: 2570 },
        href: 'https://worshipleaderapp.com/download/quelea/es.qsp'
      }
    ]
  },
  {
    code: 'en',
    resources: [
      {
        nameKey: 'en',
        archive: false,
        size: '4.5 MB',
        counts: { songs: 3000 },
        href: 'https://worshipleaderapp.com/download/quelea/en.qsp'
      }
    ]
  },
  {
    code: 'ko',
    resources: [
      {
        nameKey: 'ko',
        archive: false,
        size: '381 KB',
        counts: { songs: 13 },
        href: 'https://worshipleaderapp.com/download/quelea/ko.qsp'
      }
    ]
  },
  {
    code: 'pt',
    resources: [
      {
        nameKey: 'pt',
        archive: false,
        size: '525 KB',
        counts: { songs: 102 },
        href: 'https://worshipleaderapp.com/download/quelea/pt.qsp'
      },
      {
        nameKey: 'ptBr',
        archive: true,
        size: '8.9 MB',
        counts: { hymnals: 5, bibles: 3 },
        href: 'https://github.com/irnjunior/quelea-portugues-brasil/archive/master.zip'
      }
    ]
  }
];

const fullCollection = {
  songs: 72098,
  size: '115 MB',
  href: 'https://worshipleaderapp.com/download/quelea/all.qsp'
};

const sourceLinks = [
  { key: 'resources', href: officialLinks.resources },
  { key: 'docs', href: officialLinks.docs },
  { key: 'bibleTab', href: officialLinks.bibleDocs },
  { key: 'importSongs', href: officialLinks.songDocs },
  { key: 'orderOfService', href: officialLinks.orderDocs },
  { key: 'zefania', href: officialLinks.zefania },
  { key: 'worshipLeader', href: officialLinks.worshipLeader },
  { key: 'spanishBibles', href: officialLinks.spanishBibles },
  { key: 'portugueseMaterials', href: officialLinks.queleaPtBr },
  { key: 'forum', href: officialLinks.forum }
];

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:text-blue-400"
    >
      {children}
    </a>
  );
}

export default async function QueleaPage() {
  const locale = await getLocale();
  const t = await getTranslations('ResourcesQuelea');
  const tCommon = await getTranslations('Common');
  const steps = t.raw('steps') as string[];
  const manualHref = locale === 'es' ? officialLinks.manualEs : officialLinks.manualEn;
  const hasOfficialManuals = locale === 'es' || locale === 'en';

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">{t('eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{t('title')}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">{t('intro')}</p>
          <div className="mt-6 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">{t('officialBadge')}</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-100 p-8 text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:text-white dark:ring-slate-700">
          <h2 className="text-3xl font-bold">{t('downloadTitle')}</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{t('downloadText')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ExternalLink href={officialLinks.windows}>{t('windows')}</ExternalLink>
            <ExternalLink href={officialLinks.mac}>{t('mac')}</ExternalLink>
            <ExternalLink href={officialLinks.linux}>{t('linux')}</ExternalLink>
            <ExternalLink href={officialLinks.crossPlatform}>{t('crossPlatform')}</ExternalLink>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t('manuals')}</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t('manualText')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {hasOfficialManuals ? <ExternalLink href={manualHref}>{t('manuals')}</ExternalLink> : null}
            <ExternalLink href={officialLinks.website}>{t('officialSite')}</ExternalLink>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">{t('biblesTitle')}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t('biblesText')}</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {bibleLanguages.map((language) => (
            <article key={language.code} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{t(`languages.${language.code}`)}</h3>
                <a
                  href={language.catalogue}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900"
                >
                  {t('officialCatalogue')}
                </a>
              </div>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t('catalogueCount', { count: language.catalogueCount })}</p>

              <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
                {language.versions.map((version) => (
                  <li key={`${version.name}-${version.href}`} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {version.nameKey ? t(`bibleNames.${version.nameKey}`) : version.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {t(`bibleFormats.${version.formatKey}`)} · {version.size}
                      </p>
                    </div>
                    <a
                      href={version.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:text-blue-400"
                    >
                      {tCommon('download')}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">{t('songsTitle')}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t('songsText')}</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {songLanguages.map((language) => (
            <article key={language.code} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700 dark:bg-slate-900/40">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">{t(`languages.${language.code}`)}</h3>

              <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
                {language.resources.map((resource) => {
                  const details =
                    resource.counts.songs !== undefined
                      ? t('songsCount', { count: resource.counts.songs })
                      : t('ptBrContents', {
                          hymnals: resource.counts.hymnals ?? 0,
                          bibles: resource.counts.bibles ?? 0
                        });

                  return (
                    <li key={resource.nameKey} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{t(`songNames.${resource.nameKey}`)}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {resource.archive ? t('archiveFormat') : t('songFormat')} · {details} · {resource.size}
                        </p>
                      </div>
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:text-blue-400"
                      >
                        {tCommon('download')}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <a
                href={officialLinks.songDocs}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300"
              >
                {t('importGuide')}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">{t('fullCollectionTitle')}</h3>
          <ul className="mt-4 divide-y divide-blue-200 dark:divide-blue-900">
            <li className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{t('fullCollectionName')}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {t('songFormat')} · {t('fullCollectionSongs', { count: fullCollection.songs })} · {fullCollection.size}
                </p>
              </div>
              <a
                href={fullCollection.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:text-blue-400"
              >
                {tCommon('download')}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('fullCollectionText')}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-sm dark:bg-blue-700">
          <h2 className="text-3xl font-bold">{t('helpTitle')}</h2>
          <p className="mt-4 leading-7 text-blue-50">{t('helpText')}</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">{t('stepsTitle')}</h2>
          <ol className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4 text-slate-700 dark:text-slate-300">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{index + 1}</span>
                <span className="leading-7">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t('sourceTitle')}</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {sourceLinks.map((source) => (
            <ExternalLink key={source.key} href={source.href}>{t(`sources.${source.key}`)}</ExternalLink>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('note')}</p>
      </section>
    </div>
  );
}