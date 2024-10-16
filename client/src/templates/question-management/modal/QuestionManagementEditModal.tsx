import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Question } from "../../../types/question/question";
import { useForm } from "antd/es/form/Form";
import { ModalProps } from "../../../types/modal/modal";
import MyEditorPlus from "../../../components/MyEditorPlus";
import { TagManagement } from "../../../types/tag/tag";

const { Option } = Select;

const QuestionManagementEditModal: React.FC<ModalProps> = ({ isModalOpen, onClose, question }) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const availableTags: TagManagement[] = [
    {
      id: 1,
      name: 'Difficult',
      description: 'Độ khó của câu hỏi',
      option: [
        { id: 1, name: 'Easy', tagID: 1 },
        { id: 2, name: 'Normal', tagID: 1 },
        { id: 3, name: 'Hard', tagID: 1 }
      ]
    },
    {
      id: 2,
      name: 'Topic',
      description: 'Chủ đề của môn học',
      option: [
        { id: 1, name: 'Sort', tagID: 2 },
        { id: 2, name: 'Stack', tagID: 2 },
        { id: 3, name: 'Queue', tagID: 2 }
      ]
    },
    {
      id: 3,
      name: 'Level',
      description: 'Mức độ câu hỏi',
      option: [
        { id: 1, name: 'Thông hiểu', tagID: 3 },
        { id: 2, name: 'Vận dụng', tagID: 3 },
        { id: 3, name: 'Cơ bản', tagID: 3 }
      ],
    }
  ];

  const initialQuestion: Question = question! || {
    id: String(Date.now()),
    content: '',
    answer: [],
    tags: availableTags.map(tag => ({
      ...tag,
    })),
  };

  const [questionEdit, setQuestionEdit] = useState<Question>(initialQuestion);

  useEffect(() => {
    if (question) {
      setQuestionEdit(question);
      form.setFieldsValue({ content: question.content });
    } else {
      setQuestionEdit(initialQuestion);
    }
    setIsLoading(false);
  }, [question, form]);

  // Answer Management
  const addAnswer = useCallback(() => {
    setQuestionEdit(prev => ({
      ...prev,
      answer: [...prev.answer, { id: String(Date.now()), content: '', isCorrect: false }],
    }));
  }, []);

  const handleAnswerChange = useCallback((answerId: string, content: string) => {
    setQuestionEdit(prev => ({
      ...prev,
      answer: prev.answer.map(ans =>
        ans.id === answerId ? { ...ans, content } : ans
      ),
    }));
  }, []);

  const handleAnswerTrigger = useCallback((answerId: string) => {
    setQuestionEdit(prev => ({
      ...prev,
      answer: prev.answer.map(ans =>
        ans.id === answerId ? { ...ans, isCorrect: !ans.isCorrect } : ans
      ),
    }));
  }, []);

  const removeAnswer = useCallback((answerId: string) => {
    setQuestionEdit(prev => ({
      ...prev,
      answer: prev.answer.filter(ans => ans.id !== answerId),
    }));
  }, []);

  // Tag Management
  const handleTagSelect = useCallback((tagIds: number[]) => {
    const selectedTags = availableTags.filter(tag => tagIds.includes(tag.id!));
    setQuestionEdit(prev => ({
      ...prev,
      tags: selectedTags,
    }));
  }, [availableTags]);

  const removeTag = useCallback((tagId: number) => {
    setQuestionEdit(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId),
    }));
  }, []);

  const handleOptionSelect = useCallback((tagId: number, selectedOptionId: number) => {
    setQuestionEdit(prev => ({
      ...prev,
      tags: prev.tags.map(tag =>
        tag.id === tagId
          ? { ...tag, selectedOptionId }
          : tag
      ),
    }));
  }, []);

  const onOk = async () => {
    try {
      await form.validateFields(); 
      console.log(questionEdit);
      onClose(); 
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  return (
    <Modal
      title={<h1 className="text-2xl mb-4">Update Question</h1>}
      open={isModalOpen}
      onCancel={onClose}
      onOk={onOk}
      width={800}
      confirmLoading={isLoading}
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
              name="content"
              label={<h2 className="md:text-[14px] text-[10px] font-semibold"> Content </h2>}
              rules={[{ required: true, message: 'Please input the content!' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Answer Section */}
          <Col span={24}>
            <h2 className="md:text-[14px] text-[10px] font-semibold mb-2"> Answer </h2>
            {questionEdit.answer.map((answer) => (
              <Row key={answer.id} className="answer-row" gutter={[16, 16]} align="middle">
                <Col md={20} xs={16}>
                  <Form.Item>
                    <div className="flex justify-between items-center relative">
                      <MyEditorPlus
                        content={answer.content!}
                        placeholder='Enter answer'
                        onChange={(newContent) => handleAnswerChange(answer.id, newContent)}
                      />
                      <div className="flex justify-center items-center absolute -bottom-2 -right-[55%] md:bottom-0 md:-right-[20%]">
                        <Checkbox
                          className="mx-4 flex justify-center items-center"
                          checked={answer.isCorrect}
                          onChange={() => handleAnswerTrigger(answer.id)}
                        />
                        <Button
                          className='w-full rounded-md mb-2 md:mb-0'
                          type="primary"
                          danger
                          onClick={() => removeAnswer(answer.id)}
                        >
                          <DeleteOutlined />
                        </Button>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Col>
          <Col span={24} className="!p-0 -mt-3 mb-2">
            <Button className="md:text-[14px] text-[12px] !p-0 flex items-center justify-center text-[#6674BB] hover:!text-[#1930a2] transition-all duration-150 ml-2" type="link" onClick={addAnswer}>
              <PlusOutlined /> Add Answer
            </Button>
          </Col>

          {/* Tag Section */}
          <Col span={24} className="mb-8">
            <h2 className="md:text-[14px] text-[10px] font-semibold mb-2"> Tag </h2>
            <Select
              placeholder="Select Tag"
              style={{ width: '100%' }}
              onChange={handleTagSelect}
              allowClear
              mode="multiple"
              value={questionEdit.tags.map(tag => tag.id!)}
            >
              {availableTags.map(tag => (
                <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>

            {questionEdit.tags.map((tag) => (
              <Row key={tag.id} gutter={[16, 16]} align="middle" className="mt-2">
                <Col span={22}>
                  <h3 className="md:text-[14px] text-[12px] font-semibold mb-2">{tag.name}</h3>
                  <Select
                    placeholder="Select Option"
                    style={{ width: '100%' }}
                    onChange={(selectedOptionId) => handleOptionSelect(tag.id!, selectedOptionId)}
                  >
                    {
                      availableTags.map(tagAvailable => (
                        tagAvailable.name == tag.name
                         && tagAvailable.option?.map((option) => (
                          <Option key={option.id} value={tag.name}>
                            {option.name}
                          </Option>
                         ))
                      ))
                    }
                  </Select>
                </Col>
                <Col span={2}>
                  <Button
                    className='w-full rounded-md mt-7 mb-2 md:mb-0'
                    type="primary"
                    danger
                    onClick={() => removeTag(tag.id!)}
                  >
                    <DeleteOutlined />
                  </Button>
                </Col>
              </Row>
            ))}
          </Col>

          {/* Feedback Section */}
          <Col span={24} className="mb-8">
            <h2 className="md:text-[14px] text-[10px] font-semibold mb-2">Feedback</h2>
            <MyEditorPlus 
              // value={} 
              // onChange={} 
              placeholder="Enter your feedback here..." 
            />
          </Col>

          
        </Row>
      </Form>
    </Modal>
  );
};

export default QuestionManagementEditModal;
