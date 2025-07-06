import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import BreadcrumbComponent from '@/components/Breadcrumb';
import useAuth from '@/hooks/useAuth';

interface BasicLayoutProps {
  children?: React.ReactNode;
}

const { Header, Sider, Content, Footer } = Layout;

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const auth = useAuth();
  // Replace 'roles' with the correct property from AuthState if needed
  const permissions = (auth as any).permissions || [];
  
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <SideMenu permissions={permissions} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <BreadcrumbComponent />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children || <Outlet />}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
