import { MainFooter, MainSidebar } from "@/components"
import MainHeader from "@/components/header/MainHeader"
import { Layout } from "antd"
import { useState } from "react"
import { Outlet } from "react-router-dom"

const { Content } = Layout

export const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout>
            <MainSidebar collapsed = {collapsed}/>
            <Layout>
                <MainHeader collapsed = {collapsed} setCollapsed={setCollapsed}/>
                <Content style={{ padding: '0 24px' }}>
                    <div
                        style={{
                            margin: '24px 0',
                            minHeight: 600,
                        }}
                        >
                            <Outlet />
                    </div>
                </Content>
                <MainFooter />
            </Layout>
        </Layout>
    )
}

export default MainLayout