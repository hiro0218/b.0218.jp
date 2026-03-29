/// <reference types="vite/client" />
import { composeStories, setProjectAnnotations } from '@storybook/react';
import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { afterEach, describe, it } from 'vitest';

import preview from '../../.storybook/preview';

setProjectAnnotations(preview);

type StoryFileModule = Parameters<typeof composeStories>[0];

type PlayableStory = ComponentType & {
  play?: (context: { canvasElement: HTMLElement }) => Promise<void> | void;
};

const storyModules = import.meta.glob<StoryFileModule>('../components/UI/**/*.stories.tsx', { eager: true });

const STORY_PATH_PATTERN = /UI\/(.+)\.stories\.tsx$/;

afterEach(cleanup);

describe('storybook interactions', () => {
  for (const [filePath, storyModule] of Object.entries(storyModules)) {
    const match = filePath.match(STORY_PATH_PATTERN);
    if (!match?.[1]) {
      throw new Error(`Unexpected story path: ${filePath}`);
    }
    const label = match[1];
    const composed = composeStories(storyModule);

    for (const [storyName, StoryFn] of Object.entries(composed)) {
      const Story = StoryFn as PlayableStory;
      if (typeof Story.play !== 'function') continue;

      it(`${label}/${storyName}`, async () => {
        const { container } = render(<Story />);
        await Story.play({ canvasElement: container });
      });
    }
  }
});
