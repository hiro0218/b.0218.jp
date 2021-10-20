import { ComponentMeta, ComponentStory } from '@storybook/react';

import TheHeader from '../components/TheHeader';

export default {
  title: 'Project/TheHeader',
  component: TheHeader,
} as ComponentMeta<typeof TheHeader>;

const Template: ComponentStory<typeof TheHeader> = (args) => {
  return (
    <div style={{ height: '300vh' }}>
      <TheHeader {...args} />
    </div>
  );
};

export const Normal = Template.bind({});
