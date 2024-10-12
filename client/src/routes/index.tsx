import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import LazyLoad from '../components/LazyLoadProps';
import AuthLayout from '../layouts/AuthLayout';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const QuestionBank = lazy(() => import('../pages/question-bank/QuestionBank'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const TagManagement = lazy(() => import('../pages/tag-management/TagManagement'));
const SubTag = lazy(() => import('../pages/tag-management/SubTag'));
const ProgressCreateQuestion = lazy(() => import('../pages/progress-settings/ProgressCreateQuestion'));
const UserManagement = lazy(() => import('../pages/user-management/UserManagement'));
const DepartmentManagement = lazy(() => import('../pages/department-management/DepartmentManagement'));

const routeManagement: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LazyLoad><Login /></LazyLoad> },
      { path: 'signup', element: <LazyLoad><Signup /></LazyLoad> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LazyLoad><Dashboard /></LazyLoad> },
      { path: 'user-management', element: <LazyLoad><UserManagement /></LazyLoad> },
      { path: 'question-bank', element: <LazyLoad><QuestionBank /></LazyLoad> },
      { path: 'progress-setting', element: <LazyLoad><ProgressCreateQuestion /></LazyLoad> },
      { path: 'department-management', element: <LazyLoad><DepartmentManagement /></LazyLoad>},
      {
        path: 'tag-management',
        children: [
          { index: true, element: <LazyLoad><TagManagement /></LazyLoad> },
          { path: 'tag-main/:id', element: <LazyLoad><SubTag /></LazyLoad> }
        ]
      }
    ]
  }
];

export default routeManagement;