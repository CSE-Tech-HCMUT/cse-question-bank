import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { ModalProps } from "../../../../types/modal/modal";

export const OptionManagementViewModal: React.FC<ModalProps> = ({ isModalOpen, onClose, option }) => {
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


  return (
    <Modal
      title={<h1 className="text-2xl mb-4">Update Tag</h1>}
      open={isModalOpen}
      onCancel={onClose}
      loading={isLoading}
      width={800}
      footer={
        <Button type="primary" onClick={onClose}>
          Cancel
        </Button>
      }
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
              <Input disabled/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default OptionManagementViewModal;
