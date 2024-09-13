import { useState, useMemo, useCallback } from 'react';
import { Button, Col, Form, Row, Select, Switch } from 'antd';
import { BlockQuestion, SimpleQuestion } from '../types/question/question';
import MyEditorPlus from '../components/MyEditorPlus';
import { convertBlockQuestionToInputBlockQuestion, extractTextFromHtml } from '../utils/Utils';
import LatexCompile from '../components/LatexCompile';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { previewPDFFileThunk } from '../store/question-bank/thunk';
import { InputBlockQuestion } from '../types/question/inputQuestion';

export const CKEditorQuestionTemplate = () => {
  const [form] = Form.useForm();
  const [isCKEditor, setIsCKEditor] = useState(true);
  const [typeQuestionValue, setTypeQuestionValue] = useState(0);
  const [parentQuestion, setParentQuestion] = useState<BlockQuestion>({
    id: String(Date.now()),
    content: '',
    type: 'mutilple-choice',
    tag: '',
    difficult: 0,
    isParent: true,
    subQuestions: [],
  });
  const [simpleQuestion, setSimpleQuestion] = useState<SimpleQuestion>({
    id: String(Date.now()),
    content: '',
    type: 'mutilple-choice',
    tag: '',
    difficult: 0,
    isParent: false,
    answer: []
  })

  const { urlPDF } = useSelector((state: RootState) => state.manageBankQuestionReducer);
  const dispatch = useAppDispatch();

  const handleChangeTypeQuestion = useCallback((value: number) => {
    setTypeQuestionValue(value);
  }, [typeQuestionValue])

  const addSubQuestion = useCallback(() => {
    const updatedQuestion: BlockQuestion = {
      ...parentQuestion,
      subQuestions: [
        ...parentQuestion.subQuestions,
        {
          id: String(Date.now()),
          content: '',
          type: 'mutilple-choice',
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
    
    const inputRequest: InputBlockQuestion =  convertBlockQuestionToInputBlockQuestion(updatedQuestion)
    dispatch(
      previewPDFFileThunk(inputRequest)
    )

    console.log(urlPDF);
    

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
              className='scale-[1.3] mt-[34px] ml-2 w-[80%]'
              type="primary"
              ghost
              onClick={() => handleAnswerTrigger(subQuestion.id, answer.id)}
            >
              {answer.isCorrect ? 'T' : 'F'}
            </Button>
          </Col>
          <Col span={1} offset={1}>
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
  )), [parentQuestion.subQuestions, isCKEditor, handleSubQuestionChange, handleAnswerChange, handleAnswerTrigger, removeAnswer, removeSubQuestion, addAnswer]);

  return (
    <>
      <Row>
        <Col span={12}>
          <Col className='header flex justify-between items-center mb-2' span={24}>
            <h1 className='font-semibold text-2xl'>Create Question</h1>
            <div>
            <Select
              defaultValue={0}
              style={{ width: 120 }}
              onChange={handleChangeTypeQuestion}
              options={[
                { value: 0, label: 'Simple Question' },
                { value: 1, label: 'Block Question' },
              ]}
              />
              <Switch onClick={() => setIsCKEditor(!isCKEditor)} className='mr-8 ml-8 mb-[3px] scale-[1.45]' checkedChildren="Text Editor" unCheckedChildren="Latex Editor" defaultChecked />
              <Button type='primary' htmlType='button' onClick={() => setIsCKEditor(!isCKEditor)}>
                Preview
              </Button>
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
              <Col span={24} className='flex flex-col justify-center items-start'>
                <Button
                  type="primary"
                  onClick={addSubQuestion}
                  className='mb-4 bg-gray-400'
                >
                  <PlusOutlined />
                  Add Sub-Question
                </Button>
                <Button type='primary' htmlType='submit'>
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
