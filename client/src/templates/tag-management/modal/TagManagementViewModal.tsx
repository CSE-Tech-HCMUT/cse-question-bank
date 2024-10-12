import { Button, Col, Form, Input, Modal, Row, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { ModalProps } from "../../../types/modal/modal";
import { Option } from "../../../types/option/option";

export const TagManagementViewModal: React.FC<ModalProps> = ({ isModalOpen, onClose, subTag }) => {
  const [form] = useForm();
  const [options, setOptions] = useState<Option[]>([]);
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


  return (
    <Modal
      title={<h1 className="text-2xl mb-4">Detail Tag</h1>}
      open={isModalOpen}
      loading={isLoading}
      onCancel={onClose}
      width={800}
      footer={
        <Button type="primary" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <Form
        name="ViewModalSubTag"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
            >
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
            >
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="option"
              label="Option"
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {options.map((option) => (
                  <Tag 
                    key={option.id} 
                    className="text-[16px] mb-2" 
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
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TagManagementViewModal;
