import { FaGithub } from 'react-icons/fa';

import { AUTHOR, URL } from '@/constant';
import { styled } from '@/ui/styled';

const ICON_SIZE = 64;

export const Profile = () => {
  return (
    <Container>
      <Avatar>
        <img src={AUTHOR.ICON_LOCAL} height={ICON_SIZE} width={ICON_SIZE} alt="avatar" />
      </Avatar>
      <Introduction>
        <Name>
          {AUTHOR.NAME}
          <SnsList>
            <a href={URL.GITHUB} target="_blank" rel="noreferrer">
              <FaGithub aria-label="GitHub" />
            </a>
          </SnsList>
        </Name>
        <Description>{AUTHOR.PROFILE}</Description>
      </Introduction>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  align-items: flex-start;
`;

const Avatar = styled.div`
  min-width: ${ICON_SIZE}px;

  img {
    border-radius: 100%;
  }
`;

const Introduction = styled.div`
  margin-left: var(--space-xs);
`;

const Name = styled.h1`
  display: flex;
  align-items: center;
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1;
`;

const SnsList = styled.div`
  display: inline-flex;
  margin-left: var(--space-x-xs);
`;

const Description = styled.p`
  margin-top: var(--space-x-xs);
  font-size: var(--font-size-sm);
`;
