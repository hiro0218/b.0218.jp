import { GoRepoForked, GoStar } from 'react-icons/go';

import LinkCard from '@/components/UI/LinkCard';
import { mobile } from '@/lib/mediaQuery';
import { GithubPinnedItems } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = {
  items: Array<GithubPinnedItems>;
};

export const WorksLists = ({ items }: Props) => (
  <section>
    <Container>
      {items.map((item, index) => (
        <LinkCard key={index} link={item.url} title={item.name} excerpt={<Description {...item} />} target={true} />
      ))}
    </Container>
  </section>
);

const Description = ({ description, forkCount, stargazerCount, languages }: Partial<GithubPinnedItems>) => (
  <DescriptionContainer>
    <span>{description}</span>
    <StatusList>
      <StatusListItem>
        <StatusLanguageCircle color={languages.color} aria-hidden="true" />
        {languages.name}
      </StatusListItem>
      <StatusListItem>
        <GoStar size={16} />
        {stargazerCount}
      </StatusListItem>
      <StatusListItem>
        <GoRepoForked size={16} />
        {forkCount}
      </StatusListItem>
    </StatusList>
  </DescriptionContainer>
);

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--margin-base) * 0.5);
`;

const StatusList = styled.ul`
  display: flex;
  align-items: center;
`;

const StatusListItem = styled.li`
  display: inline-flex;
  align-items: center;
  font-size: var(--font-size-sm);

  & + & {
    margin-left: 1em;
  }
`;

const StatusLanguageCircle = styled.span<{ color: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 0.25em;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-md)), 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);

  ${mobile} {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;
