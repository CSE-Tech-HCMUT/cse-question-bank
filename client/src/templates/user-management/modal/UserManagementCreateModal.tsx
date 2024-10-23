import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { ModalProps } from "../../../types/modal/modal";

export const UserManagementCreateModal: React.FC<ModalProps> = ({ isModalOpen, onClose }) => {
  const [form] = useForm();
  const optionRoles = [
    {
      value: 1,
      label: 'Admin',
    },
    {
      value: 0,
      label: 'User',
    }
  ]

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 
      console.log(values);
      onClose(); 
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4 md:text-left text-center">
          Create User
        </h1>
      }
      open={isModalOpen}
      onCancel={onClose}
      onOk={onOk}
      width={800}
      okText={<span style={{ fontSize: '18px' }}>Create</span>}
      cancelText={<span style={{ fontSize: '18px' }}>Cancel</span>}
    >
      <Form
        name="CreateModalUser"
        layout="vertical"
        autoComplete="off"
        form={form}
        initialValues={
          {
            ["role"]: 0
          }
        }
      >
        <Row gutter={16}>
          <Col md={12} xs={24}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: 'Please input the name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: 'Please input the full name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input the password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: 'Please confirm the password name!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
              <Form.Item
                name="role"
                label="Role"
                rules={[
                  {
                    required: true,
                    message: 'Please select the role!',
                  },
                ]}
              >
                <Select options={optionRoles} />
              </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserManagementCreateModal;
