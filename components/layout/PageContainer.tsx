const PageContainer = ({ children }) => {
  return (
    <div className="l-container" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default PageContainer;
