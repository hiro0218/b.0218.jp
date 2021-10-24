import { ComponentMeta, ComponentStory } from '@storybook/react';

import TheFooter from '../components/TheFooter';

export default {
  title: 'Project/TheFooter',
  component: TheFooter,
} as ComponentMeta<typeof TheFooter>;

const Template: ComponentStory<typeof TheFooter> = (args) => <TheFooter {...args} />;

export const Default = Template.bind({});
