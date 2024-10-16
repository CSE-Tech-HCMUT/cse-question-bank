import { Button, Col, Form, Row, Dropdown, MenuProps, Checkbox } from "antd";
import { useCallback, useState } from "react";
import { convertBlockQuestionToInputBlockQuestion, extractTextFromHtml } from "../../../utils/Utils";
import MyEditorPlus from "../../../components/MyEditorPlus";
import LatexCompile from "../../../components/LatexCompile";
import { DeleteOutlined, PlusOutlined, EyeOutlined, MenuOutlined, SwapOutlined } from "@ant-design/icons";
import '../../../style/style.scss';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store";
import { previewPDFFileThunk } from "../../../store/question-management/thunk";
import PDFPreview from "../../../components/PDFPreview";
import { BlockQuestion, SimpleQuestion } from "../../../types/question/question";
import { InputBlockQuestion } from "../../../types/question/inputQuestion";

export const BlockQuestionCreateTemplate = () => {
  const [form] = Form.useForm();
  const [isCKEditor, setIsCKEditor] = useState(true);
  const [blockQuestion, setBlockQuestion] = useState<BlockQuestion>({
    id: String(Date.now()),
    content: '',
    type: 'multiple-choice',
    tag: '',
    difficult: 0,
    isParent: true,
    subQuestions: [],
  });

  const { urlPDF } = useSelector((state: RootState) => state.manageBankQuestionReducer);
  const dispatch = useAppDispatch();

  const addSubQuestion = useCallback(() => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: [
        ...blockQuestion.subQuestions,
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
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const addAnswer = useCallback((subQuestionId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: blockQuestion.subQuestions.map((sq) =>
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
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const handleQuestionChange = useCallback((content: string) => {
    const updatedQuestion: BlockQuestion = { ...blockQuestion, content }
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const handleSubQuestionChange = useCallback((subQuestionId: string, content: string) => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: blockQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId ? { ...sq, content } : sq
      )
    };
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const handleAnswerChange = useCallback((subQuestionId: string, answerId: string, content: string) => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: blockQuestion.subQuestions.map((sq) =>
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
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const handleAnswerTrigger = useCallback((subQuestionId: string, answerId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: blockQuestion.subQuestions.map((sq) =>
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
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const removeSubQuestion = useCallback((subQuestionId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: blockQuestion.subQuestions.filter((sq) => sq.id !== subQuestionId)
    }
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const removeAnswer = useCallback((subQuestionId: string, answerId: string) => {
    const updatedQuestion: BlockQuestion = {
      ...blockQuestion,
      subQuestions: blockQuestion.subQuestions.map((sq) =>
        sq.id === subQuestionId
          ? {
              ...sq,
              answer: sq.answer.filter((ans) => ans.id !== answerId)
            }
          : sq
      )
    }
    setBlockQuestion(updatedQuestion);
  }, [blockQuestion]);

  const handlePreviewPDF = useCallback(() => { 
    const updatedQuestion: BlockQuestion = isCKEditor ? {
      ...blockQuestion,
      content: extractTextFromHtml(blockQuestion.content),
      subQuestions: blockQuestion.subQuestions.map(sq => ({
        ...sq,
        content: extractTextFromHtml(sq.content),
        answer: sq.answer.map(ans => ({
          ...ans,
          content: extractTextFromHtml(ans.content || '')
        }))
      }))
    } : blockQuestion
    
    const inputRequest: InputBlockQuestion =  convertBlockQuestionToInputBlockQuestion(updatedQuestion);
    dispatch(previewPDFFileThunk(inputRequest));
  }, [dispatch, blockQuestion, isCKEditor])

  const handleSubmit = useCallback(() => {
    // const updatedQuestion: BlockQuestion = isCKEditor ? {
    //   ...parentQuestion,
    //   content: extractTextFromHtml(parentQuestion.content),
    //   subQuestions: parentQuestion.subQuestions.map(sq => ({
    //     ...sq,
    //     content: extractTextFromHtml(sq.content),
    //     answer: sq.answer.map(ans => ({
    //       ...ans,
    //       content: extractTextFromHtml(ans.content || '')
    //     }))
    //   }))
    // } : parentQuestion
    
    // const inputRequest: InputBlockQuestion =  convertBlockQuestionToInputBlockQuestion(updatedQuestion)
  
    // Additional submit logic
  }, [blockQuestion, isCKEditor]);

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
                <span className="md:text-[14px] text-[10px] font-semibold"> Content Block Question </span>
              }
            >
              {isCKEditor ? (
                <MyEditorPlus
                  content={blockQuestion.content}
                  placeholder='Please Enter Question'
                  onChange={handleQuestionChange}
                />
              ) : (
                <LatexCompile
                  content={blockQuestion.content}
                  placeholder='Please Enter Question'
                  onChange={handleQuestionChange}
                />
              )}
            </Form.Item>
            
            {blockQuestion.subQuestions.map((sq, index) => (
              <div key={sq.id}>
                <Row className="answer-row" gutter={[16, 16]} align="middle">
                  <Col md={18} xs={16}>
                    <Form.Item label={<span className="md:text-[14px] text-[10px] font-semibold"> { `Question ${index + 1}` } </span>}>
                      <div className="flex justify-between items-center relative">
                        {isCKEditor ? (
                          <MyEditorPlus
                            content={sq.content!}
                            placeholder='Enter question'
                            onChange={(newContent) => handleSubQuestionChange(sq.id, newContent)}
                          />
                        ) : (
                          <LatexCompile
                            content={sq.content!}
                            placeholder='Enter question'
                            onChange={(newContent) => handleSubQuestionChange(sq.id, newContent)}
                          />
                        )}
                        <div className="flex justify-center items-center absolute -bottom-2 -right-[55%] md:bottom-0 md:-right-[35%]">
                          <Button
                            className='w-full rounded-md mb-2 md:mb-0 mx-2'
                            type="primary"
                            onClick={() => addAnswer(sq.id)}
                          >
                            <PlusOutlined /> Answer
                          </Button>
                          <Button
                            className='w-full rounded-md mb-2 md:mb-0'
                            type="primary"
                            danger
                            onClick={() => removeSubQuestion(sq.id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </div>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>

                {
                  sq.answer.map((answer) => (
                    <Row key={answer.id}  className="answer-row" gutter={[16, 16]} align="middle">
                      <Col md={20} xs={16}>
                        <Form.Item label={`Answer ${index + 1}`}>
                          {isCKEditor? (
                            <MyEditorPlus
                              content={answer.content || ''}
                              placeholder='Enter answer'
                              onChange={(newContent) => handleAnswerChange(sq.id, answer.id, newContent)}
                            />
                          ) : (
                            <LatexCompile
                              content={answer.content || ''}
                              placeholder='Enter answer'
                              onChange={(newContent) => handleAnswerChange(sq.id, answer.id, newContent)}
                            />
                          )}
                          <div className="flex justify-center items-center absolute -bottom-2 -right-[55%] md:bottom-0 md:-right-[20%]">
                            <Checkbox
                              className="mx-4 flex justify-center items-center"
                              checked={answer.isCorrect}
                              onChange={() => handleAnswerTrigger(sq.id, answer.id)}
                            />
                            <Button
                              className='w-full rounded-md mb-2 md:mb-0'
                              type="primary"
                              danger
                              onClick={() => removeAnswer(sq.id, answer.id)}
                            >
                              <DeleteOutlined />
                            </Button>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))
                }

              </div>
            ))}
              <Col span={24} className="!p-0">
                  <Button className="md:text-[14px] text-[12px] !p-0 flex items-center justify-center text-[#6674BB] hover:!text-[#1930a2] transition-all duration-150 mb-4" type="link" onClick={addSubQuestion}>
                    <PlusOutlined /> Add Question
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

export default BlockQuestionCreateTemplate;
