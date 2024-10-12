import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { ModalProps } from "../../../types/modal/modal";

export const TagManagementEditModal: React.FC<ModalProps> = ({ isModalOpen, onClose, mainTag }) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 
      console.log(values);
      onClose(); 
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  useEffect(() => { 
    if(mainTag) {
      form.setFieldsValue({
        name: mainTag.name,
        status: mainTag.status
      });
      setIsLoading(false);
    }
  })

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4">
          Edit Main Tag
        </h1>
      }
      open={isModalOpen}
      onCancel={onClose}
      loading={isLoading}
      onOk={onOk}
      width={800}
      okText={<span style={{ fontSize: '18px' }}>Confirm</span>}
      cancelText={<span style={{ fontSize: '18px' }}>Cancel</span>}
    >
      <Form
        name="EditModalMainTag"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={16}>
          <Col md={20} xs={16}>
            <Form.Item
              name="name"
              label={<span className="font-medium text-[16px]">Name</span>}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={4} xs={8}>
            <Form.Item
              name="status"
              label={<span className="font-medium text-[16px]">Status</span>}
            >
              <Select
                options={
                  [
                    { 
                      value: true, 
                      label: "Active"
                    },
                    { 
                      value: false, 
                      label: "Inactive"
                    },
                  ]
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TagManagementEditModal;
