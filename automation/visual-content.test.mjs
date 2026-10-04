import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { visualCopy } from '../src/components/visual-copy.ts';

for (const locale of ['es', 'en', 'pt', 'ko']) {
  test(`complete visual descriptions for ${locale}`, () => {
    const copy = visualCopy[locale];
    assert.equal(copy.benefits.length, 3);
    assert.ok(copy.benefits.every(items => items.length === 2 && items.every(Boolean)));
    assert.equal(copy.steps.length, 3);
    assert.equal(copy.serviceAlt.length, 3);
    assert.equal(copy.projectAlt.length, 2);
    assert.ok(copy.courseCaption);
  });
}
test('service and real-project WebP assets exist and remain lightweight', () => {
  for (const file of ['service-visuals/web', 'service-visuals/commerce', 'service-visuals/systems', 'project-previews/rescuvo', 'project-previews/course']) {
    assert.ok(statSync(new URL(`../public/${file}.webp`, import.meta.url)).size < 200 * 1024);
  }
});
test('resources use a fixed English Coming soon title without a driver link', () => {
  const page = readFileSync(new URL('../src/app/[locale]/resources/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /lang="en"[^>]*>Coming soon/);
  assert.doesNotMatch(page, /href="\/resources\/drivers"|driversTitle/);
  assert.equal((page.match(/t\('moreTitle'\)/g) ?? []).length, 1);
  const legacy = readFileSync(new URL('../src/app/[locale]/resources/drivers/page.tsx', import.meta.url), 'utf8');
  assert.match(legacy, /redirect\(/);
});
