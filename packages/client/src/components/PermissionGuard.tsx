import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/stores/useStore';
import { observer } from 'mobx-react'


interface PermissionGuardProps {
    children: React.ReactNode;
    permission: string;
}

const PermissionGuard: React.FC<PermissionGuardProps> = observer(({ children, permission }) => {
  const store = useStore();
  const { isLoggedIn, hasPermission } = store.LoginStore;
    const location = useLocation();

    if(isLoggedIn && permission && !hasPermission(permission)) {
        return <Navigate to="/401" replace />;
    }
    // 如果用户未认证，不进行权限检查
    if(!isLoggedIn) {
        return <Navigate to='/login' replace />
    }

    return <>{children}</>;
});

export default PermissionGuard;