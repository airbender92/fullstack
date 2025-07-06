import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Login from '@/pages/Login';
import LotteryChart from '@/pages/Lottery';

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
];

export default routes;