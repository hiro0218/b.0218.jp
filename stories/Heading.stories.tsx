import { ComponentMeta, ComponentStory } from '@storybook/react';

import Heading from '../components/Heading';

export default {
  title: 'Components/Heading',
  component: Heading,
} as ComponentMeta<typeof Heading>;

const Template: ComponentStory<typeof Heading> = (args) => <Heading {...args} />;

export const Default = Template.bind({});
Default.args = {
  tagName: 'h2',
  text: 'Heading Component',
  isWeightNormal: true,
};
