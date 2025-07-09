import React from 'react';
import { Layout, Dropdown, Menu, message, Avatar } from 'antd';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons'
import { Link, Outlet } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import BreadcrumbComponent from '@/components/Breadcrumb';
import { useStore } from '@/stores/useStore'
import { observer } from 'mobx-react'

interface BasicLayoutProps {
  children?: React.ReactNode;
}

const { Header, Sider, Content, Footer } = Layout;

const BasicLayout: React.FC<BasicLayoutProps> = observer(({ children }) => {
   const [msgApi, msgHolder] = message.useMessage(); // 使用 hooks API
  const store = useStore();
   const { permissions, logout } = store.LoginStore;

  const logoutHandler = () => {
    logout();
    msgApi.success('登出成功');
  };

    const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={logoutHandler} icon={<LogoutOutlined />}>
        登出
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="layout">
        {msgHolder}
      <Header>
        <div className="logo" />
        <div style={{ float: 'right', marginRight: 20 }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar style={{ marginRight: 8 }} icon={<UserOutlined />} />
              用户名
            </a>
          </Dropdown>
        </div>
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
});

export default BasicLayout;
