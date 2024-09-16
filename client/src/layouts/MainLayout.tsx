import { Avatar, MenuProps } from "antd";
import React, { useCallback, useState } from "react"
import {
  ContainerOutlined,
  FileOutlined,
  HomeOutlined,
  CodeOutlined,
  UserOutlined
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
  getItem('Dashboard', '1', <HomeOutlined />),
  getItem('Question Bank', '2', <FileOutlined />),
  getItem('Exam Paper', '3', <ContainerOutlined />),
  getItem('Latex Compiler', '4', <CodeOutlined />),
  getItem('CKEditor Question', '5', <CodeOutlined />)
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
        navigate(PATH.QUESTION_BANK);
        setTitle('Question Bank');
        break;
      case 4:
        navigate(PATH.LATEX_COMPILER);
        setTitle('Latex Compiler');
        break;
      case 5:
        navigate(PATH.CKEDITOR_QUESTION);
        setTitle('CKEditor Question');
        break;

      default:
        setTitle('Dashboard');
        break;
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical"></div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick}/>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex items-center justify-end">
          <Avatar icon={<UserOutlined />} className="mr-[24px]"/>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} 
            items={[
              {
                title: 'User'
              },
              {
                title
              }
            ]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 470,
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
