import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TheFooter } from '@/components/UI/TheFooter';

export default {
  title: 'Project/TheFooter',
  component: TheFooter,
} as ComponentMeta<typeof TheFooter>;

const Template: ComponentStory<typeof TheFooter> = () => <TheFooter />;

export const Default = Template.bind({});
