'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact, type ContactState } from '@/app/[locale]/actions';

const initialState: ContactState = { status: 'idle' };

export function ContactForm() {
  const t = useTranslations('ContactForm');
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  const fieldClass = 'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted/75 focus:border-brand focus:ring-2 focus:ring-brand/20';

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-foreground">
          {t('name')}
          <input className={fieldClass} autoComplete="name" maxLength={100} name="name" required />
        </label>
        <label className="text-sm font-semibold text-foreground">
          {t('email')}
          <input className={fieldClass} autoComplete="email" maxLength={254} name="email" required type="email" />
        </label>
      </div>
      <label className="text-sm font-semibold text-foreground">
        {t('service')}
        <select className={fieldClass} defaultValue="" name="service" required>
          <option disabled value="">{t('servicePlaceholder')}</option>
          <option value="website">{t('serviceWeb')}</option>
          <option value="commerce">{t('serviceCommerce')}</option>
          <option value="systems">{t('serviceSystems')}</option>
          <option value="other">{t('serviceOther')}</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-foreground">
        {t('message')}
        <textarea className={fieldClass} maxLength={3000} minLength={10} name="message" required rows={5} />
      </label>
      <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          {t('honeypot')}
          <input autoComplete="off" name="website" tabIndex={-1} />
        </label>
      </div>
      <p className="text-sm leading-6 text-muted">{t('privacy')}</p>
      <div aria-live="polite" className="min-h-6 text-sm font-medium" role="status">
        {state.status === 'success' ? <p className="text-brand-strong">{t('success')}</p> : null}
        {state.status === 'failure' ? <p className="text-red-700 dark:text-red-300">{t('failure')}</p> : null}
        {state.status === 'notConfigured' ? <p className="text-amber-800 dark:text-amber-200">{t('notConfigured')}</p> : null}
        {state.status === 'invalid' ? <p className="text-red-700 dark:text-red-300">{t('invalid')}</p> : null}
      </div>
      <button
        className="inline-flex w-fit items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70 dark:text-[#10232a]"
        disabled={pending}
        type="submit"
      >
        {pending ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
