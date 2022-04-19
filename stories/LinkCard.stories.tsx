import { ComponentMeta, ComponentStory } from '@storybook/react';

import LinkCard from '@/components/UI/LinkCard';

import { PostData } from './mock';

export default {
  title: 'Components/LinkCard',
  component: LinkCard,
} as ComponentMeta<typeof LinkCard>;

const Template: ComponentStory<typeof LinkCard> = (args) => <LinkCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  link: '#',
  title: PostData.title,
  date: PostData.date,
  excerpt: PostData.excerpt,
};
