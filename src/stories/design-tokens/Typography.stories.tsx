import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from '@/components/UI/Layout/Stack';
import fontSizesValues from '@/ui/styled/theme/tokens/fontSizes';
import fontWeightsValues from '@/ui/styled/theme/tokens/fontWeights';

const meta: Meta = {
  title: 'Design Tokens/Typography',
  tags: ['!manifest'],
  parameters: {
    docs: {
      description: {
        component:
          'タイポグラフィ関連トークン（font-size / font-weight）。新しい階層を作る前に既存スケールでまかなえないかを判断するためのリファレンス。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FONT_SIZES = Object.keys(fontSizesValues).map((name) => ({
  name,
  variable: `--font-sizes-${name}`,
}));

const FONT_WEIGHTS = Object.entries(fontWeightsValues).map(([name, def]) => ({
  name,
  variable: `--font-weights-${name}`,
  value: def.value as number,
}));

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog. 素早い茶色の狐が怠惰な犬を飛び越える。';

const FontSizeSample = ({ name, variable }: { name: string; variable: string }) => (
  <Stack gap={75}>
    <Stack align="baseline" direction="horizontal" gap={100}>
      <span style={{ minWidth: '120px' }}>{name}</span>
      <code>{variable}</code>
    </Stack>
    <p style={{ fontSize: `var(${variable})`, lineHeight: 1.5, margin: 0 }}>{SAMPLE_TEXT}</p>
  </Stack>
);

const FontWeightSample = ({ name, variable, value }: { name: string; variable: string; value: number }) => (
  <Stack gap={75}>
    <Stack align="baseline" direction="horizontal" gap={100}>
      <span style={{ minWidth: '80px' }}>{name}</span>
      <code>
        {variable} ({value})
      </code>
    </Stack>
    <p style={{ fontSize: '1.125rem', fontWeight: value, lineHeight: 1.5, margin: 0 }}>{SAMPLE_TEXT}</p>
  </Stack>
);

/**
 * font-size の全段階を和欧混植の実文例で比較する標本。階層を増やすか既存スケールから選ぶかの判断に使う。
 *
 * @summary Font sizes スケール
 */
export const FontSizes: Story = {
  name: 'Font sizes',
  render: () => (
    <Stack gap={300}>
      {FONT_SIZES.map((fs) => (
        <FontSizeSample key={fs.name} name={fs.name} variable={fs.variable} />
      ))}
    </Stack>
  ),
};

/**
 * font-weight の全段階を実文例で比較する標本。本文と見出しでウェイト差をどう設計するかの判断に使う。
 *
 * @summary Font weights スケール
 */
export const FontWeights: Story = {
  name: 'Font weights',
  render: () => (
    <Stack gap={300}>
      {FONT_WEIGHTS.map((fw) => (
        <FontWeightSample key={fw.name} name={fw.name} value={fw.value} variable={fw.variable} />
      ))}
    </Stack>
  ),
};
