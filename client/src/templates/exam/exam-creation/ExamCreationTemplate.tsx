import PATH from "@/const/path";
import { RootState, useAppDispatch } from "@/stores";
import { editExamThunk, generateAutoExamThunk } from "@/stores/exam/thunk";
import {
  filterQuestionThunk,
  previewPDFFileThunk,
} from "@/stores/question/thunk";
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import { Exam, FilterCondition } from "@/types/exam";
import { Question, QuestionFilter } from "@/types/question";
import { Subject } from "@/types/subject";
import { TagQuestion } from "@/types/tagQuestion";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import QuestionSelectionTable from "./QuestionSelectionTable";
import PDFPreview from "@/components/pdf/PDFPreview";
import { AiFillEye } from "react-icons/ai";

const { Content } = Layout;
const { Option } = Select;

export const ExamCreationTemplate = () => {
  // authen
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();
  const { idExam } = useParams();
  const navigate = useNavigate();

  const [tagDisplay, setTagDisplay] = useState<TagQuestion[]>([]);
  const [mode, setMode] = useState<"auto" | "manual">("manual");

  // pdf question
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");

  const handlePreviewQuestion = async (questionId: string) => {
    const result = await dispatch(previewPDFFileThunk(questionId));
    if (result.meta.requestStatus === "fulfilled") {
      setPreviewPdfUrl(result.payload as string);
      setPreviewVisible(true);
    }
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
  };

  // general
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([
    { tagAssignments: [] },
  ]);
  const [totalQuestion, setTotalQuestion] = useState<number>(0);
  const [semester, setSemester] = useState<string>("");
  const [examDate, setExamDate] = useState<Date>();
  const [time, setTime] = useState<number>(0);
  const [_note, setNote] = useState<string>("");

  // modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentTagsSelection, setCurrentTagsSelection] = useState<
    { tagId: number; optionId: number }[]
  >([]);

  const { data: tagData } = useSelector(
    (state: RootState) => state.tagManagementReducer
  );
  const { pdfUrl } = useSelector((state: RootState) => state.examReducer);

  const dispatch = useAppDispatch();

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
    setFilterConditions((prev) => {
      const newConditions = [...prev];
      const currentFilter = newConditions[currentFilterIndex];

      newConditions[currentFilterIndex] = {
        ...currentFilter,
        questions: [...(currentFilter.questions || []), question],
      };

      return newConditions;
    });

    setSelectedQuestions((prev) => [...prev, question]);
  };

  const handleRemoveQuestion = (question: Question) => {
    setFilterConditions((prev) => {
      return prev.map((filter) => ({
        ...filter,
        questions: filter.questions?.filter((q) => q.id !== question.id) || [],
      }));
    });

    setSelectedQuestions((prev) => prev.filter((q) => q.id !== question.id));
  };

  const handleSubmit = () => {
    let payload: Exam = {
      id: idExam,
      semester: semester,
      numberQuestion: totalQuestion,
      filterConditions: filterConditions,
      subjectId: subjectAuthen?.id,
    };

    dispatch(editExamThunk(payload)).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        dispatch(generateAutoExamThunk(idExam!)).then((actionResult) => {
          if (actionResult.meta.requestStatus === "fulfilled") {
            navigate(
              PATH.EXAM_MANAGEMENT.replace(":subjectName", subjectAuthen?.name!)
            );
          }
        });
      }
    });
  };

  const handleModalCancel = () => {
    setFilteredQuestions([]);
    setIsModalVisible(false);
    setCurrentTagsSelection([]);
  };

  const handleCreateExamFromSelected = () => {
    if (selectedQuestions.length === 0) {
      Modal.warning({
        title: "Cảnh báo",
        content: "Vui lòng chọn ít nhất một câu hỏi để tạo đề thi",
      });
      return;
    }

    // Tạo filterConditions mới chỉ chứa các filter có câu hỏi đã chọn
    const validFilterConditions = filterConditions.filter(
      (filter) => filter.questions && filter.questions.length > 0
    );

    const questionIdList = selectedQuestions.map((q) => q.id!);

    let payload: Exam = {
      id: idExam,
      semester: semester,
      numberQuestion: selectedQuestions.length,
      filterConditions: validFilterConditions,
      subjectId: subjectAuthen?.id,
      questionIdList: questionIdList,
      duration: time,
      date: examDate,
    };
    console.log(payload);

    dispatch(editExamThunk(payload)).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        navigate(
          PATH.EXAM_MANAGEMENT.replace(":subjectName", subjectAuthen?.name!)
        );
      }
    });
  };

  const handleFilter = async (index: number) => {
    setCurrentFilterIndex(index);

    // Tạo bộ lọc mới từ currentTagsSelection
    const newFilterCondition: FilterCondition = {
      tagAssignments: [...currentTagsSelection],
      questions: [],
    };

    // Cập nhật filterConditions với bộ lọc mới
    setFilterConditions((prev) => {
      const newConditions = [...prev];
      newConditions[index] = newFilterCondition;
      return newConditions;
    });

    let payload: QuestionFilter = {
      subjectId: subjectAuthen?.id,
      tagAssignments: currentTagsSelection,
    };

    const actionResult = await dispatch(filterQuestionThunk(payload));
    if (actionResult.meta.requestStatus === "fulfilled") {
      const filteredData = actionResult.payload as Question[];
      if (filteredData && filteredData.length > 0) {
        setFilteredQuestions(filteredData);
        setIsModalVisible(true);
      } else {
        setFilteredQuestions([]);
        Modal.info({
          title: "Thông báo",
          content: "Không tìm thấy câu hỏi nào phù hợp với bộ lọc này",
        });
      }
    }

    // Reset selection sau khi lọc
    setCurrentTagsSelection([]);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setCurrentTagsSelection([]);
  };

  useEffect(() => {
    const storedSubject = localStorage.getItem("subjectAuthen");
    if (storedSubject) {
      setSubjectAuthen(JSON.parse(storedSubject));
    }
    dispatch(getAllTagsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (tagData) {
      setTagDisplay(
        tagData.filter((tag) => tag.subject?.id === subjectAuthen?.id)
      );
    }
  }, [tagData, subjectAuthen]);

  return (
    <Content className="ExamCreationTemplate" style={{ background: "#f0f2f5" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold mb-4">{"Tạo đề thi"}</h1>
        <Tooltip
          title={
            <p>
              Tạo thủ công: Bạn sẽ tự chọn từng câu hỏi từ danh sách. <br /> Tạo
              tự động: Hệ thống sẽ tự động tạo đề thi dựa trên ma trận và lịch
              sử.
            </p>
          }
        >
          <QuestionCircleOutlined className="text-xl pb-3" />
        </Tooltip>
      </div>
      {/* Step 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card
            style={{ height: "100%" }}
            title={"1. Nhập thông tin tổng quát cho đề thi"}
            extra={
              <div className="flex justify-center">
                <Button
                  type={mode === "auto" ? "primary" : "default"}
                  onClick={() => setMode("auto")}
                >
                  {"Tự động"}
                </Button>
                <Button
                  type={mode === "manual" ? "primary" : "default"}
                  className="ml-2"
                  onClick={() => setMode("manual")}
                >
                  {"Thủ công"}
                </Button>
              </div>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "12px" }}>
              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> {"Khoa"} </span>
                </label>
                <Input disabled value={subjectAuthen?.department?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> {"Môn học"} </span>
                </label>
                <Input disabled value={subjectAuthen?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> {"Học kỳ"} </span>
                </label>
                <Input
                  placeholder={"Nhập học kỳ"}
                  name="semester"
                  onChange={(event) => {
                    setSemester(event.target.value);
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> {"Tổng số câu hỏi"} </span>
                </label>
                <Input
                  placeholder={"Nhập số câu hỏi của đề thi"}
                  name="totalQuestion"
                  onChange={(event) => {
                    setTotalQuestion(Number(event.target.value));
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> {"Ngày thi"} </span>
                </label>
                <Input
                  type="date"
                  placeholder={"Chọn ngày thi"}
                  name="examDate"
                  onChange={(event) => {
                    setExamDate(new Date(event.target.value));
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> {"Thời lượng thi (phút)"} </span>
                </label>
                <Input
                  placeholder={"Nhập thời gian thi (phút)"}
                  name="time"
                  onChange={(event) => {
                    setTime(Number(event.target.value));
                  }}
                />
              </Col>

              <Col xs={24}>
                <label className="ant-form-item-label">
                  <span> {"Ghi chú"} </span>
                </label>
                <Input.TextArea
                  placeholder={"Nhập ghi chú cho đề thi"}
                  name="note"
                  onChange={(event) => {
                    setNote(event.target.value);
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* Step 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card
            style={{ height: "100%" }}
            title={`2. Chọn các yêu cầu cho câu hỏi trong đề thi`}
          >
            {filterConditions.map((_filterGroup, groupIndex) => (
              <Row
                gutter={[16, 16]}
                style={{ marginBottom: "24px" }}
                key={`group-${groupIndex}`}
              >
                {tagDisplay.map((tag, index) => (
                  <Col xs={12} key={`${groupIndex}-${index}`}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <label className="ant-form-item-label">
                          <span>{tag.name}</span>
                        </label>
                        <Select
                          placeholder={"Chọn thông tin nhãn"}
                          style={{ width: "100%" }}
                          value={
                            currentTagsSelection.find((a) => a.tagId === tag.id)
                              ?.optionId
                          }
                          onChange={(value) =>
                            handleFilterConditionChange(
                              tag.id!,
                              value as number
                            )
                          }
                        >
                          {tag.options!.map((option) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                  </Col>
                ))}
                {/* <Col xs={8}>
                  <Row gutter={[16, 16]} className="relative">
                    <Col xs={20}>
                      <label className="ant-form-item-label">
                        <span>Số câu hỏi mong muốn</span>
                      </label>
                      <Input
                        placeholder={"Nhập số câu hỏi mong muốn"}
                        name="expectCount"
                        type="number"
                        value={filterGroup?.numberQuestion}
                        onChange={(e) =>
                          handleExpectCountChange(
                            groupIndex,
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </Col>
                    <Col xs={4}>
                      <Button
                        style={{
                          position: "absolute",
                          right: "20%",
                          top: "50%",
                          transform: "translateY(-18%)",
                          backgroundColor: "#da1a17",
                        }}
                        type="primary"
                        onClick={() => removeFilterConditionGroup(groupIndex)}
                      >
                        <AiFillDelete />
                      </Button>
                    </Col>
                  </Row>
                </Col> */}
                <Col xs={24}>
                  <Button
                    type="primary"
                    onClick={() => handleFilter(groupIndex)}
                    style={{ width: "100%", marginBottom: 16 }}
                    disabled={currentTagsSelection.length === 0}
                  >
                    Lọc câu hỏi cho bộ lọc này
                  </Button>
                  <Button
                    onClick={() => setCurrentTagsSelection([])}
                    style={{ width: "100%" }}
                  >
                    Reset bộ lọc
                  </Button>
                </Col>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>
      {/* Step 3 */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card
            style={{ height: "100%" }}
            title={"3. Nhập thông tin cho đề thi"}
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "12px" }}>
              {mode === "auto" ? (
                <Col xs={24} className="text-center">
                  <Button type="primary" onClick={handleSubmit}>
                    Tạo đề thi
                  </Button>
                </Col>
              ) : (
                <Col xs={24}>
                  <Card title="Đề thi" bordered>
                    <div style={{ marginBottom: "16px", fontWeight: "bold" }}>
                      {`Số câu hỏi hiện có: ${selectedQuestions.length}`}
                    </div>

                    {selectedQuestions.length > 0 ? (
                      <>
                        <Table
                          dataSource={selectedQuestions}
                          rowKey="id"
                          pagination={{
                            pageSize: 5,
                          }}
                          columns={[
                            {
                              title: "Câu hỏi",
                              dataIndex: "content",
                              key: "content",
                            },
                            {
                              title: "Hành động",
                              key: "action",
                              render: (_, record) => (
                                <Space>
                                  <Tooltip title="Xem chi tiết">
                                    <Button
                                      icon={<AiFillEye />}
                                      onClick={() =>
                                        handlePreviewQuestion(record.id!)
                                      }
                                    />
                                  </Tooltip>
                                  <Button
                                    type="primary"
                                    danger
                                    onClick={() => handleRemoveQuestion(record)}
                                  >
                                    Xóa
                                  </Button>
                                </Space>
                              ),
                            },
                          ]}
                        />
                        <div style={{ textAlign: "right", marginTop: 16 }}>
                          <Button
                            type="primary"
                            onClick={handleCreateExamFromSelected}
                          >
                            Tạo đề thi từ các câu hỏi đã chọn
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p>Chưa có câu hỏi nào được chọn.</p>
                    )}
                  </Card>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
      {/* Modal for filtered questions */}

      <Modal
        title={`Chọn câu hỏi cho bộ lọc ${currentFilterIndex + 1}`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Đóng
          </Button>,
        ]}
      >
        <QuestionSelectionTable
          questions={filteredQuestions}
          onSelectQuestion={handleSelectQuestion}
          onRemoveQuestion={handleRemoveQuestion}
          selectedQuestions={selectedQuestions}
        />
      </Modal>

      <PDFPreview
        urlPDF={previewPdfUrl}
        isModalOpen={previewVisible}
        onClose={handlePreviewClose}
      />
    </Content>
  );
};

export default ExamCreationTemplate;
