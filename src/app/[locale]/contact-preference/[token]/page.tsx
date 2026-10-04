import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ContactPreferenceForm } from '@/components/contact-preference-form';

type ContactPreferencePageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ channel?: string }>;
};

export default async function ContactPreferencePage({ params, searchParams }: ContactPreferencePageProps) {
  const { token } = await params;
  const { channel } = await searchParams;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    notFound();
  }

  const t = await getTranslations('ContactPreference');

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-3xl px-5 py-20 sm:px-8">
      <section className="rounded-3xl border border-border bg-surface p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong">Multisoluciones Web</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">{t('description')}</p>
        <div className="mt-8">
          <ContactPreferenceForm
            initialChannel={['email', 'call', 'whatsapp', 'none'].includes(channel ?? '') ? channel! : 'email'}
            token={token}
          />
        </div>
      </section>
    </main>
  );
}
