import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostDate from '../components/post/date';

export default {
  title: 'Components/PostDate',
  component: PostDate,
} as ComponentMeta<typeof PostDate>;

const Template: ComponentStory<typeof PostDate> = (args) => <PostDate {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  date: '2020-02-18 10:10:10',
  updated: '',
};

export const Updated = Template.bind({});
Updated.args = {
  date: '2020-02-18 10:10:10',
  updated: '2021-02-18 10:10:10',
};
