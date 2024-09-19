import { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { lazy } from 'react';
import LazyLoad from '../components/LazyLoadProps';
import QuestionSimple from '../pages/question/QuestionSimple';
import QuestionBlock from '../pages/question/QuestionBlock';

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
        path: 'editor-question',
        children: [
          {
            path: 'simple-question',
            element: <LazyLoad>
              <QuestionSimple />
            </LazyLoad>
          },
          {
            path: 'block-question',
            element: <LazyLoad>
              <QuestionBlock />
            </LazyLoad>
          }
        ]
      }
    ]
  }
];
