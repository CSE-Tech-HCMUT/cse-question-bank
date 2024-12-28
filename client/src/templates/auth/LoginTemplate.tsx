import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { LoginType } from "@/types/auth";
import PATH from "@/const/path";
import { useTranslation } from "react-i18next";

export const LoginTemplate = () => {
  const { t } = useTranslation('login')

  const navigate = useNavigate();

  const onFinish: FormProps<LoginType>['onFinish'] = (values) => {
    console.log('Success:', values);
    localStorage.setItem('user', JSON.stringify(values));
    navigate(PATH.SUBJECT_MANAGEMENT);
  };
  
  const onFinishFailed: FormProps<LoginType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className="bg-white w-[80%] h-[85%] md:h-[70%] lg:w-[30%] md:w-[60%] lg:h-[80%] mx-auto">
        <Row>
          <Col span={24} className="flex justify-center items-center flex-col scale-75 -mt-4">
            <img src="/src/assets/images/auth.png" alt="auth.png" loading="lazy"/>
            <h1 className="text-[50px] font-semibold mt-4">{t("login")}</h1>
          </Col>
          <Col span={24} className="flex justify-center items-center -mt-8">
            <Form
              name="loginForm"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              style={{ maxWidth: 600 }}
              className="w-[90%]"
            >
              <Form.Item<LoginType>
                label={
                  <p className="font-medium">{t("username")}</p>
                }
                name="username"
                rules={[{ required: true, message: t("placeholderUsername") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<LoginType>
                label={
                  <p className="font-medium">{t("password")}</p>
                }
                name="password"
                rules={[{ required: true, message: t("placeholderPassword") }]}
              >
                <Input.Password />
              </Form.Item>

              <p className="text-right text-[#0388B4] font-medium hover:cursor-pointer hover:text-[#1f4654] transition duration-150 mb-4 -mt-2">
                {t("forgotPassword")}
              </p>

              <Form.Item>
                <Button className="w-full font-semibold flex justify-center items-center transition duration-150" type="primary" htmlType="submit">
                  {t("login")}
                </Button>
              </Form.Item>

              <p className="mb-4 text-center">
                {t("notMember")} <span 
                  className="text-[#0388B4] font-medium hover:cursor-pointer hover:text-[#1f4654] transition duration-150" 
                  onClick={
                    () => { navigate(PATH.SIGNUP) }
                  }
                >
                  {t("signup")}
                </span>
              </p>
                
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LoginTemplate;
