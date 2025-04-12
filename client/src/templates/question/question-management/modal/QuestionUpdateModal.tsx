import { Modal, Card, Button, Row, Col, Input, Select, Checkbox } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/stores";
import {
  editQuestionThunk,
  previewPDFFileThunk,
} from "@/stores/question/thunk";
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import { Question } from "@/types/question";
import { Subject } from "@/types/subject";
import { TagAssignment } from "@/types/tagOption";
import { TagQuestion } from "@/types/tagQuestion";
import { Answer } from "@/types/answer";
import PDFPreview from "@/components/pdf/PDFPreview";
import { getTextFromHtml } from "@/helper";
import { TextEditor, LatexEditor } from "@/components";

const { Option } = Select;

interface QuestionUpdateModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  questionData: Question;
  subjectAuthen?: Subject;
  onUpdateSuccess?: () => void;
}

export const QuestionUpdateModal = ({
  isModalOpen,
  onClose,
  questionData,
  subjectAuthen,
  onUpdateSuccess,
}: QuestionUpdateModalProps) => {
  const { t } = useTranslation("question_creation");
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  const { data: tagData } = useSelector(
    (state: RootState) => state.tagManagementReducer
  );
  const { pdfUrl } = useSelector((state: RootState) => state.questionReducer);

  // State management
  const [localQuestionData, setLocalQuestionData] = useState<Question>(
    questionData || {}
  ); // Default to empty object if undefined
  const [mode, setMode] = useState<"auto" | "manual">(
    questionData?.numberOfDistractionAnswers ? "auto" : "manual"
  );
  const [contentQuestion, setContentQuestion] = useState(
    questionData?.content ?? "" // Fallback to empty string if undefined
  );
  const [canShuffle, setCanShuffle] = useState(
    questionData?.canShuffle || false
  );
  const [tagAssignments, setTagAssignments] = useState<TagAssignment[]>([]); // Default empty array if undefined
  const [contentAnswerAutoQuestion, setContentAnswerAutoQuestion] = useState(
    questionData?.answer?.find((a) => a.isTrue)?.content ?? ""
  );
  const [numberOfDistractionAnswers, setNumberOfDistractionAnswer] = useState(
    questionData?.numberOfDistractionAnswers ?? 0
  );
  const [manualAnswers, setManualAnswers] = useState<Answer[]>([]);
  const [editorMode, setEditorMode] = useState<"text" | "latex">("text");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    if (questionData) {
      setLocalQuestionData(questionData);
      setContentQuestion(questionData.content || "");
      setCanShuffle(questionData.canShuffle || false);

      // Cập nhật lại tagAssignments từ questionData
      setTagAssignments(
        questionData.tagAssignments?.map((ta) => ({
          tag: { id: ta.tagId },
          option: { id: ta.optionId },
        })) || []
      );
      setMode(questionData.numberOfDistractionAnswers ? "auto" : "manual");
      setContentAnswerAutoQuestion(
        questionData.answer?.find((a) => a.isTrue)?.content ?? ""
      );
      setNumberOfDistractionAnswer(
        questionData.numberOfDistractionAnswers ?? 0
      );
      setManualAnswers(
        questionData.answer || [
          { content: "", isTrue: false },
          { content: "", isTrue: false },
          { content: "", isTrue: false },
          { content: "", isTrue: false },
        ]
      );
    }
  }, [questionData]); // Chạy lại khi questionData thay đổi

  // Load tags
  useEffect(() => {
    dispatch(getAllTagsThunk());
  }, [dispatch]);

  const handleTagAssignmentChange = useCallback(
    (tagId: number, optionId: number) => {
      setTagAssignments((prev) => {
        const existingIndex = prev.findIndex((a) => a.tag?.id === tagId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            option: { id: optionId },
          };
          return updated;
        }
        return [...prev, { tag: { id: tagId }, option: { id: optionId } }];
      });
    },
    []
  );

  const handlePreviewPDF = useCallback(async () => {
    const simplifiedTagAssignments = tagAssignments.map((assignment) => ({
      tagId: assignment.tag?.id,
      optionId: assignment.option?.id,
    }));

    const payload: Question = {
      ...localQuestionData,
      content: contentQuestion,
      tagAssignments: simplifiedTagAssignments,
      canShuffle,
      answer:
        mode === "auto"
          ? [{ content: contentAnswerAutoQuestion, isTrue: true }]
          : manualAnswers,
      numberOfDistractionAnswers:
        mode === "auto" ? numberOfDistractionAnswers : undefined,
    };

    try {
      await dispatch(editQuestionThunk(payload)).unwrap();
      await dispatch(previewPDFFileThunk(localQuestionData.id!)).unwrap();
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error("Error previewing PDF:", error);
    }
  }, [
    dispatch,
    localQuestionData,
    tagAssignments,
    contentQuestion,
    contentAnswerAutoQuestion,
    manualAnswers,
    mode,
    numberOfDistractionAnswers,
    canShuffle,
  ]);

  const handleSubmit = useCallback(async () => {
    const simplifiedTagAssignments = tagAssignments.map((assignment) => ({
      tagId: assignment.tag?.id,
      optionId: assignment.option?.id,
    }));

    const payload: Question = {
      ...localQuestionData,
      content: contentQuestion,
      tagAssignments: simplifiedTagAssignments,
      canShuffle,
      answer:
        mode === "auto"
          ? [{ content: contentAnswerAutoQuestion, isTrue: true }]
          : manualAnswers,
      numberOfDistractionAnswers:
        mode === "auto" ? numberOfDistractionAnswers : undefined,
    };

    try {
      await dispatch(editQuestionThunk(payload)).unwrap();
      onUpdateSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating question:", error);
    }
  }, [
    dispatch,
    localQuestionData,
    tagAssignments,
    contentQuestion,
    contentAnswerAutoQuestion,
    manualAnswers,
    mode,
    numberOfDistractionAnswers,
    canShuffle,
    onUpdateSuccess,
    onClose,
  ]);

  // Answer handlers for manual mode
  const handleAddManualAnswer = () => {
    setManualAnswers((prev) => [...prev, { content: "", isTrue: false }]);
  };

  const handleManualAnswerChange = (index: number, content: string) => {
    const updatedAnswers = manualAnswers.map((answer, idx) =>
      idx === index ? { ...answer, content: getTextFromHtml(content) } : answer
    );
    setManualAnswers(updatedAnswers);
  };

  const handleManualAnswerCheckChange = (index: number, isTrue: boolean) => {
    const updatedAnswers = manualAnswers.map((answer, idx) =>
      idx === index ? { ...answer, isTrue } : answer
    );
    setManualAnswers(updatedAnswers);
  };

  return (
    <Modal
      title={t("updateQuestion")}
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: "1200px" }}
      destroyOnClose
    >
      {subjectAuthen && (
        <div style={{ background: "#f0f2f5", padding: 24 }}>
          {/* Step 1: Basic Information */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card title={t("basicInformation")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                      <label>{t("department")}</label>
                      <Input
                        disabled
                        value={subjectAuthen.department?.name}
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                      <label>{t("subject")}</label>
                      <Input
                        disabled
                        value={subjectAuthen.name}
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      checked={canShuffle}
                      onChange={(e) => setCanShuffle(e.target.checked)}
                    >
                      {t("allowAnswerShuffling")}
                    </Checkbox>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Step 2: Tags */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card title={t("questionTags")}>
                <Row gutter={16}>
                  {tagData!.filter(
                    (tag: TagQuestion) => tag.subject?.id === subjectAuthen.id
                  ).length > 0 ? (
                    tagData!
                      .filter(
                        (tag: TagQuestion) =>
                          tag.subject?.id === subjectAuthen.id
                      )
                      .map((tag: TagQuestion) => {
                        const currentOption = tagAssignments.find(
                          (ta) => ta.tag?.id === tag.id
                        )?.option?.id;
                        return (
                          <Col span={8} key={tag.id}>
                            <div style={{ marginBottom: 16 }}>
                              <label>{tag.name}</label>
                              <Select
                                value={currentOption} // Giá trị của tag được lấy từ tagAssignments
                                style={{ width: "100%", marginTop: 8 }}
                                onChange={(value) =>
                                  handleTagAssignmentChange(tag.id!, value)
                                }
                              >
                                {tag.options?.map((option) => (
                                  <Option key={option.id} value={option.id}>
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          </Col>
                        );
                      })
                  ) : (
                    <Col span={24}>{t("noTagsAvailable")}</Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Step 3: Question Content */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                title={t("questionContent")}
                extra={
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      type={mode === "auto" ? "primary" : "default"}
                      onClick={() => setMode("auto")}
                    >
                      {t("autoMode")}
                    </Button>
                    <Button
                      type={mode === "manual" ? "primary" : "default"}
                      onClick={() => setMode("manual")}
                    >
                      {t("manualMode")}
                    </Button>
                  </div>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 8,
                    }}
                  >
                    <Button
                      type={editorMode === "text" ? "primary" : "default"}
                      onClick={() => setEditorMode("text")}
                      style={{ marginRight: 8 }}
                    >
                      Text
                    </Button>
                    <Button
                      type={editorMode === "latex" ? "primary" : "default"}
                      onClick={() => setEditorMode("latex")}
                    >
                      LaTeX
                    </Button>
                  </div>

                  <label>{t("questionText")}</label>
                  {editorMode === "text" ? (
                    <TextEditor
                      value={contentQuestion}
                      onChange={setContentQuestion}
                    />
                  ) : (
                    <LatexEditor
                      content={contentQuestion}
                      onChange={setContentQuestion}
                    />
                  )}
                </div>

                {mode === "auto" ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label>{t("correctAnswer")}</label>
                      {editorMode === "text" ? (
                        <TextEditor
                          value={contentAnswerAutoQuestion}
                          onChange={setContentAnswerAutoQuestion}
                        />
                      ) : (
                        <LatexEditor
                          content={contentAnswerAutoQuestion}
                          onChange={setContentAnswerAutoQuestion}
                        />
                      )}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label>{t("numberOfDistractors")}</label>
                      <Input
                        type="number"
                        value={numberOfDistractionAnswers}
                        onChange={(e) =>
                          setNumberOfDistractionAnswer(Number(e.target.value))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {manualAnswers.map((answer, index) => (
                      <div key={index} style={{ marginBottom: 16 }}>
                        <label>
                          {t("answer")} {index + 1}
                        </label>
                        {editorMode === "text" ? (
                          <TextEditor
                            value={answer.content}
                            onChange={(content) =>
                              handleManualAnswerChange(index, content)
                            }
                          />
                        ) : (
                          <LatexEditor
                            content={answer.content}
                            onChange={(content) =>
                              handleManualAnswerChange(index, content)
                            }
                          />
                        )}
                        <Checkbox
                          checked={answer.isTrue}
                          onChange={(e) =>
                            handleManualAnswerCheckChange(
                              index,
                              e.target.checked
                            )
                          }
                          style={{ marginTop: 8 }}
                        >
                          {t("correctAnswer")}
                        </Checkbox>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={handleAddManualAnswer}
                      style={{ marginBottom: 16 }}
                    >
                      {t("addAnswer")}
                    </Button>
                  </>
                )}

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button type="primary" onClick={handlePreviewPDF}>
                    {t("previewPDF")}
                  </Button>
                  <Button type="primary" onClick={handleSubmit}>
                    {t("updateQuestion")}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>

          <PDFPreview
            urlPDF={pdfUrl}
            isModalOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
          />
        </div>
      )}
    </Modal>
  );
};
