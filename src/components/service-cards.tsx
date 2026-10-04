import Image from 'next/image';
import { CheckCircleIcon } from '@phosphor-icons/react/ssr';
import { getLocale } from 'next-intl/server';
import { getVisualCopy } from './visual-copy';

export async function ServiceCards({ items }: { items: { title: string; text: string }[] }) {
  const copy = getVisualCopy(await getLocale());
  return (
    <div className="grid gap-6 pt-8 lg:grid-cols-12">
      {items.map((item, index) => (
        <article key={item.title} className={`overflow-hidden rounded-3xl border border-border bg-surface ${index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-12 lg:grid lg:grid-cols-2'}`}>
          <div className={`relative ${index === 2 ? 'min-h-64 lg:min-h-80' : 'aspect-[16/9]'}`}>
            <Image src={`/service-visuals/${['web', 'commerce', 'systems'][index]}.webp`} alt={copy.serviceAlt[index]} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">{item.title}</h3>
            <p className="mt-3 max-w-xl leading-7 text-muted">{item.text}</p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {copy.benefits[index].map(benefit => <li key={benefit} className="flex items-start gap-3"><CheckCircleIcon aria-hidden="true" size={20} className="shrink-0 text-brand-strong" />{benefit}</li>)}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
