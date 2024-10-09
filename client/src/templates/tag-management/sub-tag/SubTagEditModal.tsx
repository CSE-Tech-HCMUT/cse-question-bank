import { Button, Col, Form, Input, Modal, Row, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { ModalProps } from "../../../types/modal/modal";

export const SubTagEditModal: React.FC<ModalProps> = ({ isModalOpen, onClose, subTag }) => {
  const [form] = useForm();
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => { 
    if (subTag) {
      form.setFieldsValue({
        name: subTag.name,
        description: subTag.description,
        option: '', 
      });
      setOptions(subTag.option || []); 
      setIsLoading(false);
    }
  }, [subTag, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 
      console.log({ ...values, options }); 
      onClose(); 
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const addOption = () => {
    const optionValue = form.getFieldValue('option');
    if (optionValue && !options.includes(optionValue)) {
      setOptions((prevOptions) => [...prevOptions, optionValue]);
      form.resetFields(['option']); 
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions((prevOptions) => prevOptions.filter((option) => option !== optionToRemove)); 
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
        name="EditModalSubTag"
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
              name="option"
              label="Option"
            >
              <div className="flex justify-between items-center">
                <Input 
                  style={{ flex: 1, marginRight: 8 }} 
                  onChange={(e) => form.setFieldsValue({ option: e.target.value })} 
                />
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
                  key={option} 
                  className="text-[16px] mb-2" 
                  closable 
                  onClose={() => removeOption(option)} // Use the new remove function
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    color: '#595959', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    padding: '4px 10px'
                  }}
                >
                  {option}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SubTagEditModal;
