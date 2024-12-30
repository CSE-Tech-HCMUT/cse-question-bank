import PATH from "@/const/path";
import { RegisterType } from "@/types/auth";
import { Button, Col, Form, FormProps, Input, Row } from "antd"
import { useNavigate } from "react-router-dom";

export const SignupTemplate = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<RegisterType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed: FormProps<RegisterType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="bg-white w-[80%] h-[85%] md:h-[70%] lg:w-[30%] md:w-[60%] lg:h-[90%] mx-auto">
      <Row>
        <Col span={24} className="flex justify-center items-center flex-col scale-75 -mt-4">
          <img src="/src/assets/images/auth.png" alt="auth.png" loading="lazy"/>
          <h1 className="text-[50px] font-semibold mt-4">Sign Up</h1>
        </Col>
        <Col span={24} className="flex justify-center items-center -mt-8">
          <Form
            name="registerForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{ maxWidth: 600 }}
            className="w-[90%]"
          >
            <Form.Item<RegisterType>
              label={
                <p className="font-medium">Username</p>
              }
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<RegisterType>
              label={
                <p className="font-medium">Password</p>
              }
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<RegisterType>
              label={
                <p className="font-medium">Confirm Password</p>
              }
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button className="w-full font-semibold flex justify-center items-center transition duration-300 mt-4" type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>

            <p className="-mt-2 text-center">
              Already have an account? <span 
                className="text-[#0388B4] font-medium hover:cursor-pointer hover:text-[#1f4654] transition duration-150" 
                onClick={
                  () => { navigate(PATH.LOGIN) }
                }>
                Login now
                </span>
            </p>
              
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default SignupTemplate