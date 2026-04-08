import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Cluster } from '@/components/UI/Layout/Cluster';
import { Stack } from '@/components/UI/Layout/Stack';
import { toKebab } from '@/stories/_internal/utils';
import { keyframes } from '@/ui/styled/theme/keyframes';
import durationValues from '@/ui/styled/theme/tokens/durations';
import easingValues from '@/ui/styled/theme/tokens/easings';

const EASINGS = Object.keys(easingValues).map((name) => ({
  name,
  variable: `--easings-${toKebab(name)}`,
}));

const DURATIONS = Object.entries(durationValues).map(([name, def]) => ({
  name,
  variable: `--durations-${name}`,
  value: def.value as string,
}));

const KEYFRAMES = Object.keys(keyframes);

const EasingDemo = ({ name, variable }: { name: string; variable: string }) => {
  const [active, setActive] = useState(false);

  return (
    <Stack gap={1}>
      <Stack align="center" direction="horizontal" gap={1}>
        <span>{name}</span>
        <code>{variable}</code>
        <button
          onClick={() => setActive((prev) => !prev)}
          style={{ padding: 'var(--spacing-1) var(--spacing-2)' }}
          type="button"
        >
          {active ? 'Reset' : 'Play'}
        </button>
      </Stack>
      <div
        style={{
          position: 'relative',
          height: '2.5rem',
          overflow: 'hidden',
          borderRadius: 'var(--radii-sm)',
          background: 'var(--colors-gray-100)',
          containerType: 'inline-size',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            width: '2rem',
            height: '2rem',
            borderRadius: 'var(--radii-sm)',
            background: 'var(--colors-blue-600)',
            transform: active ? 'translateX(calc(100cqi - 2.5rem - 4px))' : 'translateX(0)',
            transition: `transform 0.6s var(${variable})`,
            willChange: 'transform',
          }}
        />
      </div>
    </Stack>
  );
};

const DurationBar = ({ name, variable, value }: { name: string; variable: string; value: string }) => (
  <Stack align="center" direction="horizontal" gap={2}>
    <div style={{ width: '80px', textAlign: 'right', flexShrink: 0 }}>
      <div>{name}</div>
    </div>
    <div
      style={{
        height: '1.5rem',
        width: `${parseFloat(value) * 500}px`,
        background: 'var(--colors-green-600)',
        borderRadius: 'var(--radii-sm)',
        minWidth: '20px',
      }}
    />
    <code>
      {variable} = {value}
    </code>
  </Stack>
);

const KeyframeDemo = ({ name }: { name: string }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <Stack align="center" gap={1} style={{ minWidth: '120px' }}>
      <div
        onAnimationEnd={() => setPlaying(false)}
        style={{
          width: '3rem',
          height: '3rem',
          borderRadius: 'var(--radii-sm)',
          background: 'var(--colors-accent-600)',
          animation: playing ? `${name} 0.8s ease forwards` : 'none',
        }}
      />
      <code>{name}</code>
      <button
        disabled={playing}
        onClick={() => setPlaying(true)}
        style={{ padding: 'var(--spacing-1) var(--spacing-2)' }}
        type="button"
      >
        Play
      </button>
    </Stack>
  );
};

const AnimationPage = () => (
  <Stack gap={3}>
    <h2>Easings</h2>
    <Stack gap={2}>
      {EASINGS.map((e) => (
        <EasingDemo key={e.name} name={e.name} variable={e.variable} />
      ))}
    </Stack>

    <h2>Durations</h2>
    <Stack gap={1}>
      {DURATIONS.map((d) => (
        <DurationBar key={d.name} name={d.name} value={d.value} variable={d.variable} />
      ))}
    </Stack>

    <h2>Keyframes</h2>
    <Cluster gap={3}>
      {KEYFRAMES.map((k) => (
        <KeyframeDemo key={k} name={k} />
      ))}
    </Cluster>
  </Stack>
);

const meta = {
  title: 'Design Tokens/Animation',
  component: AnimationPage,
  tags: ['!manifest'],
} satisfies Meta<typeof AnimationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EasingsAndDurations: Story = { name: 'イージング・デュレーション' };
