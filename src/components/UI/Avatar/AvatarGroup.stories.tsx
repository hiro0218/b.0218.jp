import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'UI/AvatarGroup',
  component: AvatarGroup,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 複数の Avatar を少しずつ重ねて表示する基本形。webmention のいいねなど、
 * 誰がリアクションしたかを省スペースで示す場面で使う。
 * @summary 複数の Avatar が重なる場合
 */
export const Default: Story = {
  name: '複数の Avatar が重なる場合',
  args: {
    children: (
      <>
        <Avatar name="Alice" src="https://picsum.photos/seed/alice/64" />
        <Avatar name="Bob" src="https://picsum.photos/seed/bob/64" />
        <Avatar name="Carol" src={null} />
      </>
    ),
  },
};
