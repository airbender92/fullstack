import React from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { Outlet } from 'react-router-dom';

interface MobxLayoutProps {
  children?: React.ReactNode;
}

const { Content } = Layout;

const MobxLayout: React.FC<MobxLayoutProps> = observer(({ children }) => {

  return (
    <Layout>
      <Content>
        {' '}
        <Outlet />
      </Content>
    </Layout>
  );
});

export default MobxLayout;
