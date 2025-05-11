import { Header } from "antd/es/layout/layout";
import "../../styles/header/HomeHeader.scss";
import { Avatar, Button } from "antd";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PATH from "@/const/path";
import { useEffect, useState } from "react";

export const HomeHeader = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const [user, setUser] = useState("");

  const handleChangeLanguage = (lang: "vi" | "en") => {
    changeLanguage(lang);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("access-token");
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate(PATH.LOGIN);
    }
  }, []);

  return (
    <Header className="home-header">
      {/* left */}
      <div className="flex items-center">
        <div className="logo">
          <img
            className="responsive-img"
            src="/src/assets/images/hcmut.png"
            alt="logoHcmut"
          />
        </div>
        <span className="font-semibold md:text-[20px] lg:text-xl leading-8 text-[10px] text-white">
          {t("header.vietnam national university ho chi minh city")}
          <br />
          {t("header.ho chi minh city university of technology")}
        </span>
      </div>

      {/* right */}
      <div className="flex flex-col mb-4">
        {/* Top */}
        <div className="flex items-center justify-end">
          <span className="font-semibold md:text-[18px]  text-white mr-4">
            {t("header.language")}
          </span>
          <img
            className="mr-2 hover:cursor-pointer transition-all duration-200"
            src="https://mybk.hcmut.edu.vn/my/images/icon_lag_vietnam.png"
            alt="vi_language"
            onClick={() => handleChangeLanguage("vi")}
          />
          <img
            className="hover:cursor-pointer transition-all duration-200"
            src="https://mybk.hcmut.edu.vn/my/images/icon_lag_english.png"
            alt="en_language"
            onClick={() => handleChangeLanguage("en")}
          />
        </div>

        {!user ? (
          <div className="flex items-center justify-end">
            <Button className="custom-button mr-4">{t("header.signup")}</Button>
            <Button className="custom-button">{t("header.login")}</Button>
          </div>
        ) : (
          <div className="account flex items-center !h-8">
            <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
              T
            </Avatar>
            <span className="text-white ml-2">Tran Minh Thuan</span>
          </div>
        )}
      </div>
    </Header>
  );
};

export default HomeHeader;
