import { Button, Col, Dropdown, Form, Menu, Row } from "antd"
import { useCallback, useMemo, useState } from "react";
import { BlockQuestion, SimpleQuestion } from "../../types/question/question";
import { convertBlockQuestionToInputBlockQuestion, extractTextFromHtml } from "../../utils/Utils";
import { InputBlockQuestion } from "../../types/question/inputQuestion";
import MyEditorPlus from "../../components/MyEditorPlus";
import LatexCompile from "../../components/LatexCompile";
import { DeleteOutlined, EyeOutlined, MenuOutlined, MinusOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";

export const QuestionBlockTemplate = () => {
  const [form] = Form.useForm();
  const [isCKEditor, setIsCKEditor] = useState(true);
  const [parentQuestion, setParentQuestion] = useState<BlockQuestion>({
    id: String(Date.now()),
    content: '',
    type: 'multiple-choice',
    tag: '',
    difficult: 0,
    isParent: true,
    subQuestions: [],
  });

  const addSubQuestion = useCallback(() => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: [
        ...parentQuestion.subQuestions,
        {
          id: String(Date.now()),
          content: '',
          type: 'multiple-choice',
          tag: '',
          difficult: 0,
          isParent: false,
          answer: []
        } as SimpleQuestion
      ]
    };
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const addAnswer = useCallback((subQuestionId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId
          ? {
              ...sq,
              answer: [
                ...sq.answer,
                {
                  id: String(Date.now()),
                  content: '',
                  isCorrect: false
                }
              ]
            }
          : sq
      )
    }
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const handleQuestionChange = useCallback((content: string) => {
    const updatedQuestion: BlockQuestion = { ...parentQuestion, content }
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const handleSubQuestionChange = useCallback((subQuestionId: string, content: string) => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId ? { ...sq, content } : sq
      )
    };
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const handleAnswerChange = useCallback((subQuestionId: string, answerId: string, content: string) => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId
          ? {
              ...sq,
              answer: sq.answer.map((ans) =>
                ans.id === answerId ? { ...ans, content } : ans
              )
            }
          : sq
      )
    }
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const handleAnswerTrigger = useCallback((subQuestionId: string, answerId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId
          ? {
              ...sq,
              answer: sq.answer.map((ans) =>
                ans.id === answerId
                  ? { ...ans, isCorrect: !ans.isCorrect }
                  : ans
              )
            }
          : sq
      )
    }
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const removeSubQuestion = useCallback((subQuestionId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.filter((sq) => sq.id !== subQuestionId)
    }
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const removeAnswer = useCallback((subQuestionId: string, answerId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId
          ? {
              ...sq,
              answer: sq.answer.filter((ans) => ans.id !== answerId)
            }
          : sq
      )
    }
    setParentQuestion(updatedQuestion);
  }, [parentQuestion]);

  const handleSubmit = useCallback(() => {
    const updatedQuestion: BlockQuestion = isCKEditor ? {
      ...parentQuestion,
      content: extractTextFromHtml(parentQuestion.content),
      subQuestions: parentQuestion.subQuestions.map(sq => ({
        ...sq,
        content: extractTextFromHtml(sq.content),
        answer: sq.answer.map(ans => ({
          ...ans,
          content: extractTextFromHtml(ans.content || '')
        }))
      }))
    } : parentQuestion
    
    const inputRequest: InputBlockQuestion =  convertBlockQuestionToInputBlockQuestion(updatedQuestion);
    console.log(inputRequest);
    
  
    // Additional submit logic
  }, [parentQuestion, isCKEditor]);

  const renderedSubQuestions = useMemo(() => parentQuestion.subQuestions.map((subQuestion, index) => (
    <div key={subQuestion.id}>
      <Row>
        <Col span={22}>
          <Form.Item label={`Sub-Question ${index + 1}`}>
            {
              isCKEditor ? <MyEditorPlus
                content={subQuestion.content}
                placeholder='Please Enter sub-question'
                onChange={(newContent) => handleSubQuestionChange(subQuestion.id, newContent)}
              /> : <LatexCompile
                content={subQuestion.content}
                placeholder='Please Enter sub-question'
                onChange={(newContent) => handleSubQuestionChange(subQuestion.id, newContent)}
              />
            }
          </Form.Item>
        </Col>
        <Col span={1}>
          <Button
            className='scale-[1.35] mt-[34px] ml-2 w-[80%] bg-gray-400'
            type="primary"
            onClick={() => addAnswer(subQuestion.id)}
          >
            <PlusOutlined />
          </Button>
        </Col>
      </Row>
      {subQuestion.answer.map((answer, index) => (
        <Row key={answer.id}>
          <Col span={20}>
            <Form.Item label={`Answer ${index + 1}`}>
              {
                isCKEditor ? <MyEditorPlus
                  content={answer.content!}
                  placeholder='Enter answer'
                  onChange={(newContent) => handleAnswerChange(subQuestion.id, answer.id, newContent)}
                /> : <LatexCompile
                  content={answer.content!}
                  placeholder='Enter answer'
                  onChange={(newContent) => handleAnswerChange(subQuestion.id, answer.id, newContent)}
                />
              }
            </Form.Item>
          </Col>
          <Col span={1}>
            <Button
              className='scale-[1.3] mt-[118px] ml-4 w-[80%]'
              type="primary"
              ghost
              onClick={() => handleAnswerTrigger(subQuestion.id, answer.id)}
            >
              {answer.isCorrect ? 'T' : 'F'}
            </Button>
          </Col>
          <Col span={1} offset={1}>
            <Button
              className='scale-[1.3] mt-[118px] ml-4 w-[80%]'
              type="primary"
              danger
              onClick={() => removeAnswer(subQuestion.id, answer.id)}
            >
              <DeleteOutlined />
            </Button>
          </Col>
        </Row>
      ))}

      <Button
        type="primary"
        danger
        onClick={() => removeSubQuestion(subQuestion.id)}
        className='mb-4'
      >
        <MinusOutlined />
        Remove Sub-Question
      </Button>
    </div>
  )), [parentQuestion.subQuestions, isCKEditor, handleSubQuestionChange, handleAnswerChange, handleAnswerTrigger, removeAnswer, removeSubQuestion, addAnswer]);

  const menu = (
    <Menu>
      <Menu.Item key="add" onClick={addSubQuestion}>
        <PlusOutlined /> Add Sub Question
      </Menu.Item>
      <Menu.Item key="pdf">
        <EyeOutlined />  Preview PDF
      </Menu.Item>
      <Menu.Item key="toggleEditor" onClick={() => setIsCKEditor(!isCKEditor)}>
        <SwapOutlined /> Change Editor
      </Menu.Item>
    </Menu>
  );

  return (
    <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={12}>
        <Col className='header' span={24}>
          <h1 className="text-2xl font-semibold">Create Question</h1>
          <div className="flex items-center">
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type='primary' icon={<MenuOutlined />}>
                Menu
              </Button>
            </Dropdown>
          </div>
        </Col>
          <Col span={24}>
            <Form form={form} name="CKEditorForm" layout="vertical" autoComplete="off" onFinish={handleSubmit}>
              <div key={parentQuestion.id}>
                <Form.Item label={`Question`}>
                  {
                    isCKEditor ? <MyEditorPlus
                      content={parentQuestion.content}
                      placeholder='Please Enter Parent Question'
                      onChange={(newContent) => handleQuestionChange(newContent)}
                    /> : <LatexCompile
                      content={parentQuestion.content}
                      placeholder='Please Enter Parent Question'
                      onChange={(newContent) => handleQuestionChange(newContent)}
                    />
                  }
                </Form.Item>
                {renderedSubQuestions}
              </div>
              <Col span={24}>
                <Button type='primary' htmlType='submit'>
                  Save
                </Button>
              </Col>
            </Form>
          </Col>
        </Col>

        <Col xs={24} md={12}>
        <Col span={24}>
          <h1 className="text-2xl font-semibold">PDF Preview</h1>
        </Col>
        <Col span={24}>
          
        </Col>
      </Col>
      </Row>
  )
}

export default QuestionBlockTemplate