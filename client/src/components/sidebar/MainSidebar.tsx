import { Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import React from "react"
import {
  AiFillHome,
  AiFillQuestionCircle,
  AiFillRead,
  AiFillTags,
} from 'react-icons/ai'
import {
  BsBank,
  BsFillPassFill,
} from 'react-icons/bs';
import '../../styles/sidebar/MainSidebar.scss'
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PATH from "@/const/path";

interface MainSidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ collapsed }) => {
  const { t } = useTranslation('main_layout');  

  const navigate = useNavigate();
  const { subjectName } = useParams();

  const items: MenuItem[] = [
    { label: t("sidebar.dashboard"), key: '1', icon: <AiFillHome className="!hover:text-black" size={"18px"} color="white"/> },
    { label: t("sidebar.question"), key: '2', icon: <AiFillQuestionCircle className="!hover:text-black" size={"18px"} color="white"/>,
      children: [
        { label: t("sidebar.bank question"), key: '2-1', icon: <BsBank className="!hover:text-black" size={"18px"} color="white"/> },
        // { label: t("sidebar.assigned question"), key: '2-2', icon: <BsFillPassFill className="!hover:text-black" size={"18px"} color="white"/> },
        { label: t("sidebar.tag management"), key: '2-3', icon: <AiFillTags className="!hover:text-black" size={"18px"} color="white"/> },
      ] 
    },
    { label: t("sidebar.exam"), key: '3', icon: <AiFillRead className="!hover:text-black" size={"18px"} color="white"/>,
      children: [
        { label: t("sidebar.bank exam"), key: '3-1', icon: <BsBank className="!hover:text-black" size={"18px"} color="white"/> },
        { label: t("sidebar.assigned exam"), key: '3-2', icon: <BsFillPassFill className="!hover:text-black" size={"18px"} color="white"/> },
      ] 
    }
  ]

  const handleClick = (info: { key: React.Key }) => { 
    const key = info.key.toString();
    switch(key){
      case "1":
        navigate(PATH.DASHBOARD.replace(':subjectName', subjectName!)); 
        break;
      case "2-1":
        navigate(PATH.QUESTION_MANAGEMENT.replace(':subjectName', subjectName!)); 
        break;
      case "2-2":
        console.log("Assigned question clicked");
        break;
      case "2-3":
        navigate(PATH.TAG_MANAGEMENT.replace(':subjectName', subjectName!)); 
        break;
      default:
        navigate(PATH.DASHBOARD)
        break;
    }
  }

  return (
    <Sider className="bg-[#222D32]" trigger={null} collapsible collapsed={collapsed}>
        <div 
          className="top bg-[#357CA5] flex items-center justify-center text-xl text-white font-semibold"
          style={{
            height: 64,
          }}
        >
          {
            collapsed ? "BQ" : t("bank question title")
          }
        </div>
        <div className="logo p-2 flex items-center">
          <img src="/src/assets/images/hcmut.png" alt="logoHcmut" style={
            {
              height: "auto",
              maxWidth: 60
            }
          }/>
          {
            collapsed ? <></> : 
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-white text-[13px]">NGUYEN SY THANH</p>
              <p className="text-white text-[12px]">Khoa Khoa học và Kỹ thuật Máy tính</p>
            </div>
          }
        </div>
        <Menu
          className="custom-menu bg-[#222D32]"
          mode="inline"  
          defaultSelectedKeys={['1']}
          items={items}
          onClick={handleClick}
        />
      </Sider>
  )
}

export default MainSidebar