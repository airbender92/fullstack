import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Login from '@/pages/Login';
import LotteryChart from '@/pages/Lottery';
import Page401 from '@/pages/Page401'
import Page404 from '@/pages/Page404'
type AppRouteObject = RouteObject & {
    permission?: string;
};

const routes: AppRouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/lottery" replace />
    },
    {
        path: '/lottery',
        element: <LotteryChart />,
        permission: 'lottery', // 示例：添加自定义属性
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/401',
        element: <Page401 />,
    },
     {
        path: '*',
        element: <Page404 />,
    },
];

export default routes;