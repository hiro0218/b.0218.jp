import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostPager from '@/components/PostPager';

import { PostData } from './mock';

export default {
  title: 'Components/PostPager',
  component: PostPager,
} as ComponentMeta<typeof PostPager>;

const Template: ComponentStory<typeof PostPager> = (args) => <PostPager {...args} />;

export const Both = Template.bind({});
Both.args = {
  next: PostData.next,
  prev: PostData.prev,
};

export const Next = Template.bind({});
Next.args = {
  ...Both.args,
  prev: {},
};

export const Prev = Template.bind({});
Prev.args = {
  ...Both.args,
  next: {},
};
