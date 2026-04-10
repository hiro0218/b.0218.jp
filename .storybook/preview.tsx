import '@/ui/styles/globals.css';

import type { Preview } from '@storybook/nextjs-vite';

const storybookBaseStyles = `
  [data-storybook-surface] h2 {
    font-size: var(--font-sizes-h4);
    font-weight: var(--font-weights-bolder);
    line-height: var(--line-heights-sm);
    margin: 0;
  }
  [data-storybook-surface] h3 {
    font-size: var(--font-sizes-h6);
    font-weight: var(--font-weights-bold);
    line-height: var(--line-heights-sm);
    margin: 0;
  }
  [data-storybook-surface] code {
    font-family: var(--fonts-family-monospace);
    font-size: var(--font-sizes-xs);
  }
`;

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const isFullscreen = context.parameters.layout === 'fullscreen';

      return (
        <div
          data-storybook-surface=""
          style={{
            minHeight: '100vh',
            padding: isFullscreen ? '0' : 'var(--spacing-3)',
            color: 'var(--colors-gray-1000)',
            backgroundColor: 'var(--colors-body-background)',
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
