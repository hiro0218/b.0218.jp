import React from 'react';
import Link from 'next/link';

const TheHeader: React.FC = () => {
  return (
    <header>
      <Link href="/">Home</Link>
    </header>
  );
};

export default TheHeader;
