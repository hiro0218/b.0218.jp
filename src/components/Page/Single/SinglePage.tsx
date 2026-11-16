import type { ReactNode } from 'react';
import { Title } from '@/components/UI/Title';
import { css, cx, styled } from '@/ui/styled';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export function SinglePage({ title, description, children }: Props) {
  return (
    <Intro>
      <Title paragraph={description}>{title}</Title>
      <article className={cx('post-content', articleStyle)}>{children}</article>
    </Intro>
  );
}

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-title);
`;

// .post-content のリンク全体には min-width・min-height を付けない。文の中のリンクまで広げてしまうため
const articleStyle = css`
  & li > a:only-child {
    display: inline-flex;
    align-items: center;
    min-width: var(--control-min-size);
    min-height: var(--control-min-size);
  }
`;
