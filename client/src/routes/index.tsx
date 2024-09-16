import { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { lazy } from 'react';
import LazyLoad from '../components/LazyLoadProps';
import LatexCompiler from '../pages/LatexCompiler';
import CKEditorQuestion from '../pages/CKEditorQuestion';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const QuestionBank = lazy(() => import('../pages/QuestionBank'));

export const router: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { 
        index: true, 
        element: <LazyLoad>
          <Dashboard />
        </LazyLoad>
      },
      { 
        path: 'question-bank',
        element: <LazyLoad>
          <QuestionBank />
        </LazyLoad>
      },
      {
        path: 'latex-compiler',
        element: <LazyLoad>
          <LatexCompiler />
        </LazyLoad>
      },
      {
        path: 'ckeditor-question',
        element: <LazyLoad>
          <CKEditorQuestion />
        </LazyLoad>
      }
    ]
  }
];
