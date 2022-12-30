import { useRouter } from 'next/router';

import { styled } from '@/ui/styled';

import { MokujiProps } from './type';
import { useMokuji } from './useMokuji';

const Mokuji = ({ refContent }: MokujiProps) => {
  const { asPath } = useRouter();
  const { refMokuji, refDetail } = useMokuji({ refContent });

  return (
    <Root key={asPath} ref={refMokuji}>
      <Details ref={refDetail}>
        <Summary />
      </Details>
    </Root>
  );
};

export default Mokuji;

const Root = styled.aside`
  font-size: var(--font-size-sm);

  a {
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Summary = styled.summary`
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-md);
  cursor: pointer;
  user-select: none;

  &::after {
    content: '目次';
  }
`;

const Details = styled.details`
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
  background-color: var(--component-backgrounds-3);

  &:not([open]):hover {
    background-color: var(--component-backgrounds-4);
  }

  > ol {
    margin: 0;
    padding: 0 var(--space-lg) var(--space-lg);

    /* > li > a {} */
  }

  ol {
    list-style: none;
    counter-reset: number;

    & li {
      list-style: none;

      &:not(:last-child) {
        margin-bottom: var(--space-xs);
      }

      &::before {
        content: counters(number, '-') '. ';
        counter-increment: number;
      }
    }

    & ol {
      margin: 0.5rem 0;
      padding-left: 1.25em;
    }
  }
`;
