import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Input,
  Space,
  Tooltip,
  message,
  Card,
  Row,
  Col,
  Select,
} from "antd";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch } from "@/stores";
import { Exam, FilterCondition } from "@/types/exam";
import { Question } from "@/types/question";
import { TagQuestion } from "@/types/tagQuestion";
import {
  editExamThunk,
  getExamByIdThunk,
  previewPDFFileThunk,
} from "@/stores/exam/thunk";
import { filterQuestionThunk } from "@/stores/question/thunk";
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import PDFPreview from "@/components/pdf/PDFPreview";
import QuestionSelectionTable from "../../exam-creation/QuestionSelectionTable";

const { Option } = Select;

interface ExamEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  examData: Exam | null;
  subjectId: string;
}

export const ExamEditModal = ({
  visible,
  onCancel,
  onSuccess,
  examData,
  subjectId,
}: ExamEditModalProps) => {
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");

  // State cho chế độ tạo đề
  const [mode, setMode] = useState<"auto" | "manual">("manual");

  // State cho bộ lọc
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([
    { tagAssignments: [] },
  ]);
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentTagsSelection, setCurrentTagsSelection] = useState<
    { tagId: number; optionId: number }[]
  >([]);
  const [tagDisplay, setTagDisplay] = useState<TagQuestion[]>([]);

  // State cho thông tin đề thi
  const [examCode, setExamCode] = useState<number>(0);
  const [semester, setSemester] = useState<string>("");
  const [totalQuestion, setTotalQuestion] = useState<number>(0);
  const [examDate, setExamDate] = useState<Date>();
  const [time, setTime] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (visible && examData) {
      loadExamData();
      loadTags();
    }
  }, [visible, examData]);

  const loadExamData = async () => {
    if (!examData) return;

    setLoading(true);
    try {
      // Load thông tin cơ bản
      setExamCode(examData.examCode || 0);
      setSemester(examData.semester || "");
      setTotalQuestion(examData.numberQuestion || 0);
      setExamDate(examData.date ? new Date(examData.date) : undefined);
      setTime(examData.duration || 0);
      //   setNote(examData.note || "");
      setFilterConditions(
        examData.filterConditions || [{ tagAssignments: [] }]
      );

      // Load các câu hỏi
      if (examData.questionIdList?.length! > 0) {
        const questionsData = await Promise.all(
          examData.questionIdList!.map(async (id) => {
            const result = await dispatch(getExamByIdThunk(id));
            return result.meta.requestStatus === "fulfilled"
              ? (result.payload as Question)
              : null;
          })
        );
        setQuestions(questionsData.filter((q) => q !== null) as Question[]);
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu đề thi");
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    const result = await dispatch(getAllTagsThunk());
    if (result.meta.requestStatus === "fulfilled") {
      setTagDisplay(result.payload as TagQuestion[]);
    }
  };

  const handlePreviewQuestion = async (questionId: string) => {
    const result = await dispatch(previewPDFFileThunk(questionId));
    if (result.meta.requestStatus === "fulfilled") {
      setPreviewPdfUrl(result.payload as string);
      setPreviewVisible(true);
    }
  };

  const handleFilterConditionChange = (tagId: number, optionId: number) => {
    setCurrentTagsSelection((prev) => {
      const existingIndex = prev.findIndex((a) => a.tagId === tagId);
      if (existingIndex >= 0) {
        const newSelection = [...prev];
        newSelection[existingIndex].optionId = optionId;
        return newSelection;
      }
      return [...prev, { tagId, optionId }];
    });
  };

  const handleSelectQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleFilter = async (index: number) => {
    try {
      const result = await dispatch(
        filterQuestionThunk({
          subjectId,
          tagAssignments: currentTagsSelection,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        const allQuestions = result.payload as Question[];
        // Lọc ra những câu hỏi chưa có trong đề thi
        const availableQuestions = allQuestions.filter(
          (q) => !questions.some((eq) => eq.id === q.id)
        );
        setFilteredQuestions(availableQuestions);
      }
    } catch (error) {
      message.error("Lỗi khi lọc câu hỏi");
    }
  };

  const handleSaveExam = async () => {
    if (!examData) return;

    const updatedExam: Exam = {
      ...examData,
      examCode,
      semester,
      numberQuestion: questions.length,
      date: examDate,
      duration: time,
      //   note,
      questionIdList: questions.map((q) => q.id!),
      filterConditions,
    };

    try {
      const result = await dispatch(editExamThunk(updatedExam));
      if (result.meta.requestStatus === "fulfilled") {
        message.success("Cập nhật đề thi thành công");
        onSuccess();
        onCancel();
      }
    } catch (error) {
      message.error("Có lỗi khi cập nhật đề thi");
    }
  };

  return (
    <Modal
      title={`Chỉnh sửa đề thi: ${examData?.name || ""}`}
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={null}
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "0 16px" }}>
        {/* Phần 1: Thông tin chung */}
        <Card
          title="1. Thông tin chung"
          style={{ marginBottom: 24 }}
          extra={
            <Space>
              <Button
                type={mode === "auto" ? "primary" : "default"}
                onClick={() => setMode("auto")}
              >
                Tự động
              </Button>
              <Button
                type={mode === "manual" ? "primary" : "default"}
                onClick={() => setMode("manual")}
              >
                Thủ công
              </Button>
            </Space>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <label>Mã đề</label>
              <Input
                value={examCode}
                onChange={(e) => setExamCode(Number(e.target.value))}
              />
            </Col>
            <Col span={12}>
              <label>Học kỳ</label>
              <Input
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <label>Số câu hỏi</label>
              <Input
                value={totalQuestion}
                onChange={(e) => setTotalQuestion(Number(e.target.value))}
              />
            </Col>
            <Col span={12}>
              <label>Ngày thi</label>
              <Input
                type="date"
                value={examDate?.toISOString().split("T")[0]}
                onChange={(e) => setExamDate(new Date(e.target.value))}
              />
            </Col>
            <Col span={12}>
              <label>Thời lượng (phút)</label>
              <Input
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </Col>
            <Col span={24}>
              <label>Ghi chú</label>
              <Input.TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Col>
          </Row>
        </Card>

        {/* Phần 2: Bộ lọc câu hỏi */}
        <Card title="2. Bộ lọc câu hỏi" style={{ marginBottom: 24 }}>
          {filterConditions.map((_, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                {tagDisplay.map((tag) => (
                  <Col span={12} key={tag.id}>
                    <label>{tag.name}</label>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleFilterConditionChange(tag.id!, value as number)
                      }
                    >
                      {tag.options?.map((option) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                ))}
              </Row>
              <Button
                type="primary"
                onClick={() => handleFilter(groupIndex)}
                style={{ marginTop: 16 }}
                disabled={currentTagsSelection.length === 0}
              >
                Lọc câu hỏi
              </Button>
            </div>
          ))}
        </Card>

        {/* Phần 3: Danh sách câu hỏi */}
        <Card
          title={`3. Danh sách câu hỏi (${questions.length}/${totalQuestion})`}
        >
          <Table
            dataSource={questions}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: "STT",
                key: "index",
                render: (_, __, index) => index + 1,
                width: 50,
              },
              {
                title: "Nội dung",
                dataIndex: "content",
                key: "content",
                ellipsis: true,
              },
              {
                title: "Hành động",
                key: "action",
                width: 120,
                render: (_, record) => (
                  <Space>
                    <Tooltip title="Xem chi tiết">
                      <Button
                        icon={<AiFillEye />}
                        onClick={() => handlePreviewQuestion(record.id!)}
                      />
                    </Tooltip>
                    <Button
                      danger
                      onClick={() => handleRemoveQuestion(record.id!)}
                    >
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </div>

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button
          type="primary"
          onClick={handleSaveExam}
          loading={loading}
          disabled={questions.length === 0}
        >
          Lưu thay đổi
        </Button>
      </div>

      {/* Modal chọn câu hỏi */}
      <Modal
        title="Chọn câu hỏi"
        open={filteredQuestions.length > 0}
        onCancel={() => setFilteredQuestions([])}
        width={1000}
        footer={null}
      >
        <QuestionSelectionTable
          questions={filteredQuestions}
          onSelectQuestion={handleSelectQuestion}
          onRemoveQuestion={() => {}}
          selectedQuestions={questions}
        />
      </Modal>

      {/* Xem trước PDF */}
      <PDFPreview
        urlPDF={previewPdfUrl}
        isModalOpen={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
    </Modal>
  );
};

export default ExamEditModal;
