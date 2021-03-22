import TheFooter from '@/components/TheFooter';
import TheHeader from '@/components/TheHeader';

const PageContainer = ({ children }) => {
  return (
    <>
      <TheHeader />
      <div className="l-container" style={{ minHeight: '100vh' }}>
        {children}
      </div>
      <TheFooter />
    </>
  );
};

export default PageContainer;
