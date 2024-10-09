import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { ModalProps } from "../../types/modal/modal";

export const UserManagementViewModal: React.FC<ModalProps> = ({ isModalOpen, onClose, user }) => {
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

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4 md:text-left text-center">
          Detail User
        </h1>
      }
      open={isModalOpen}
      onCancel={onClose}
      width={800}
      footer={
        <Button type="primary" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <Form
        name="ViewModalUser"
        layout="vertical"
        autoComplete="true"
        form={form}
        initialValues={
          {
            ["username"]: user?.username,
            ["fullname"]: user?.fullname,
            ["password"]: user?.password,
            ["role"]: user?.role 
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
              <Input disabled/>
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
              <Input disabled/>
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
              <Input.Password disabled/>
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
                <Select options={optionRoles} disabled/>
              </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserManagementViewModal;
