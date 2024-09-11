import { useState } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { Question } from '../types/question/question';
import MyEditorPlus from '../components/MyEditorPlus';
import { extractTextFromHtml } from '../utils/Utils';
import LatexCompile from '../components/LatexCompile';

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
        <Col span={24}>
          <Button type='primary' htmlType='button' onClick={() => { setIsCKEditor(!isCKEditor) }}>Change</Button>
          <Form form={form} name="CKEditorForm" layout="vertical" autoComplete="off" onFinish={handleSubmit}>
            {
              <div key={parentQuestion.id}>
                <Form.Item label={`Block Question`}>
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
                {parentQuestion.subQuestions.map((subQuestion) => (
                  <div key={subQuestion.id} style={{ marginLeft: '20px' }}>
                    <Form.Item label={`Sub-Question ${subQuestion.id}`}>
                      {/* <Input
                        value={subQuestion.content}
                        onChange={(e) =>
                          handleSubQuestionChange(subQuestion.id, e.target.value)
                        }
                        placeholder="Enter sub-question"
                      /> */}
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
                    {subQuestion.answer.map((answer) => (
                      <Form.Item key={answer.id} style={{ marginLeft: '20px' }}>
                        {/* <Input
                          value={answer.content!}
                          onChange={(e) =>
                            handleAnswerChange(subQuestion.id, answer.id, e.target.value)
                          }
                          placeholder="Enter answer"
                        /> */}
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
                    ))}
                    <Button
                      type="link"
                      onClick={() => addAnswer(subQuestion.id)}
                    >
                      Add Answer
                    </Button>
                    <Button
                      type="link"
                      onClick={() => removeSubQuestion(subQuestion.id)}
                    >
                      Remove Sub-Question
                    </Button>
                  </div>
                ))}
                <Button
                  type="link"
                  onClick={() => addSubQuestion()}
                >
                  Add Sub-Question
                </Button>
              </div>
            }
        
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default CKEditorQuestionTemplate;
