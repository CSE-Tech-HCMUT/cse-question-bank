import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { SimpleQuestion } from "../../../types/question/question";
import MyEditorPlus from "../../../components/MyEditorPlus";

interface QuestionBankEditModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    question: SimpleQuestion;
}

const QuestionBankEditModal: React.FC<QuestionBankEditModalProps> = ({ isModalOpen, onClose, question }) => {
  const [form] = Form.useForm();
  const [simpleQuestion, setSimpleQuestion] = useState<SimpleQuestion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        type: question.type,
        difficult: question.difficult,
      });
      setSimpleQuestion(question);
      setIsLoading(false); 
    }
  }, [question, form]);

  const addAnswer = useCallback(() => {
    if(simpleQuestion) {
      setSimpleQuestion(prev => ({
        ...prev!,
        answer: [
          ...prev!.answer, 
          { id: String(Date.now()), content: '', isCorrect: false }]
      }))
    }
  }, [simpleQuestion]);


  const handleQuestionChange = useCallback((content: string) => {
    if (simpleQuestion && simpleQuestion.content !== content) {
      setSimpleQuestion(prev => ({ ...prev!, content }));
    }
  }, [simpleQuestion]);

  const handleAnswerChange = useCallback((answerId: string, content: string) => {
    if (simpleQuestion) {
      setSimpleQuestion(prev => ({
        ...prev!,
        answer: prev!.answer.map(ans =>
          ans.id === answerId ? { ...ans, content } : ans
        )
      }));
    }
  }, [simpleQuestion]);

  const handleAnswerTrigger = useCallback((answerId: string) => {
    if(simpleQuestion){
      setSimpleQuestion(prev => ({
        ...prev!,
        answer: prev!.answer.map(ans =>
          ans.id === answerId ? { ...ans, isCorrect: !ans.isCorrect } : ans
        )
      }))
    }
  }, [simpleQuestion]);

  const removeAnswer = useCallback((answerId: string) => {
    if(simpleQuestion){
      setSimpleQuestion(prev => ({
       ...prev!,
        answer: prev!.answer.filter(ans => ans.id!== answerId)
      }));
    }
  }, [simpleQuestion]);

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
      okText={<span style={{ fontSize: '18px' }}>Create</span>} 
      cancelText={<span style={{ fontSize: '18px' }}>Cancel</span>} 
    >
      <Form form={form} name="EditModalQuestion" layout="vertical" autoComplete="off">
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
              label={<span className="font-medium text-[16px]">Question Difficult</span>}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="content"
              label={<span className="font-medium text-[16px]">Question Content</span>}
            >
              <MyEditorPlus
                content={simpleQuestion?.content || ""}
                placeholder='Please Enter Question'
                onChange={handleQuestionChange}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <h2 className="text-[16px] font-medium mb-4">Answers</h2>
          </Col>
          {simpleQuestion?.answer.map((answer) => (
            <Row key={answer.id} className="answer-row" gutter={[16, 16]}>
              <Col span={20}>
                <Form.Item>
                  <MyEditorPlus
                    content={answer.content || ""}
                    placeholder='Enter answer'
                    onChange={(newContent) => handleAnswerChange(answer.id, newContent)}
                  />
                </Form.Item>
              </Col>
              <Col xs={4} md={4} className="flex mt-12 justify-center items-center">
                <Button
                  type="primary"
                  ghost
                  className="mr-2"
                  onClick={() => handleAnswerTrigger(answer.id)}
                >
                  {answer.isCorrect ? 'T' : 'F'}
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeAnswer(answer.id)}
                />
              </Col>
            </Row>
          ))}
          <Col span={24} >
            <Button className="text-[18px]" type="link" onClick={addAnswer}>
              <PlusOutlined /> Add Answer
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default QuestionBankEditModal;
