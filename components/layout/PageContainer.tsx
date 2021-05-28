import { FC } from 'react';

interface Props {
  children?: React.ReactNode;
}

const PageContainer: FC<Props> = ({ children }) => {
  return <div className="l-page-container">{children}</div>;
};

export default PageContainer;
