import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from '@/components/UI/Layout/Stack';
import spacingValues from '@/ui/styled/theme/tokens/spacing';

const SPACES = Object.keys(spacingValues)
  .map(Number)
  .sort((a, b) => a - b)
  .map((key) => {
    const basePx = Math.round(parseFloat(String(spacingValues[key].value)) * 16);
    return { name: String(key), variable: `--spacing-${key}`, basePx };
  });

const SpacingBar = ({ name, variable, basePx }: { name: string; variable: string; basePx: number }) => (
  <Stack align="center" direction="horizontal" gap={300}>
    <div style={{ minWidth: '120px', textAlign: 'right', flexShrink: 0 }}>
      <div>{name}</div>
      <code>{variable}</code>
    </div>
    <div
      style={{
        height: '2rem',
        width: `var(${variable})`,
        backgroundColor: 'var(--colors-blue-600)',
        borderRadius: 'var(--radii-sm)',
        minWidth: '4px',
      }}
    />
    <code style={{ flexShrink: 0 }}>{basePx}px</code>
  </Stack>
);

const SpacingPage = () => (
  <Stack gap={400}>
    <h2>Spacing Scale</h2>
    <p>Adobe Spectrum spacing スケール（2px〜96px、12 段）</p>
    <Stack gap={100}>
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
  parameters: {
    docs: {
      description: {
        component:
          'Adobe Spectrum spacing スケール（2px〜96px、12 段）の全段階を視覚化した標本。gap / padding を新規に決めるときに、ここから 1 段だけ動かすのか 2 段動かすのかを判断する。',
      },
    },
  },
} satisfies Meta<typeof SpacingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Adobe Spectrum spacing スケールの各段階を実際の幅で並べた標本。CSS 変数名と px 換算値を 1 画面で照合する。
 *
 * @summary Spectrum spacing スケール標本
 */
export const Scale: Story = { name: 'スペーシングスケール' };
