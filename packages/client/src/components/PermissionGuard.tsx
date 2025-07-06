import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import usePermission from '@/hooks/usePermission';

interface PermissionGuardProps {
    children: React.ReactNode;
    permission: string;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, permission }) => {
    const {permissions} = usePermission();
    const location = useLocation();
    if (permission && !permissions.includes(permission) && location.pathname !== '/login') {
        return <Navigate to="/401" replace />;
    }

    return <>{children}</>;
};

export default PermissionGuard;