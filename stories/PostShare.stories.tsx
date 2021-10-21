import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostShare from '../components/post/share';

export default {
  title: 'Components/PostShare',
  component: PostShare,
} as ComponentMeta<typeof PostShare>;

const Template: ComponentStory<typeof PostShare> = (args) => <PostShare {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: document.title,
  url: location.href,
};
