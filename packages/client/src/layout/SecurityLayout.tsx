// client/src/layout/SecurityLayout.tsx
import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useStore } from '@/stores/useStore'
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react'

interface SecurityLayoutProps {
  children?: React.ReactNode;
}

const { Content } = Layout;

const SecurityLayout: React.FC<SecurityLayoutProps> = observer(({ children }) => {
  const store = useStore();
  const { isLoggedIn } = store.LoginStore;
  const navigate = useNavigate();
  const location = useLocation();

  // 只有在认证状态确定且未认证时才重定向
  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <Content>
        {/* 使用 Outlet 渲染子路由 */}
        {isLoggedIn ? <Outlet /> : null}
      </Content>
    </Layout>
  );
});

export default SecurityLayout;
