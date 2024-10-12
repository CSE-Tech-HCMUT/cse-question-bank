import { Button, Col, Form, Input, Modal, Row, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { ModalProps } from "../../../types/modal/modal";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";

export const DepartmentManagementCreateModal: React.FC<ModalProps> = ({ isModalOpen, onClose }) => {
  const [form] = useForm();
  const [subjects, setSubjects] = useState<string[]>([]);

  const onOk = async () => {
    try {
      const values = await form.validateFields(); 
      console.log({ ...values, subjects: subjects }); 
      onClose(); 
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const addSubject = () => {
    const subjectsValue = form.getFieldValue('subjects');
    if (subjectsValue && !subjects.includes(subjectsValue)) {
      
      setSubjects([...subjects, subjectsValue]);
      form.resetFields(['subjects']); 
    }
  };

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4 md:text-left text-center">
          Create Department
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
        name="CreateModalMainTag"
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
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

          <Col span={24}>
            <Form.Item
              name="subjects"
              label="Subject"
            >
              <div className="flex justify-between items-center">
                <Input style={{ flex: 1, marginRight: 8 }} />
                <Button 
                  htmlType="button" 
                  type="primary"
                  icon={<FaPlusCircle />}
                  onClick={addSubject}
                >
                  Add 
                </Button>
              </div>
            </Form.Item>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {subjects.map((subject) => (
                <Tag 
                  key={subject} 
                  className="text-[16px] mb-2" 
                  closable 
                  onClose={() => setSubjects(subjects.filter((subjectKey) => subject !== subjectKey))}
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    color: '#595959', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    padding: '4px 10px'
                  }}
                >
                  {subject}
                </Tag>
              ))}
            </div>
          </Col>

        </Row>
      </Form>
    </Modal>
  );
};

export default DepartmentManagementCreateModal;
