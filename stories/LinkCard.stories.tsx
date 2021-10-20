import { ComponentMeta, ComponentStory } from '@storybook/react';

import LinkCard from '../components/LinkCard';

export default {
  title: 'Components/LinkCard',
  component: LinkCard,
} as ComponentMeta<typeof LinkCard>;

const Template: ComponentStory<typeof LinkCard> = (args) => <LinkCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  link: '#',
  title: 'post title',
  date: '2020-02-18',
  excerpt: 'post excerpt',
};
