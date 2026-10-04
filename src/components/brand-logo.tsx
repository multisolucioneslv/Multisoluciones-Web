'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.addEventListener('change', callback);
  return () => {
    observer.disconnect();
    reducedMotion.removeEventListener('change', callback);
  };
}

function getSnapshot() {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'still' : 'animated';
  return `${theme}-${motion}`;
}

export function BrandLogo() {
  const appearance = useSyncExternalStore(subscribe, getSnapshot, () => 'light-still');
  const theme = appearance.startsWith('dark') ? 'dark' : 'light';
  const animated = appearance.endsWith('animated');

  return (
    <video
      key={appearance}
      aria-hidden="true"
      width="80"
      height="45"
      className="h-[27px] w-12 shrink-0 rounded-md object-contain sm:h-[45px] sm:w-20"
      src={animated ? `/brand/logo-${theme}.mp4` : undefined}
      poster={`/brand/logo-${theme}.png`}
      autoPlay={animated}
      muted
      loop
      playsInline
      preload={animated ? 'metadata' : 'none'}
    />
  );
}
