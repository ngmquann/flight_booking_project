

import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import NavbarWeb from '../../components/web/NavbarWeb';
import FooterWeb from '../../components/web/FooterWeb';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
export default function CommonWeb() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <NavbarWeb/>
        <Content
          style={{
            padding: '0 48px',
          }}
        >
          <Layout
            style={{
              padding: '24px 0',
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Content
              style={{
                padding: '0 24px',
                minHeight: 280,
              }}
            >
              <Outlet /> 
            </Content>
          </Layout>
        </Content>
      <FooterWeb/>
    </Layout>
  );
};