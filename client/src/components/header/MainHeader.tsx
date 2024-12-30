import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { Header } from "antd/es/layout/layout"
import { changeLanguage } from "i18next";

interface MainHeaderProps {
    collapsed: boolean,
    setCollapsed: (collapsed: boolean) => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
    collapsed,
    setCollapsed,
  
}) => {    
    const handleChangeLanguage = (lang: "vi" | "en") => { 
        changeLanguage(lang);
    }

    return (
        <Header className="flex items-center justify-between" style={{ 
            padding: 0, 
            background: "#0388B4"
        }}>
            <Button
                className="!text-white font-semibold transition-all duration-300"
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {             
                    setCollapsed(!collapsed)
                }}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />

            <div className="flex items-center mr-4">
                <div className="account mr-2">
                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>T</Avatar>
                    <span className="text-white ml-2">NGUYEN SY THANH</span>
                </div>
                <div className="flex items-center justify-end">
                    <img
                        className="mr-2 hover:cursor-pointer transition-all duration-200"
                        src="https://mybk.hcmut.edu.vn/my/images/icon_lag_vietnam.png"
                        alt="vi_language"
                        onClick={() => handleChangeLanguage('vi')}
                    />
                    <img
                        className="hover:cursor-pointer transition-all duration-200"
                        src="https://mybk.hcmut.edu.vn/my/images/icon_lag_english.png"
                        alt="en_language"
                        onClick={() => handleChangeLanguage('en')}
                    />
                </div>
            </div>
        </Header>
    )
}

export default MainHeader