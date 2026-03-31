import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from '@/components/UI/Layout/Stack';
import fontSizesValues from '@/ui/styled/theme/tokens/fontSizes';
import fontWeightsValues from '@/ui/styled/theme/tokens/fontWeights';

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
  <Stack gap="½">
    <Stack align="baseline" direction="horizontal" gap={1}>
      <span style={{ minWidth: '120px' }}>{name}</span>
      <code>{variable}</code>
    </Stack>
    <p style={{ fontSize: `var(${variable})`, lineHeight: 1.5, margin: 0 }}>{SAMPLE_TEXT}</p>
  </Stack>
);

const FontWeightSample = ({ name, variable, value }: { name: string; variable: string; value: number }) => (
  <Stack gap="½">
    <Stack align="baseline" direction="horizontal" gap={1}>
      <span style={{ minWidth: '80px' }}>{name}</span>
      <code>
        {variable} ({value})
      </code>
    </Stack>
    <p style={{ fontSize: '1.125rem', fontWeight: value, lineHeight: 1.5, margin: 0 }}>{SAMPLE_TEXT}</p>
  </Stack>
);

const TypographyPage = () => (
  <Stack gap={3}>
    <h2>Font Sizes</h2>
    <Stack gap={2}>
      {FONT_SIZES.map((fs) => (
        <FontSizeSample key={fs.name} name={fs.name} variable={fs.variable} />
      ))}
    </Stack>

    <h2>Font Weights</h2>
    <Stack gap={2}>
      {FONT_WEIGHTS.map((fw) => (
        <FontWeightSample key={fw.name} name={fw.name} value={fw.value} variable={fw.variable} />
      ))}
    </Stack>
  </Stack>
);

const meta = {
  title: 'Design Tokens/Typography',
  component: TypographyPage,
  tags: ['!manifest'],
} satisfies Meta<typeof TypographyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontSizesAndWeights: Story = { name: 'フォントサイズ・ウェイト' };
