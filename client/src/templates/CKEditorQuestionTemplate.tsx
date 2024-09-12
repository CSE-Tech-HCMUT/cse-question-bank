import { useState } from 'react';
import { Button, Col, Form, Row } from 'antd';
import { Question } from '../types/question/question';
import MyEditorPlus from '../components/MyEditorPlus';
import { extractTextFromHtml } from '../utils/Utils';
import LatexCompile from '../components/LatexCompile';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';


export const CKEditorQuestionTemplate = () => {
  const [form] = Form.useForm();
  const [isCKEditor, setIsCKEditor] = useState(true);

  const [parentQuestion, setParentQuestion] = useState<Question>(
    {
      id: '01e19629-1515-4a0e-a9a0-cbf8aa59d65f',
      content: '',
      type: '',
      tag: '',
      difficult: 0,
      subQuestions: [],
      answer: null
    }
  );

  const addSubQuestion = () => {
    const updatedQuestion = {
      ...parentQuestion,
      subQuestions: [
        ...parentQuestion.subQuestions,
        {
          id: String(Date.now()),
          content: '',
          type: '',
          tag: '',
          difficult: 0,
          subQuestions: null,
          answer: []
        }
      ]
    };
    setParentQuestion(updatedQuestion);
  };

  const addAnswer = (subQuestionId: string) => {
    const updatedQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId
          ? {
              ...sq,
              answer: [
                ...sq.answer,
                {
                  id: String(Date.now()),
                  content: ''
                }
              ]
            }
          : sq
      )
    }
    setParentQuestion(updatedQuestion);
  };

  const handleQuestionChange = (content: string) => {
    const updatedQuestion = { ...parentQuestion, content }
    setParentQuestion(updatedQuestion);
  };

  const handleSubQuestionChange = (subQuestionId: string, content: string) => {
    const updatedQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId ? { ...sq, content } : sq
      )
    };
    setParentQuestion(updatedQuestion);
  };

  const handleAnswerChange = (subQuestionId: string, answerId: string, content: string) => {
    const updatedQuestion = {
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
  };

  const removeSubQuestion = (subQuestionId: string) => {
    const updatedQuestion = {
      ...parentQuestion,
      subQuestions: parentQuestion.subQuestions.filter((sq) => sq.id !== subQuestionId)
    }
    setParentQuestion(updatedQuestion);
  };

  const removeAnswer = (subQuestionId: string, answerId: string) => {
    const updatedQuestion = {
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
  };

  const handleSubmit = () => {
    const updatedQuestion = isCKEditor ? {
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
    
    console.log('Submitted Content:', updatedQuestion);
    // Additional submit logic
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Col className='header flex justify-between items-center mb-2' span={24}>
            <h1 className='font-semibold text-2xl'>Create Question</h1>
            <div>
              <Button className='mr-2' type='primary' htmlType='button' onClick={() => { setIsCKEditor(!isCKEditor) }}>
                Switch Editor
              </Button>

              <Button type='primary' htmlType='button' onClick={() => { setIsCKEditor(!isCKEditor) }}>
                Preview
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <Form form={form} name="CKEditorForm" layout="vertical" autoComplete="off" onFinish={handleSubmit}>
              {
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
                  {parentQuestion.subQuestions.map((subQuestion, index) => (
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
                              content={parentQuestion.content}
                              placeholder='Please Enter Parent Question'
                              onChange={(newContent) => handleQuestionChange(newContent)}
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
                        <Row>
                          <Col span={22}>
                            <Form.Item key={answer.id} label={`Answer ${index + 1}`}>
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
                              className='scale-[1.3] mt-[34px] ml-2 w-[80%]'
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
                  ))}
                </div>
              }
              <Col span={24} className='flex flex-col justify-center items-start'>
                <Button
                  type="primary"
                  onClick={() => addSubQuestion()}
                  className='mb-4 bg-gray-400'
                >
                  <PlusOutlined />
                  Add Sub-Question
                </Button>
                <Button type='primary' htmlType='submit' >
                  Save
                </Button>
              </Col>
            </Form>
          </Col>
        </Col>

        <Col span={12}>
          <Col span={24}>
            <Button type='primary' htmlType='button'>
              PDF
            </Button>
          </Col>
        </Col>
      </Row>
    </>
  );
}

export default CKEditorQuestionTemplate;
