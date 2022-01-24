import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostTag from '../components/PostTag';
import { PostData } from './mock';

export default {
  title: 'Components/PostTag',
  component: PostTag,
} as ComponentMeta<typeof PostTag>;

const Template: ComponentStory<typeof PostTag> = (args) => <PostTag {...args} />;

export const Default = Template.bind({});
Default.args = {
  tags: PostData.tags,
};
