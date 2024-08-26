import { MenuProps } from "antd";
import React, { useCallback, useState } from "react"
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { PATH } from "../const/path";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem => { 
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Option', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Question Bank', '9', <FileOutlined />),
];

const MainLayout = React.memo(() => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState('Dashboard');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();  

  const handleMenuClick = useCallback((event: { key: React.Key }) => {
    switch (Number(event.key)) {
      case 1:
        navigate(PATH.DASHBOARD);
        setTitle('Dashboard');
        break;
      case 2:
        setTitle('Option');
        break;
      case 3:
        setTitle('Tom');
        break;
      case 4:
        setTitle('Bill');
        break;
      case 5:
        setTitle('Alex');
        break;
      case 6:
        setTitle('Team 1');
        break;
      case 8:
        setTitle('Team 2');
        break;
      case 9:
        navigate(PATH.QUESTION_BANK);
        setTitle('Question Bank');
        break;
      default:
        setTitle('Dashboard');
        break;
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick}/>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>{title}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Question Bank ©{new Date().getFullYear()} Created by TCT Team
        </Footer>
      </Layout>
    </Layout>
  );
})

export default MainLayout
