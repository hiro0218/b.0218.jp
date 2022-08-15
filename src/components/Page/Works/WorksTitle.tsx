import { FaGithub } from 'react-icons/fa';

import { Title } from '@/components/UI/Title';
import { URL } from '@/constant';
import { styled } from '@/ui/styled';

export const WorksTitle = () => {
  return (
    <Title
      heading="Works"
      paragraph="GitHub Pinned Repositories"
      sideElement={
        <ViewAll href={URL.GITHUB} target="_blank" aria-label="View all GitHub repositories" rel="noreferrer">
          <FaGithub />
        </ViewAll>
      }
    />
  );
};

const ViewAll = styled.a`
  svg {
    width: 24px;
    height: 24px;
  }
`;
