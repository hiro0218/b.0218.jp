import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from '@/components/UI/Layout/Stack';
import { SPACING_BASE_PX } from '@/ui/styled/constant';
import spacingValues, { Spaces } from '@/ui/styled/theme/tokens/spacing';

const SPACES = Spaces.map((space) => {
  const basePx = Math.round(parseFloat(String(spacingValues[space].value)) * 16);
  return {
    name: space === '½' ? '1/2' : String(space),
    variable: `--spacing-${space}`,
    basePx,
  };
});

const SpacingBar = ({ name, variable, basePx }: { name: string; variable: string; basePx: number }) => (
  <Stack align="center" direction="horizontal" gap={2}>
    <div style={{ minWidth: '120px', textAlign: 'right', flexShrink: 0 }}>
      <div>{name}</div>
      <code>{variable}</code>
    </div>
    <div
      style={{
        height: '2rem',
        width: `var(${variable})`,
        background: 'var(--colors-blue-600)',
        borderRadius: 'var(--radii-sm)',
        minWidth: '4px',
      }}
    />
    <code style={{ flexShrink: 0 }}>{basePx}px</code>
  </Stack>
);

const SpacingPage = () => (
  <Stack gap={3}>
    <h2>Spacing Scale</h2>
    <p>Fibonacci sequence base (base = {SPACING_BASE_PX}px): 0.5, 1, 2, 3, 5, 8, 13</p>
    <Stack gap={1}>
      {SPACES.map((s) => (
        <SpacingBar basePx={s.basePx} key={s.variable} name={s.name} variable={s.variable} />
      ))}
    </Stack>
  </Stack>
);

const meta = {
  title: 'Design Tokens/Spacing',
  component: SpacingPage,
  tags: ['!manifest'],
} satisfies Meta<typeof SpacingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = { name: 'スペーシングスケール' };
