import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Grid } from '@/components/UI/Layout/Grid';
import { Stack } from '@/components/UI/Layout/Stack';
import { toKebab } from '@/stories/_internal/utils';
import colorTokens from '@/ui/styled/theme/tokens/colors';

const meta: Meta = {
  title: 'Design Tokens/ColorPalette',
  tags: ['!manifest'],
  parameters: {
    docs: {
      description: {
        component:
          'Adobe Spectrum を基盤とした色スケール。新規色を増やす前に、既存トークンで意図に届くかをここで判断する。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Swatch = { name: string; variable: string };

function scaleEntries(tokenKey: string): Swatch[] {
  const data = (colorTokens as Record<string, Record<string, unknown>>)[tokenKey];
  const cssName = toKebab(tokenKey);
  return Object.keys(data)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)
    .map((s) => ({
      name: `${cssName}.${s}`,
      variable: `--colors-${cssName}-${s}`,
    }));
}

const ColorSwatch = ({ name, variable }: Swatch) => (
  <Stack align="center" direction="horizontal" gap={300}>
    <div
      style={{
        width: '3rem',
        height: '3rem',
        borderRadius: 'var(--radii-sm)',
        backgroundColor: `var(${variable})`,
        border: 'var(--border-widths-thin) solid var(--colors-gray-300)',
      }}
    />
    <div>
      <div>{name}</div>
      <code>{variable}</code>
    </div>
  </Stack>
);

const ColorGroup = ({ title, scales }: { title: string; scales: Swatch[] }) => (
  <Stack as="section" gap={100}>
    <h3>{title}</h3>
    <Grid columns="auto-fit" gap={100} minItemWidth="280px">
      {scales.map((s) => (
        <ColorSwatch key={s.variable} name={s.name} variable={s.variable} />
      ))}
    </Grid>
  </Stack>
);

const SOLID_COLORS = ['gray', 'blue', 'green', 'red', 'orange', 'yellow', 'purple', 'pink'] as const;

const ALIAS_COLORS = [
  { key: 'accent', title: 'Accent (= Blue)' },
  { key: 'grass', title: 'Grass (= Green)' },
  { key: 'sky', title: 'Sky (= Cyan)' },
] as const;

const TRANSPARENT_COLORS = [
  { key: 'grayA', title: 'grayA (transparent-black)' },
  { key: 'whiteA', title: 'whiteA (transparent-white)' },
] as const;

/**
 * 不透明な基本スケール（Gray / Blue / Green / Red / Orange / Yellow / Purple / Pink）。背景・テキスト・ボーダーなどコア用途で参照する。
 *
 * @summary Solid スケール
 */
export const Solid: Story = {
  name: 'Solid',
  render: () => (
    <Stack gap={400}>
      {SOLID_COLORS.map((color) => (
        <ColorGroup key={color} scales={scaleEntries(color)} title={color.charAt(0).toUpperCase() + color.slice(1)} />
      ))}
    </Stack>
  ),
};

/**
 * Solid スケールの role 別エイリアス（Accent / Grass / Sky）。Solid の具体色を意味で隠したい箇所で参照する。
 *
 * @summary Alias（意味エイリアス）
 */
export const Alias: Story = {
  name: 'Alias',
  render: () => (
    <Stack gap={400}>
      {ALIAS_COLORS.map(({ key, title }) => (
        <ColorGroup key={key} scales={scaleEntries(key)} title={title} />
      ))}
    </Stack>
  ),
};

/**
 * 透明度スケール（grayA / whiteA）。背面コンテンツを透過させる overlay / chip 背景などで使う。
 *
 * @summary Transparent スケール
 */
export const Transparent: Story = {
  name: 'Transparent',
  render: () => (
    <Stack gap={400}>
      {TRANSPARENT_COLORS.map(({ key, title }) => (
        <ColorGroup key={key} scales={scaleEntries(key)} title={title} />
      ))}
    </Stack>
  ),
};

/**
 * テーマに依存しない素のベース色（white / black）。border、shadow などで素の白黒が必要な場面で参照する。
 *
 * @summary Base（white / black）
 */
export const Base: Story = {
  name: 'Base',
  render: () => (
    <Stack direction="horizontal" gap={400}>
      <ColorSwatch name="white" variable="--colors-white" />
      <ColorSwatch name="black" variable="--colors-black" />
    </Stack>
  ),
};
