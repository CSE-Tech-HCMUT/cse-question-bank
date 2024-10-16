import { Col, Form, Input, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { ModalProps } from "../../../../types/modal/modal";
import { useAppDispatch } from "../../../../store";

export const OptionManagementCreateModal: React.FC<ModalProps> = ({ isModalOpen, onClose }) => {
  const [form] = useForm();

  const dispatch = useAppDispatch();

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 

      onClose(); 
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4">
          Create Option
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
        name="CreateModalOption"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          
        </Row>
      </Form>
    </Modal>
  );
};

export default OptionManagementCreateModal;
