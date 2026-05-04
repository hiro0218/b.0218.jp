import { cleanup, render } from '@testing-library/react';
import type { Thing, WithContext } from 'schema-dts';
import { afterEach, describe, expect, it } from 'vitest';
import { StructuredData } from './StructuredData';

describe('StructuredData', () => {
  afterEach(() => {
    cleanup();
  });

  it('< を含む値の場合、JSON unicode escape で出力する', () => {
    const name = '</script><img src=x onerror=alert(1)>';
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Thing',
      name,
    } satisfies WithContext<Thing>;

    const { container } = render(<StructuredData data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script?.textContent).toContain('\\u003c/script>');
    expect(script?.textContent).not.toContain('</script>');

    const parsed = JSON.parse(script?.textContent ?? '{}') as { name: string };
    expect(parsed.name).toBe(name);
  });
});
