import { HomeFooter, HomeHeader } from "@/components";
import { Layout } from "antd"
import { Outlet } from "react-router-dom";

const { Content } = Layout

export const HomeLayout = () => {
    return (
        <Layout>
            <HomeHeader />
            <Content style={{ padding: '0 48px' }}>
                <div
                    style={{
                        margin: '30px 0',
                        padding: 24,
                        minHeight: 600,
                    }}
                    >
                        <Outlet />
                </div>
            </Content>
            <HomeFooter />
        </Layout>
    )
}

export default HomeLayout