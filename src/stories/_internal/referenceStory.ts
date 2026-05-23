type StoryLayout = 'centered' | 'fullscreen' | 'padded';

export function storyDescription(story: string) {
  return {
    docs: {
      description: {
        story,
      },
    },
  };
}

export function referenceStoryParameters(story: string, layout: StoryLayout = 'padded') {
  return {
    ...storyDescription(story),
    layout,
  };
}
