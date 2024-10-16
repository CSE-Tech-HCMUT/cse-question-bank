import { Button, Col, Form, Input, Modal, Row, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { ModalProps } from "../../../types/modal/modal";
import { Option } from "../../../types/option/option";
import { useAppDispatch } from "../../../store";
import { createTagThunk } from "../../../store/tag-management/thunk";

export const TagManagementCreateModal: React.FC<ModalProps> = ({ isModalOpen, onClose }) => {
  const [form] = useForm();
  const [options, setOptions] = useState<Option[]>([]);

  const dispatch = useAppDispatch();

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 

      dispatch(createTagThunk({
        ... values,
        options
      }))
      onClose(); 
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const addOption = () => {
    const optionValue = form.getFieldValue('options');
    if (optionValue && !options.includes(optionValue)) {
      setOptions([...options, {
        name: optionValue
      }]);
      form.resetFields(['options']); 
    }
  };

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4">
          Create Tag
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
        name="CreateModalTag"
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
          <Col span={24}>
            <Form.Item
              name="options"
              label="Option"
            >
              <div className="flex justify-between items-center">
                <Input style={{ flex: 1, marginRight: 8 }} />
                <Button 
                  htmlType="button" 
                  type="primary"
                  icon={<FaPlusCircle />}
                  onClick={addOption}
                >
                  Add 
                </Button>
              </div>
            </Form.Item>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {options.map((option) => (
                <Tag 
                  key={option.name} 
                  className="text-[16px] mb-2" 
                  closable 
                  onClose={() => setOptions(options.filter((optionKey) => option !== optionKey))}
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    color: '#595959', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    padding: '4px 10px'
                  }}
                >
                  {option.name}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TagManagementCreateModal;
