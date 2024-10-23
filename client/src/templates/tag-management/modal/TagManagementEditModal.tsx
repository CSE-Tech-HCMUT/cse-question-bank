import { Col, Form, Input, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { ModalProps } from "../../../types/modal/modal";
import { Option } from "../../../types/option/option";
import { useAppDispatch } from "../../../store";
import { updateTagByIdThunk } from "../../../store/tag-management/thunk";

export const TagManagementEditModal: React.FC<ModalProps> = ({ isModalOpen, onClose, tag }) => {
  const [form] = useForm();
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => { 
    if (tag) {
      form.setFieldsValue({
        name: tag.name,
        description: tag.description,
        options: '', 
      });
      setOptions(tag.options || []); 
      setIsLoading(false);
    }
  }, [tag, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 
      console.log({ ...values, options }); 

      dispatch(updateTagByIdThunk({ ...values, options}))
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
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TagManagementEditModal;
