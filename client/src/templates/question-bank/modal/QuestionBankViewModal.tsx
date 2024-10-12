import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { SimpleQuestion } from "../../../types/question/question";

interface QuestionBankViewModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    question: SimpleQuestion;
}

const QuestionBankViewModal: React.FC<QuestionBankViewModalProps> = ({ isModalOpen, onClose, question }) => {
  const [form] = Form.useForm();
  const [simpleQuestion, setSimpleQuestion] = useState<SimpleQuestion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        type: question.type,
        difficult: question.difficult,
        content: question.content,
      });
      setSimpleQuestion(question);
      setIsLoading(false); 
    }
  }, [question, form]);

  const handleOk = () => {
    console.log(simpleQuestion);
    onClose();
  };

  return (
    <Modal 
      title={<h1 className="text-2xl mb-4">Question Details</h1>} 
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={onClose} 
      width={800}
      loading={isLoading}
      footer={null}
    >
      <Form form={form} name="ViewModalQuestion" layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="type"
              label={<span className="font-medium text-[16px]">Question Type</span>}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="difficult"
              label={<span className="font-medium text-[16px]">Question Difficulty</span>}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="content"
              label={<span className="font-medium text-[16px]">Question Content</span>}
            >
              <Input.TextArea disabled rows={4} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <h2 className="text-[16px] font-medium mb-4">Answers</h2>
          </Col>
          {simpleQuestion?.answer.map((answer) => (
            <Row key={answer.id} className="answer-row w-full" gutter={[16, 16]}>
              <Col xs={22} md={22}>
                <Form.Item>
                  <Input disabled value={answer.content!} />
                </Form.Item>
              </Col>
              <Col xs={2} md={2} className="mb-[-15px] md:mb-[23px]">
                <Button
                  type="primary"
                  ghost
                  disabled
                >
                  {answer.isCorrect ? 'T' : 'F'}
                </Button>
              </Col>
            </Row>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default QuestionBankViewModal;
