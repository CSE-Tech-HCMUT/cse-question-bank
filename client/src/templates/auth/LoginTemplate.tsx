import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { LoginType } from "../../types/auth/auth";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../const/path";

export const LoginTemplate = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<LoginType>['onFinish'] = (values) => {
    console.log('Success:', values);
    navigate(PATH.DASHBOARD);
  };
  
  const onFinishFailed: FormProps<LoginType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className="bg-white w-[80%] h-[85%] md:h-[70%] lg:w-[30%] md:w-[60%] lg:h-[80%] mx-auto">
        <Row>
          <Col span={24} className="flex justify-center items-center flex-col scale-75 -mt-4">
            <img src="/src/assets/image/auth.png" alt="auth.png" loading="lazy"/>
            <h1 className="text-[50px] font-semibold mt-4">Login</h1>
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
                  <p className="font-medium">Username</p>
                }
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<LoginType>
                label={
                  <p className="font-medium">Password</p>
                }
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <p className="text-right text-[#6674BB] font-medium hover:cursor-pointer hover:text-[#2a387c] transition duration-150 mb-4 -mt-2">
                Forgot Password?
              </p>

              <Form.Item>
                <Button className="w-full bg-[#6674BB] font-semibold hover:!bg-[#5363b1] flex justify-center items-center transition duration-150" type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>

              <p className="mb-4 text-center">
                Not a member? <span 
                  className="text-[#6674BB] font-medium hover:cursor-pointer hover:text-[#2a387c] transition duration-150"
                  onClick={
                    () => { navigate(PATH.AUTH + PATH.SIGNUP) }
                  }
                >
                  Sign up now
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
