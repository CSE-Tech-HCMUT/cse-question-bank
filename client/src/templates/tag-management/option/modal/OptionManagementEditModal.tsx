import { Col, Form, Input, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { ModalProps } from "../../../../types/modal/modal";

export const OptionManagementEditModal: React.FC<ModalProps> = ({ isModalOpen, onClose, option }) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => { 
    if (option) {
      form.setFieldsValue({
        name: option.name,
      });
      setIsLoading(false);
    }
  }, [option, form]);

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
      title={<h1 className="text-2xl mb-4">Update Tag</h1>}
      open={isModalOpen}
      onCancel={onClose}
      onOk={onOk}
      loading={isLoading}
      width={800}
      okText={<span style={{ fontSize: '18px' }}>Confirm</span>}
      cancelText={<span style={{ fontSize: '18px' }}>Cancel</span>}
    >
      <Form
        name="EditModalTag"
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

export default OptionManagementEditModal;
