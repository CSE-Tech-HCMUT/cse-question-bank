import React, { Suspense } from 'react';
import Loading from './Loading';

interface LazyLoadProps {
  children: React.ReactNode;
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

export default LazyLoad;
