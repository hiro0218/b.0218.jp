import { GoRepoForked, GoStar } from 'react-icons/go';
import { HiOutlineExternalLink } from 'react-icons/hi';

import Heading from '@/components/UI/Heading';
import LinkCard from '@/components/UI/LinkCard';
import { URL } from '@/constant';
import { mobile } from '@/lib/mediaQuery';
import { GithubPinnedItems } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = {
  items: Array<GithubPinnedItems>;
};

export const Works = ({ items }: Props) => (
  <section>
    <Heading
      tagName="h2"
      text={'Works'}
      textSide={
        <ViewAll href={URL.GITHUB} target="_blank">
          View All <HiOutlineExternalLink />
        </ViewAll>
      }
      textSub={'GitHub Pinned Repositories'}
      isWeightNormal={false}
    />
    <Container>
      {items.map((item, index) => (
        <LinkCard
          key={index}
          link={item.homepageUrl || item.url}
          title={item.name}
          excerpt={<Description {...item} />}
          target={true}
        />
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

const ViewAll = styled.a`
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: 0.25em;
  }
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
