// src/components/Breadcrumb.tsx
import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const BreadcrumbComponent: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = pathSnippets.map((path, index) => {
    const routeTo = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSnippets.length - 1;
    return (
      <Breadcrumb.Item key={routeTo}>
        {isLast ? (
          <span>{path}</span>
        ) : (
          <a href={routeTo}>{path}</a>
        )}
      </Breadcrumb.Item>
    );
  });

  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
      {breadcrumbItems}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;