import '@/ui/styles/globals.css';

import type { Preview } from '@storybook/nextjs-vite';

import {
  getStorybookSurfaceStyle,
  normalizeLayout,
  StoryCenteredFrame,
  StorySpecimenFooter,
  StorySpecimenHeader,
  storySurfaceClass,
} from '@/stories/_internal/StorySurface';

const surfaceFrameResetStyle = `
  body.sb-show-main {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 0 !important;
    align-items: stretch !important;
  }
  body.sb-show-main #storybook-root {
    margin: 0 !important;
    padding: 0 !important;
    max-height: none !important;
    box-sizing: border-box;
  }
`;

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const layout = normalizeLayout(context.parameters.layout);
      const showSpecimenChrome = context.viewMode !== 'docs';

      const renderedStory =
        layout === 'centered' ? (
          <StoryCenteredFrame>
            <Story />
          </StoryCenteredFrame>
        ) : (
          <div>
            <Story />
          </div>
        );

      return (
        <>
          <style>{surfaceFrameResetStyle}</style>
          <div className={storySurfaceClass} style={getStorybookSurfaceStyle(layout)}>
            {showSpecimenChrome ? (
              <StorySpecimenHeader
                componentTitle={context.title}
                layout={layout}
                storyId={context.id}
                storyName={context.name}
              />
            ) : null}
            {renderedStory}
            {showSpecimenChrome ? <StorySpecimenFooter layout={layout} /> : null}
          </div>
        </>
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
