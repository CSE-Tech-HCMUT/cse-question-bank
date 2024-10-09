import { Avatar, MenuProps, Drawer, Button } from "antd";
import React, { useCallback, useState, useEffect } from "react";
import {
  FileOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  TagOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { PATH } from "../const/path";
import '../style/style.scss'

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
};

const items: MenuItem[] = [
  getItem("Dashboard", "1", <HomeOutlined />),
  getItem("Question Bank", "2", <FileOutlined />),
  getItem("Progress Settings", "3", <SettingOutlined />),
  getItem("Tag Management", "4", <TagOutlined />),
  getItem("User", "5", <UsergroupAddOutlined   />),
];

const MainLayout = React.memo(() => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("Dashboard");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = useCallback(
    (event: { key: React.Key }) => {
      switch (Number(event.key)) {
        case 1:
          navigate(PATH.DASHBOARD);
          setTitle("Dashboard");
          break;
        case 2:
          navigate(PATH.QUESTION_BANK);
          setTitle("Question Bank");
          break;
        case 3:
          navigate(PATH.PROGRESS_SETTINGS);
          setTitle("Progress Settings");
          break;
        case 4:
          navigate(PATH.TAG_MANAGEMENT);
          setTitle("Tag Management");
          break;
        case 5:
          navigate(PATH.USER_MANAGEMENT);
          setTitle("User");
          break;
        default:
          setTitle("Dashboard");
          break;
      }
      setDrawerVisible(false); // Close drawer on menu item click
    },
    [navigate]
  );

  return (
    <Layout className="MainLayout" style={{ minHeight: "100vh", width: isSmallScreen ? '100vw' : 'auto' }}>
      {/* Sidebar for md and larger screens */}
      {!isSmallScreen && (
        <Sider className="!bg-[#6674BB]" collapsible collapsed={collapsed} onCollapse={setCollapsed} >
          <div 
            className="title text-center text-[white] my-6 font-bold" 
            style={{
              fontSize: "30px",
              marginBottom: collapsed ? "85px" : "40px" 
            }}
          > 
            {
              !collapsed ? <>
                BANK <br /> QUESTION 
              </> : <>
                BQ
              </>
            }
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
            className="bg-[#6674BB]"
          />
        </Sider>
      )}

      <Layout>
        <Header
          style={{ padding: "0 16px", background: colorBgContainer }}
          className="flex items-center justify-between md:justify-end"
        >
          <Button
            type="primary"
            onClick={() => setDrawerVisible(true)}
            style={{ display: isSmallScreen ? 'block' : 'none' }} // Show button only on small screens
          >
            Menu
          </Button>
          <Avatar icon={<UserOutlined />} className="mr-[16px]" />
        </Header>

        <Content style={{ margin: "16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title }]}
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
        <Footer style={{ textAlign: "center", backgroundColor: "#E5EAFF" }}>
          Question Bank ©{new Date().getFullYear()} Created by TCT Team
        </Footer>

        {/* Full-Screen Menu Drawer */}
        <Drawer
          title="Menu"
          placement="right"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width="100%"
        >
          <Menu
            mode="inline"
            items={items}
            onClick={handleMenuClick}
            style={{ width: "100%" }}
          />
        </Drawer>
      </Layout>
    </Layout>
  );
});

export default MainLayout;
