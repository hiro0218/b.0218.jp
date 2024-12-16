import { Popover } from '@/components/UI/Popover/index';
import { GitHubLogoIcon, ICON_SIZE_SM } from '@/ui/icons';
import { styled } from '@/ui/styled';
import dynamic from 'next/dynamic';

const SrOnly = dynamic(() =>
  import('@/components/UI/ScreenReaderOnlyText').then((module) => module.ScreenReaderOnlyText),
);

type Props = {
  slug: string;
};

function PostEdit({ slug }: Props) {
  return (
    <aside>
      <Popover
        title={
          <>
            <SrOnly text="Feedback" />
            <GitHubLogoIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </>
        }
        menuHorizontalPosition="right"
      >
        <Anchor
          href={`https://github.com/hiro0218/article/edit/master/_posts/${slug}.md`}
          rel="noreferrer"
          target="_blank"
        >
          Edit on GitHub
        </Anchor>
      </Popover>
    </aside>
  );
}

export default PostEdit;

const Anchor = styled.a`
  display: inline-flex;
  align-items: center;
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--color-gray-12);
  border-radius: var(--border-radius-2);

  &:hover {
    background-color: var(--color-gray-3A);
  }
`;
