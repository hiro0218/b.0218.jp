import { Story } from '@storybook/react'
import { RouterContext } from 'next/dist/shared/lib/router-context';

// @ts-ignore
import CssBaseline from '@/components/CssBaseline';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

export const decorators = [
  (StoryContent: Story) => {
    return (
      <>
        <CssBaseline />
        <div id="__next">
          <StoryContent />
        </div>
      </>
    )
  },
]
