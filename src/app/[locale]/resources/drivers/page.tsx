import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

// Preserve old bookmarks without advertising the removed example category.
export default async function ResourcesDriversPage() {
  const locale = await getLocale();
  redirect(`/${locale}/resources`);
}
