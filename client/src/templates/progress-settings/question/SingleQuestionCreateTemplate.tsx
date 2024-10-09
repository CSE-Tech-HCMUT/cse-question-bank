import { Button, Col, Form, Row, Dropdown, MenuProps, Checkbox } from "antd";
import { useCallback, useState } from "react";
import { extractTextFromHtml } from "../../../utils/Utils";
import MyEditorPlus from "../../../components/MyEditorPlus";
import LatexCompile from "../../../components/LatexCompile";
import { DeleteOutlined, PlusOutlined, EyeOutlined, MenuOutlined, SwapOutlined } from "@ant-design/icons";
import '../../../style/style.scss';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store";
import { createQuestionThunk, previewPDFFileThunk } from "../../../store/question-bank/thunk";
import PDFPreview from "../../../components/PDFPreview";
import { Question } from "../../../types/bankQuestion/bankQuestion";

export const SingleQuestionCreateTemplate = () => {
  const [form] = Form.useForm();
  const [isCKEditor, setIsCKEditor] = useState(true);
  const [question, setQuestion] = useState<Question>({
    id: String(Date.now()),
    content: '',
    type: 'multiple-choice',
    tag: '',
    difficult: 0,
    isParent: false,
    parentId: '',
    answer: [],
  });

  const { urlPDF } = useSelector((state: RootState) => state.manageBankQuestionReducer);
  const dispatch = useAppDispatch();

  const addAnswer = useCallback(() => {
    const updatedQuestion: Question = {
      ...question,
      answer: [
        ...question.answer,
        { id: String(Date.now()), content: '', isCorrect: false },
      ]
    };
    setQuestion(updatedQuestion);
  }, [question]);

  const handleQuestionChange = useCallback((content: string) => {
    const updatedQuestion: Question = { ...question, content };
    setQuestion(updatedQuestion);
  }, [question]);

  const handleAnswerChange = useCallback((answerId: string, content: string) => {
    const updatedQuestion: Question = {
      ...question,
      answer: question.answer.map(ans =>
        ans.id === answerId ? { ...ans, content } : ans
      )
    };
    setQuestion(updatedQuestion);
  }, [question]);

  const handleAnswerTrigger = useCallback((answerId: string) => {
    const updatedQuestion: Question = {
      ...question,
      answer: question.answer.map(ans =>
        ans.id === answerId ? { ...ans, isCorrect: !ans.isCorrect } : ans
      )
    };
    setQuestion(updatedQuestion);
  }, [question]);

  const removeAnswer = useCallback((answerId: string) => {
    const updatedQuestion: Question = {
      ...question,
      answer: question.answer.filter(ans => ans.id !== answerId)
    };
    setQuestion(updatedQuestion);
  }, [question]);

  const handlePreviewPDF = useCallback(() => {
    const updatedQuestion: Question = isCKEditor ? {
      ...question,
      content: extractTextFromHtml(question.content),
      answer: question.answer.map(ans => ({
        ...ans,
        content: extractTextFromHtml(ans.content || ''),
      })),
    } : question;

    dispatch(previewPDFFileThunk({
      content: updatedQuestion.content,
      type: updatedQuestion.type,
      isParent: updatedQuestion.isParent,
      answer: updatedQuestion.answer.map(ans => ({
        content: ans.content,
        isCorrect: ans.isCorrect,
      }))
    }));
  }, [dispatch, question, isCKEditor])

  const handleSubmit = useCallback(() => {
    const updatedQuestion: Question = isCKEditor ? {
      ...question,
      content: extractTextFromHtml(question.content),
      answer: question.answer.map(ans => ({
        ...ans,
        content: extractTextFromHtml(ans.content || ''),
      })),
    } : question;
    
    dispatch(createQuestionThunk({
      content: updatedQuestion.content,
      type: updatedQuestion.type,
      isParent: updatedQuestion.isParent,
      difficult: updatedQuestion.difficult,
      tag: updatedQuestion.tag,
      answer: updatedQuestion.answer.map(ans => ({
        id: ans.id,
        content: ans.content,
        isCorrect: ans.isCorrect,
      }))
    }));
    
  }, [question, isCKEditor]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div key="pdf" onClick={handlePreviewPDF}>
          <EyeOutlined />  Preview PDF
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div key="toggleEditor" onClick={() => setIsCKEditor(!isCKEditor)}>
          <SwapOutlined /> Change Editor
        </div>
      )
    }
  ]

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} md={12} lg={12}>
        <Col className='header mt-4 flex items-center justify-between' span={24}>
          <h1 className="md:text-2xl text-black font-semibold text-xl">Create Question</h1>
          <div className="flex items-center">
            <Dropdown menu={{items}} trigger={['click']}>
              <Button className="md:text-[14px] text-[10px]" type='primary' icon={<MenuOutlined />}>
                Menu
              </Button>
            </Dropdown>
          </div>
        </Col>
        <Col span={24}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item 
              name="content"
              label={
                <span className="md:text-[14px] text-[10px] font-semibold"> Content </span>
              }
            >
              {isCKEditor ? (
                <MyEditorPlus
                  content={question.content}
                  placeholder='Please Enter Question'
                  onChange={handleQuestionChange}
                />
              ) : (
                <LatexCompile
                  content={question.content}
                  placeholder='Please Enter Question'
                  onChange={handleQuestionChange}
                />
              )}
            </Form.Item>
            
            <h2 className="md:text-[14px] text-[10px] font-semibold mb-2"> Answer </h2>
            {question.answer.map((answer) => (
              <Row key={answer.id} className="answer-row" gutter={[16, 16]} align="middle">
                <Col md={20} xs={16}>
                  <Form.Item>
                    <div className="flex justify-between items-center relative">
                      {isCKEditor ? (
                        <MyEditorPlus
                          content={answer.content!}
                          placeholder='Enter answer'
                          onChange={(newContent) => handleAnswerChange(answer.id, newContent)}
                        />
                      ) : (
                        <LatexCompile
                          content={answer.content!}
                          placeholder='Enter answer'
                          onChange={(newContent) => handleAnswerChange(answer.id, newContent)}
                        />
                      )}
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
              <Col span={24} className="!p-0">
                  <Button className="md:text-[14px] text-[12px] !p-0 flex items-center justify-center text-[#6674BB] hover:!text-[#1930a2] transition-all duration-150 mb-4" type="link" onClick={addAnswer}>
                    <PlusOutlined /> Add Answer
                  </Button>
                </Col>
              <Col span={24} className="mb-6 flex justify-end">
                <Row gutter={12}>
                  <Col xs={12} md={12} className="flex justify-center items-center">
                    <Button danger htmlType='reset' className="p-4 ml-8 md:text-[14px] text-[10px]">
                      Reset
                    </Button>
                  </Col>
                  <Col xs={12} md={12} className="flex justify-center items-center">
                    <Button className="p-4 md:text-[14px] text-[10px]" type='primary' htmlType='submit'>
                      Create Question
                    </Button>
                  </Col>
                </Row>
              </Col>
          </Form>
        </Col>
      </Col>

      <Col xs={24} md={12}>
        <Col className="mt-4" span={24}>
          <h1 className="md:text-2xl font-semibold text-xl text-black">PDF Preview</h1>
        </Col>
        <Col span={24}>
          <PDFPreview urlPDF={urlPDF} /> 
        </Col>
      </Col>
    </Row>
  );
}

export default SingleQuestionCreateTemplate;
