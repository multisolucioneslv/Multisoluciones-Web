'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContactPreference, type ContactPreferenceState } from '@/app/[locale]/actions';

const initialState: ContactPreferenceState = { status: 'idle' };

export function ContactPreferenceForm({ token, initialChannel }: { token: string; initialChannel: string }) {
  const t = useTranslations('ContactPreference');
  const [state, formAction, pending] = useActionState(submitContactPreference, initialState);
  const [channel, setChannel] = useState(initialChannel);
  const fieldClass = 'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20';

  return (
    <form action={formAction} className="grid gap-5">
      <input name="token" type="hidden" value={token} />
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-foreground">{t('choose')}</legend>
        {(['email', 'call', 'whatsapp', 'none'] as const).map((option) => (
          <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm text-foreground" key={option}>
            <input
              checked={channel === option}
              className="mt-1 accent-brand"
              name="channel"
              onChange={() => setChannel(option)}
              type="radio"
              value={option}
            />
            <span>{t(option)}</span>
          </label>
        ))}
      </fieldset>
      {channel === 'call' || channel === 'whatsapp' ? (
        <label className="text-sm font-semibold text-foreground">
          {t('phone')}
          <input
            autoComplete="tel"
            className={fieldClass}
            maxLength={24}
            name="phone"
            placeholder={t('phonePlaceholder')}
            required
            type="tel"
          />
        </label>
      ) : null}
      <div aria-live="polite" className="min-h-6 text-sm font-medium" role="status">
        {state.status === 'success' ? <p className="text-brand-strong">{t('success')}</p> : null}
        {state.status === 'failure' ? <p className="text-red-700 dark:text-red-300">{t('failure')}</p> : null}
        {state.status === 'notConfigured' ? <p className="text-amber-800 dark:text-amber-200">{t('notConfigured')}</p> : null}
        {state.status === 'invalid' ? <p className="text-red-700 dark:text-red-300">{t('invalid')}</p> : null}
      </div>
      <button
        className="inline-flex w-fit items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70 dark:text-[#10232a]"
        disabled={pending || state.status === 'success'}
        type="submit"
      >
        {pending ? t('saving') : t('submit')}
      </button>
    </form>
  );
}
