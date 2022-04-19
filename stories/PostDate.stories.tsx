import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostDate from '@/components/Page/Post/Date';

import { PostData } from './mock';

export default {
  title: 'Components/PostDate',
  component: PostDate,
} as ComponentMeta<typeof PostDate>;

const Template: ComponentStory<typeof PostDate> = (args) => <PostDate {...args} />;

export const Default = Template.bind({});
Default.args = {
  date: PostData.date,
  updated: '',
};

export const Updated = Template.bind({});
Updated.args = {
  ...Default.args,
  updated: PostData.updated,
};
