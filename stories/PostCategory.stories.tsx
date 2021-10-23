import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostCategory from '../components/post/term/category';
import { PostData } from './mock';

export default {
  title: 'Components/PostCategory',
  component: PostCategory,
} as ComponentMeta<typeof PostCategory>;

const Template: ComponentStory<typeof PostCategory> = (args) => <PostCategory {...args} />;

export const Default = Template.bind({});
Default.args = {
  categories: PostData.categories,
};
