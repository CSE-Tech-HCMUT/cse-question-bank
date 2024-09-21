import { Button, Col, Form, Row, Dropdown, MenuProps } from "antd";
import { useCallback, useState } from "react";
import { SimpleQuestion } from "../../types/question/question";
import { convertSimpleQuestionToInputSimpleQuestion, extractTextFromHtml } from "../../utils/Utils";
import { InputSimpleQuestion } from "../../types/question/inputQuestion";
import MyEditorPlus from "../../components/MyEditorPlus";
import LatexCompile from "../../components/LatexCompile";
import { DeleteOutlined, PlusOutlined, EyeOutlined, MenuOutlined, SwapOutlined } from "@ant-design/icons";
import '../../style/style.scss';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { previewPDFFileThunk } from "../../store/question-bank/thunk";
import PDFPreview from "../../components/PDFPreview";

export const QuestionSimpleTemplate = () => {
  const [form] = Form.useForm();
  const [isCKEditor, setIsCKEditor] = useState(true);
  const [simpleQuestion, setSimpleQuestion] = useState<SimpleQuestion>({
    id: String(Date.now()),
    content: '',
    type: 'multiple-choice',
    tag: '',
    difficult: 0,
    isParent: false,
    answer: [],
  });

  const { urlPDF } = useSelector((state: RootState) => state.manageBankQuestionReducer);
  const dispatch = useAppDispatch();

  const addAnswer = useCallback(() => {
    const updatedQuestion: SimpleQuestion = {
      ...simpleQuestion,
      answer: [
        ...simpleQuestion.answer,
        { id: String(Date.now()), content: '', isCorrect: false },
      ]
    };
    setSimpleQuestion(updatedQuestion);
  }, [simpleQuestion]);

  const handleQuestionChange = useCallback((content: string) => {
    const updatedQuestion: SimpleQuestion = { ...simpleQuestion, content };
    setSimpleQuestion(updatedQuestion);
  }, [simpleQuestion]);

  const handleAnswerChange = useCallback((answerId: string, content: string) => {
    const updatedQuestion: SimpleQuestion = {
      ...simpleQuestion,
      answer: simpleQuestion.answer.map(ans =>
        ans.id === answerId ? { ...ans, content } : ans
      )
    };
    setSimpleQuestion(updatedQuestion);
  }, [simpleQuestion]);

  const handleAnswerTrigger = useCallback((answerId: string) => {
    const updatedQuestion: SimpleQuestion = {
      ...simpleQuestion,
      answer: simpleQuestion.answer.map(ans =>
        ans.id === answerId ? { ...ans, isCorrect: !ans.isCorrect } : ans
      )
    };
    setSimpleQuestion(updatedQuestion);
  }, [simpleQuestion]);

  const removeAnswer = useCallback((answerId: string) => {
    const updatedQuestion: SimpleQuestion = {
      ...simpleQuestion,
      answer: simpleQuestion.answer.filter(ans => ans.id !== answerId)
    };
    setSimpleQuestion(updatedQuestion);
  }, [simpleQuestion]);

  const handlePreviewPDF = useCallback(() => {
    const updatedQuestion: SimpleQuestion = isCKEditor ? {
      ...simpleQuestion,
      content: extractTextFromHtml(simpleQuestion.content),
      answer: simpleQuestion.answer.map(ans => ({
        ...ans,
        content: extractTextFromHtml(ans.content || ''),
      })),
    } : simpleQuestion;

    const inputRequest: InputSimpleQuestion = convertSimpleQuestionToInputSimpleQuestion(updatedQuestion);
    dispatch(previewPDFFileThunk(inputRequest));
  }, [dispatch, simpleQuestion, isCKEditor])

  const handleSubmit = useCallback(() => {
    // const updatedQuestion: SimpleQuestion = isCKEditor ? {
    //   ...simpleQuestion,
    //   content: extractTextFromHtml(simpleQuestion.content),
    //   answer: simpleQuestion.answer.map(ans => ({
    //     ...ans,
    //     content: extractTextFromHtml(ans.content || ''),
    //   })),
    // } : simpleQuestion;
    
  }, [simpleQuestion, isCKEditor]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div key="add" onClick={addAnswer}>
          <PlusOutlined /> Add Answer
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div key="pdf" onClick={handlePreviewPDF}>
          <EyeOutlined />  Preview PDF
        </div>
      )
    },
    {
      key: '3',
      label: (
        <div key="toggleEditor" onClick={() => setIsCKEditor(!isCKEditor)}>
          <SwapOutlined /> Change Editor
        </div>
      )
    }
  ]

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} md={12}>
        <Col className='header' span={24}>
          <h1 className="text-2xl font-semibold">Create Question</h1>
          <div className="flex items-center">
            <Dropdown menu={{items}} trigger={['click']}>
              <Button type='primary' icon={<MenuOutlined />}>
                Menu
              </Button>
            </Dropdown>
          </div>
        </Col>
        <Col span={24}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Question">
              {isCKEditor ? (
                <MyEditorPlus
                  content={simpleQuestion.content}
                  placeholder='Please Enter Question'
                  onChange={handleQuestionChange}
                />
              ) : (
                <LatexCompile
                  content={simpleQuestion.content}
                  placeholder='Please Enter Question'
                  onChange={handleQuestionChange}
                />
              )}
            </Form.Item>

            {simpleQuestion.answer.map((answer, index) => (
              <Row key={answer.id} className="answer-row" gutter={[16, 16]}>
                <Col span={20}>
                  <Form.Item label={`Answer ${index + 1}`}>
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
                  </Form.Item>
                </Col>
                <Col span={4} className="flex">
                  <Button
                    className='w-full'
                    type="primary"
                    ghost
                    onClick={() => handleAnswerTrigger(answer.id)}
                  >
                    {answer.isCorrect ? 'T' : 'F'}
                  </Button>
                  <Button
                    className='w-full'
                    type="primary"
                    danger
                    onClick={() => removeAnswer(answer.id)}
                  >
                    <DeleteOutlined />
                  </Button>
                </Col>
              </Row>
            ))}
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
          <PDFPreview urlPDF={urlPDF} /> 
        </Col>
      </Col>
    </Row>
  );
}

export default QuestionSimpleTemplate;
