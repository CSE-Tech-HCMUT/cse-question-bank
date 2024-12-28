import { AuthLayout, HomeLayout, MainLayout } from "@/layouts";
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyLoad } from "@/components/lazyload";
import { ExamManagement } from "@/pages";

const Login = lazy(() => import("@/pages/auth/Login"));
const Exam = lazy(() => import("@/pages/auth/SignUp"));
const Home = lazy(() => import("@/pages/home/Home"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const TagManagement = lazy(() => import("@/pages/question/tag-management/TagManagement"));
const QuestionManagement = lazy(() => import("@/pages/question/question-management/QuestionManagement"));
const QuestionCreation = lazy(() => import("@/pages/question/question-creation/QuestionCreation"));
const ExamCreation = lazy(() => import("@/pages/exam/exam-creation/ExamCreation"));
const SubjectManagement = lazy(() => import("@/pages/subject-management/SubjectManagement"));


export const routeManagement: RouteObject[] = [
    {
        element: <AuthLayout />,
        path: 'auth',
        children: [
            {
                path: "login",
                element: <LazyLoad> <Login /> </LazyLoad>
            },
            {
                path: "signup",
                element: <LazyLoad> <Exam /> </LazyLoad>
            }
        ]
    },
    {
        element: <HomeLayout />,
        children: [
            {
                path: "/",
                element: <LazyLoad> <Home /> </LazyLoad>
            },
            {
                path: "subject-management",
                element: <LazyLoad> <SubjectManagement /> </LazyLoad>
            }
        ]
    },
    {
        path: "question-bank/:subjectName",
        element: <MainLayout />,
        children: [
            {
                path: "dashboard",
                element: <LazyLoad> <Dashboard /> </LazyLoad>
            },
            {
                path: "tag-management",
                element: <LazyLoad> <TagManagement /> </LazyLoad>
            },
            {
                path: "question-management",
                element: <LazyLoad> <QuestionManagement /> </LazyLoad>
            },
            {
                path: "question-creation/:idQuestion",
                element: <LazyLoad> <QuestionCreation /> </LazyLoad>
            },
            {
                path: "exam-creation/:idExam",
                element: <LazyLoad> <ExamCreation /> </LazyLoad>
            },
            {
                path: "exam-management",
                element: <LazyLoad> <ExamManagement /> </LazyLoad>
            }
        ]
    }
]