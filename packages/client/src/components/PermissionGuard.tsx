import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import usePermission from '@/hooks/usePermission';
import useAuth from '@/hooks/useAuth';

interface PermissionGuardProps {
    children: React.ReactNode;
    permission: string;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, permission }) => {
    const { isAuthenticated } = useAuth();
    const {hasPermission, loading} = usePermission();
    const location = useLocation();

    if(loading) {
        return <div>加载权限中。。。</div>
    }
    // 如果用户未认证，不进行权限检查
    if(!isAuthenticated) {
        return <Navigate to='/login' replace />
    }
    if (permission && !hasPermission(permission) && location.pathname !== '/401') {
        return <Navigate to="/401" replace />;
    }

    return <>{children}</>;
};

export default PermissionGuard;