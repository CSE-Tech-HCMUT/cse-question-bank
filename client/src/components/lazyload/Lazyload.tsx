import React, { Suspense } from 'react';
import { Loading } from '../loading';

interface LazyLoadProps {
  children: React.ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

export default LazyLoad;