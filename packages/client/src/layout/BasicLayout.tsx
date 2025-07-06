import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

interface BasicLayoutProps {
  children?: React.ReactNode;
}

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/profile">个人中心</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">{<Outlet />}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2024 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
