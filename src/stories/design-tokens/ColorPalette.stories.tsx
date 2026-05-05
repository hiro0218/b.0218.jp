import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Grid } from '@/components/UI/Layout/Grid';
import { Stack } from '@/components/UI/Layout/Stack';
import { toKebab } from '@/stories/_internal/utils';
import colorTokens from '@/ui/styled/theme/tokens/colors';

function scaleEntries(tokenKey: string): { name: string; variable: string }[] {
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

const ColorSwatch = ({ name, variable }: { name: string; variable: string }) => (
  <Stack align="center" direction="horizontal" gap={2}>
    <div
      style={{
        width: '3rem',
        height: '3rem',
        borderRadius: 'var(--radii-sm)',
        background: `var(${variable})`,
        border: 'var(--border-widths-thin) solid var(--colors-gray-300)',
      }}
    />
    <div>
      <div>{name}</div>
      <code>{variable}</code>
    </div>
  </Stack>
);

const ColorGroup = ({ title, scales }: { title: string; scales: { name: string; variable: string }[] }) => (
  <Stack as="section" gap={1}>
    <h2>{title}</h2>
    <Grid columns="auto-fit" gap={1} minItemWidth="280px">
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
  { key: 'teal', title: 'Teal (= Magenta)' },
] as const;

const TRANSPARENT_COLORS = [
  { key: 'grayA', title: 'grayA (transparent-black)' },
  { key: 'whiteA', title: 'whiteA (transparent-white)' },
] as const;

const ColorPalettePage = () => (
  <Stack gap={3}>
    <h2>Color Palette</h2>
    {SOLID_COLORS.map((color) => (
      <ColorGroup key={color} scales={scaleEntries(color)} title={color.charAt(0).toUpperCase() + color.slice(1)} />
    ))}

    <h2>Alias Colors</h2>
    {ALIAS_COLORS.map(({ key, title }) => (
      <ColorGroup key={key} scales={scaleEntries(key)} title={title} />
    ))}

    <h2>Transparent Colors</h2>
    {TRANSPARENT_COLORS.map(({ key, title }) => (
      <ColorGroup key={key} scales={scaleEntries(key)} title={title} />
    ))}

    <h2>Base</h2>
    <Stack direction="horizontal" gap={3}>
      <ColorSwatch name="white" variable="--colors-white" />
      <ColorSwatch name="black" variable="--colors-black" />
    </Stack>
  </Stack>
);

const meta = {
  title: 'Design Tokens/ColorPalette',
  component: ColorPalettePage,
  tags: ['!manifest'],
  parameters: {
    docs: {
      description: {
        component:
          'サイト全体で使用する色トークンの一覧。Solid / Alias / Transparent の各スケールを CSS 変数として参照できる。新規色を追加する前に既存トークンとの重複を確認する用途で使用する。',
      },
    },
  },
} satisfies Meta<typeof ColorPalettePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = { name: '全カラーパレット' };
