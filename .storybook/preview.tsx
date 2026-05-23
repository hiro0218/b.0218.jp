import '@/ui/styles/globals.css';

import type { Preview } from '@storybook/nextjs-vite';

import { getStorybookSurfaceStyle, storybookBaseStyles } from '@/stories/_internal/StorySurface';

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const layout = (context.parameters.layout as string | undefined) ?? 'padded';

      return (
        <div
          data-storybook-surface=""
          style={{
            color: 'var(--colors-gray-1000)',
            backgroundColor: 'var(--colors-body-background)',
            ...getStorybookSurfaceStyle(layout),
          }}
        >
          <style>{storybookBaseStyles}</style>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Design Tokens', 'UI', ['Layout', '*'], '*'],
      },
    },
  },
};

export default preview;
