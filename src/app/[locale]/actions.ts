'use server';

import { randomUUID } from 'node:crypto';

export type ContactState = {
  status: 'idle' | 'success' | 'mockSuccess' | 'failure' | 'notConfigured' | 'invalid';
};

function resolveContactWebhook(value: string | undefined): URL | null {
  if (!value) return null;

  try {
    const endpoint = new URL(value);
    if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'workflow.sistemasass.online') return null;

    const testMode = process.env.NODE_ENV === 'development' && process.env.CONTACT_MODE === 'n8n-test';
    const liveMode = process.env.NODE_ENV === 'production' && process.env.CONTACT_MODE === 'n8n-live';
    const correctPath = testMode
      ? endpoint.pathname.startsWith('/webhook-test/')
      : liveMode && endpoint.pathname.startsWith('/webhook/') && !endpoint.pathname.startsWith('/webhook-test/');

    return correctPath ? endpoint : null;
  } catch {
    return null;
  }
}

export async function submitContact(
  _previousState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot.trim()) {
    return { status: 'success' };
  }

  const name = formData.get('name');
  const email = formData.get('email');
  const service = formData.get('service');
  const message = formData.get('message');
  const locale = formData.get('locale');

  if (
    typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
    typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof service !== 'string' || !['website', 'commerce', 'systems', 'other'].includes(service) ||
    typeof message !== 'string' || message.trim().length < 10 || message.length > 3000 ||
    typeof locale !== 'string' || !['en', 'es', 'ko', 'pt'].includes(locale)
  ) {
    return { status: 'invalid' };
  }

  // Mock success is only allowed in local development. Production must opt in
  // explicitly to the published webhook, so a missing env var never fakes a send.
  const contactMode = process.env.CONTACT_MODE ??
    (process.env.NODE_ENV === 'development' ? 'mock' : 'disabled');

  if (
    (contactMode === 'n8n-test' && process.env.NODE_ENV !== 'development') ||
    (contactMode === 'n8n-live' && process.env.NODE_ENV !== 'production')
  ) {
    return { status: 'notConfigured' };
  }

  if (contactMode === 'n8n-test' || contactMode === 'n8n-live') {
    const endpoint = resolveContactWebhook(process.env.CONTACT_WEBHOOK_URL);
    if (!endpoint) return { status: 'failure' };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service,
          message: message.trim(),
          preferenceToken: randomUUID(),
          locale,
          isTest: contactMode === 'n8n-test'
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000)
      });

      if (!response.ok) {
        return { status: 'failure' };
      }

      const result: unknown = await response.json().catch(() => null);
      if (
        typeof result !== 'object' || result === null ||
        !('status' in result) || result.status !== 'received'
      ) {
        return { status: 'failure' };
      }

      return { status: 'success' };
    } catch {
      // Do not log form data or upstream error details, which may include PII.
      return { status: 'failure' };
    }
  }

  if (contactMode !== 'mock') {
    return { status: 'notConfigured' };
  }

  if (process.env.CONTACT_MOCK_RESULT === 'failure') {
    return { status: 'failure' };
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  return { status: 'mockSuccess' };
}

export type ContactPreferenceState = {
  status: 'idle' | 'success' | 'failure' | 'notConfigured' | 'invalid';
};

export async function submitContactPreference(
  _previousState: ContactPreferenceState,
  formData: FormData
): Promise<ContactPreferenceState> {
  const token = formData.get('token');
  const channel = formData.get('channel');
  const phone = formData.get('phone');

  if (
    typeof token !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token) ||
    typeof channel !== 'string' || !['email', 'call', 'whatsapp', 'none'].includes(channel) ||
    (typeof phone !== 'string')
  ) {
    return { status: 'invalid' };
  }

  const normalizedPhone = phone.trim().replace(/[\s().-]/g, '');
  if ((channel === 'call' || channel === 'whatsapp') && !/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
    return { status: 'invalid' };
  }

  const preferenceMode = process.env.CONTACT_MODE;
  if (
    !((process.env.NODE_ENV === 'development' && preferenceMode === 'n8n-test') ||
      (process.env.NODE_ENV === 'production' && preferenceMode === 'n8n-live'))
  ) {
    return { status: 'notConfigured' };
  }

  const endpoint = resolveContactWebhook(process.env.CONTACT_PREFERENCE_WEBHOOK_URL);
  if (!endpoint) return { status: 'failure' };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        token,
        channel,
        phone: channel === 'call' || channel === 'whatsapp' ? normalizedPhone : null
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) return { status: 'failure' };
    const result: unknown = await response.json().catch(() => null);
    if (
      typeof result !== 'object' || result === null ||
      !('status' in result) || result.status !== 'updated'
    ) {
      return { status: 'failure' };
    }

    return { status: 'success' };
  } catch {
    return { status: 'failure' };
  }
}
