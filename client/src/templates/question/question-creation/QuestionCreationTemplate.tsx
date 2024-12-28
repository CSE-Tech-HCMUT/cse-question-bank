import { LatexEditor, TextEditor } from "@/components";
import PDFPreview from "@/components/pdf/PDFPreview";
import PATH from "@/const/path";
import { getTextFromHtml } from "@/helper";
import { RootState, useAppDispatch } from "@/stores";
import { editQuestionThunk, previewPDFFileThunk } from "@/stores/question/thunk";
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import { Answer } from "@/types/answer";
import { Question } from "@/types/question";
import { Subject } from "@/types/subject";
import { TagAssignment } from "@/types/tagOption";
import { TagQuestion } from "@/types/tagQuestion";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Input, Layout, message, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export const QuestionCreationTemplate = () => {
  const { t } = useTranslation('question_creation');

  // authen
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();

  const { idQuestion } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"auto" | "manual" | "import">("manual");

  // general
  const [typeOfQuestion, setTypeOfQuestion] = useState<string>("");
  const [tagAssignments, setTagAssignments] = useState<TagAssignment[]>([]);
  const [contentQuestion, setContentQuestion] = useState<string>(""); 

  // pdf
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const onClose = () => { 
    setIsModalOpen(false);
  }

  // import
  const [fileList, setFileList] = useState<any[]>([]); 
  const [_importedData, setImportedData] = useState<any>(null); 

  // Auto
  const [contentAnswerAutoQuestion, setContentAnswerAutoQuestion] = useState<string>(""); 
  const [numberOfDistractionAnswers, setNumberOfDistractionAnswer] = useState<number>(0);

  // Manual
  const [manualAnswers, setManualAnswers] = useState<Answer[]>([]);

  const [editorMode, setEditorMode] = useState<"text" | "latex">("text"); 

  const { data: tagData } = useSelector((state: RootState) => state.tagManagementReducer);
  const { pdfUrl } = useSelector((state: RootState) => state.questionReducer);

  const dispatch = useAppDispatch();

  //General
  const handleTagAssignmentChange = (tagId: number, optionId: number) => {
    setTagAssignments((prev) => { 
      const existingAssignmentIndex = prev.findIndex(assignment => assignment.tag?.id === tagId);
      if(existingAssignmentIndex >= 0){
        const updatedAssignment = [... prev];
        updatedAssignment[existingAssignmentIndex] = { ... updatedAssignment[existingAssignmentIndex], option: { id: optionId } };
        return updatedAssignment;
      } else {
        return [... prev, { tag: { id: tagId }, option: { id: optionId } }];
      }
   });
  };
  const handleEditorChangeContentQuestion = (content: string) => {
    setContentQuestion(getTextFromHtml(content));   
  };

  // Pdf
  const handlePreviewPDF = () => {
    const simplifiedTagAssignments = tagAssignments.map((assignment) => ({
      tagId: assignment.tag?.id,
      optionId: assignment.option?.id,
    }));

    let payload: Question = {
      id: idQuestion,
      content: contentQuestion,
      type: typeOfQuestion,
      tagAssignments: simplifiedTagAssignments,
      subjectId: subjectAuthen?.id
    }

    if(mode === 'auto'){
      payload = { ... payload,
        answer: [
          {
            content: contentAnswerAutoQuestion,
            isTrue: true
          }
        ],
        numberOfDistractionAnswers: numberOfDistractionAnswers
      }
    } else if (mode === 'manual'){
      payload = {...payload,
        answer: manualAnswers
      }
    }
    
    dispatch(editQuestionThunk(payload)).then((actionResult) => { 
      
      if (actionResult.meta.requestStatus === 'fulfilled') {
        dispatch(previewPDFFileThunk(idQuestion!)).then((actionResult) => { 
          if (actionResult.meta.requestStatus === 'fulfilled') {
            setIsModalOpen(true);
          }
        })
      }
    })
  };

  // Import
  const handleFileChange = (info: any) => {
    const { status, originFileObj } = info.file;

    if (status === "done") {
      message.success(`${originFileObj?.name} file uploaded successfully`);

      parseImportedFile(originFileObj);
    } else if (status === "error") {
      message.error(`${originFileObj?.name} file upload failed.`);
    }
  };

  const parseImportedFile = (file: any) => {
    setImportedData({ fileName: file.name });
  };

  // Auto
  const handleEditorChangeContentAnswerAutoQuestion = (content: string) => {
    setContentAnswerAutoQuestion(getTextFromHtml(content));
  };

  // Manual
  const handleAddManualAnswer = () => {
    setManualAnswers([... manualAnswers, { content: '', isTrue: false }]);    
  };
  const handleManualAnswerChange = (index: number, content: string) => {
    const updatedAnswers = manualAnswers.map((answer, idx) => {
      if(idx === index){
        return {...answer, content: getTextFromHtml(content) };
      }
      return answer;
    });
    setManualAnswers(updatedAnswers);
  };
  const handleManualAnswerCheckChange = (index: number, isTrue: boolean) => {
    const updatedAnswers = manualAnswers.map((answer, idx) => { 
      if (idx === index) { 
        return { ...answer, isTrue }; 
      } 
      return answer; 
    }); 
    setManualAnswers(updatedAnswers);
  }

  const handleSubmit = () => {
    const simplifiedTagAssignments = tagAssignments.map((assignment) => ({
      tagId: assignment.tag?.id,
      optionId: assignment.option?.id,
    }));

    let payload: Question = {
      id: idQuestion,
      content: contentQuestion,
      type: typeOfQuestion,
      tagAssignments: simplifiedTagAssignments,
      subjectId: subjectAuthen?.id
    }

    if(mode === 'auto'){
      payload = { ... payload,
        answer: [
          {
            content: contentAnswerAutoQuestion,
            isTrue: true
          }
        ],
        numberOfDistractionAnswers: numberOfDistractionAnswers
      }
    } else if (mode === 'manual'){
      payload = {...payload,
        answer: manualAnswers
      }
    }

    dispatch(editQuestionThunk(payload)).then((actionResult) => { 
      if (actionResult.meta.requestStatus === 'fulfilled') {
        navigate(PATH.QUESTION_MANAGEMENT.replace(':subjectName', subjectAuthen?.name!));
      }
    })
  }

  useEffect(() => {
    const storedSubject = localStorage.getItem('subjectAuthen'); 
    if (storedSubject) { 
      setSubjectAuthen(JSON.parse(storedSubject)); 
    }
    dispatch(getAllTagsThunk());
  }, []);

  return (
    <Content className="QuestionCreationTemplate" style={{ background: '#f0f2f5' }}>
      <h1 className="text-xl font-semibold mb-4">{t("createQuestion")}</h1>

      {/* Step 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card style={{ height: '100%' }} title={t("stepOne")}>
            <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { t("department") } </span>
                </label>
                <Input disabled value={subjectAuthen?.department?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { t("subject") } </span>
                </label>
                <Input disabled value={subjectAuthen?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { t("typeQuestion") } </span>
                </label>
                <Input placeholder={t("placeholderTypeQuestion")} name="type" onChange={(event) => { 
                  setTypeOfQuestion(event.target.value);
                }} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Step 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card style={{ height: '100%' }} title={"2. Nhập thông tin cho các nhãn của câu hỏi"}>
            <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
              {
                tagData?.filter((tag: TagQuestion) => tag.subject?.id === subjectAuthen?.id).length != 0 ? (
                  tagData?.filter((tag: TagQuestion) => tag.subject?.id === subjectAuthen?.id).map((tag: TagQuestion) => (
                    <Col xs={12} md={8} key={tag.id}>
                      <label className="ant-form-item-label">
                        <span>{tag.name}</span>
                      </label>
                      <Select
                        placeholder={t("placeholderTag") + `${tag.name}`}
                        style={{ width: '100%'}}
                        onChange={(value) => { handleTagAssignmentChange(tag.id!, value) }}
                      >
                        {tag.options && tag.options.map((option) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  ))
                ) : t("noTag")
              }

            </Row>
          </Card>
        </Col>
      </Row>

      {/* Step 3 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card 
            style={{ height: '100%' }} 
            title={"3. Nhập thông tin cho câu hỏi"}
            extra={
              <div className="flex">
                <Button 
                  type={mode === "auto" ? "primary" : "default"} 
                  onClick={() => setMode("auto")}> 
                  { t("auto") }
                </Button> 
                <Button 
                  type={mode === "manual" ? "primary" : "default"} 
                  className="ml-2"
                  onClick={() => setMode("manual")}> 
                  { t("manual") }
                </Button>
                <Button 
                  type={mode === "import" ? "primary" : "default"} 
                  className="ml-2"
                  onClick={() => setMode("import")}>
                  { t("import") }
                </Button>
              </div>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
              {
                mode === "auto" ? (
                  <>
                    <div className="flex justify-end items-center w-full">
                      <Button type={editorMode === "text" ? "primary" : "default"} onClick={() => setEditorMode("text")}>Text</Button>
                      <Button className="ml-2" type={editorMode === "latex" ? "primary" : "default"} onClick={() => setEditorMode("latex")}>LaTeX</Button>
                    </div>

                    <Col xs={24}>
                      <label className="ant-form-item-label">
                        <span>{ t("contentQuestion") }</span>         
                      </label> 
                      <TextEditor onChange={handleEditorChangeContentQuestion} placeholder={t("placeholderContentQuestion")} />
                    </Col>

                    <Col xs={24}>
                      <label className="ant-form-item-label">
                        <span>{ t("correctAnswer") }</span>         
                      </label> 
                      <TextEditor onChange={handleEditorChangeContentAnswerAutoQuestion} />
                    </Col>

                    <Col xs={24}>
                      <label className="ant-form-item-label">
                        <span>{t("numberOfDistractAnswer")}</span>     
                      </label> 
                      <Input type="number" placeholder={t("placeholderDistractAnswer")} onChange={(event) => { setNumberOfDistractionAnswer(Number(event.target.value)) }} />
                    </Col>
                  </>
                ) : mode === "manual" ? (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <Button type="primary" onClick={handlePreviewPDF}>{t("previewPdf")}</Button>
                      <div className="flex justify-end items-center w-full">
                        <Button type={editorMode === "text" ? "primary" : "default"} onClick={() => setEditorMode("text")}>Text</Button>
                        <Button className="ml-2" type={editorMode === "latex" ? "primary" : "default"} onClick={() => setEditorMode("latex")}>LaTeX</Button>
                      </div>
                    </div>
                    
                    <Col xs={24}>
                      <label className="ant-form-item-label">
                        <span>{ t("contentQuestion") }</span>         
                      </label> 
                      {
                        editorMode === 'text' ? (
                          <TextEditor onChange={handleEditorChangeContentQuestion} />  
                        ) : (
                          <LatexEditor onChange={handleEditorChangeContentQuestion} />
                        )
                      }
                    </Col>

                    {
                      manualAnswers.map((answer, index) => (
                        <Col xs={24} key={index}>
                          <label className="ant-form-item-label">
                            <span>{t("answer")} {index + 1}</span>
                          </label>
                          {
                            editorMode === 'text' ? (
                              <TextEditor 
                                value={answer.content} 
                                onChange={(newContent) => handleManualAnswerChange(index, newContent)}
                                placeholder={t("placeholderAnswer")}
                              />
                            ) : (
                              <LatexEditor 
                                content={answer.content}
                                onChange={(newContent) => handleManualAnswerChange(index, newContent)}
                                placeholder={t("placeholderAnswer")}
                              />
                            )
                          }
                          <Checkbox 
                            checked={answer.isTrue} 
                            onChange={(e) => handleManualAnswerCheckChange(index, e.target.checked)} 
                          > 
                            {t("correct")}
                          </Checkbox>
                        </Col>
                      ))
                    }

                    <Button 
                      type="dashed" 
                      onClick={handleAddManualAnswer}
                    > 
                      {t("addAnswer")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Col xs={24}>
                      <label className="ant-form-item-label">
                        <span>{t("selectFile")}</span>
                      </label>
                      <Upload
                        accept=".docx,.xlsx"
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false} 
                        onRemove={() => setFileList([])} 
                      >
                        <Button icon={<UploadOutlined />}>{t("uploadFile")}</Button>
                      </Upload>
                  </Col>
                  </>
                )
              }

            <Row className="w-full" style={{ marginTop: '24px' }}> 
              <Col xs={24}> 
                <PDFPreview urlPDF={pdfUrl} isModalOpen={isModalOpen} onClose={onClose} />
              </Col> 
            </Row>

            <Row className="w-full flex justify-end items-center" style={{ marginTop: '24px' }}> 
              <Col> 
                <Button type="primary" onClick={handleSubmit}> 
                  {t("createQuestion")}
                </Button> 
              </Col> 
            </Row>

            </Row>

          </Card>
        </Col>
      </Row>

    </Content>
  )
}

export default QuestionCreationTemplate;
