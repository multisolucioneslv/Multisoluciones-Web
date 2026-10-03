'use server';

export type ContactState = {
  status: 'idle' | 'success' | 'failure' | 'notConfigured' | 'invalid';
};

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

  if (
    typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
    typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof service !== 'string' || !['website', 'commerce', 'systems', 'other'].includes(service) ||
    typeof message !== 'string' || message.trim().length < 10 || message.length > 3000
  ) {
    return { status: 'invalid' };
  }

  // Local preview only. Production delivery stays disabled until the webhook is
  // configured and the user explicitly approves the VPS integration phase.
  const contactMode = process.env.CONTACT_MODE ?? (process.env.NODE_ENV === 'development' ? 'mock' : 'disabled');
  if (process.env.NODE_ENV !== 'development' || contactMode !== 'mock') {
    return { status: 'notConfigured' };
  }

  if (process.env.CONTACT_MOCK_RESULT === 'failure') {
    return { status: 'failure' };
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  return { status: 'success' };
}
