import PATH from "@/const/path";
import { RootState, useAppDispatch } from "@/stores";
import {
  editExamThunk,
  filterExamThunk,
  generateAutoExamThunk,
} from "@/stores/exam/thunk";
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import { Exam, FilterCondition } from "@/types/exam";
import { Question } from "@/types/question";
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
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

export const ExamCreationTemplate = () => {
  // authen
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();
  const { idExam } = useParams();
  const navigate = useNavigate();

  const [tagDisplay, setTagDisplay] = useState<TagQuestion[]>([]);
  const [mode, setMode] = useState<"auto" | "manual">("manual");

  // general
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([
    { numberQuestion: 0, tagAssignments: [] },
  ]);
  const [totalQuestion, setTotalQuestion] = useState<number>(0);
  const [semester, setSemester] = useState<string>("");
  const [examDate, setExamDate] = useState<Date>();
  const [time, setTime] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  // modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const { data: tagData } = useSelector(
    (state: RootState) => state.tagManagementReducer
  );
  const { pdfUrl, dataFilterList } = useSelector(
    (state: RootState) => state.examReducer
  );

  const dispatch = useAppDispatch();

  const addFilterConditionGroup = () => {
    setFilterConditions((prev) => [
      ...prev,
      { numberQuestion: 0, tagAssignments: [] },
    ]);
  };

  const handleFilterConditionChange = (
    index: number,
    tagId: number,
    optionId: number
  ) => {
    setFilterConditions((prev) => {
      const newConditions = [...prev];
      newConditions[index] = {
        ...newConditions[index],
        tagAssignments: [{ tagId, optionId }],
      };
      return newConditions;
    });
  };

  const handleExpectCountChange = (index: number, numberQuestion: number) => {
    setFilterConditions((prev) => {
      const newConditions = [...prev];
      newConditions[index] = {
        ...newConditions[index],
        numberQuestion,
      };
      return newConditions;
    });
  };

  const removeFilterConditionGroup = (index: number) => {
    setFilterConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestions((prev) => [...prev, question]);
  };

  const handleRemoveQuestion = (question: Question) => {
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
    setFilteredQuestions([]); // Clear filtered questions when modal is canceled
    setIsModalVisible(false);
  };

  const handleFilter = async (index: number) => {
    setCurrentFilterIndex(index);
    const currentFilter = filterConditions[index];

    let payload: Exam = {
      id: idExam,
      semester: semester,
      numberQuestion: currentFilter.numberQuestion,
      filterConditions: [currentFilter],
      subjectId: subjectAuthen?.id,
    };

    const actionResult = await dispatch(editExamThunk(payload));
    if (actionResult.meta.requestStatus === "fulfilled") {
      const filterResult = await dispatch(filterExamThunk(idExam!));
      if (filterResult.meta.requestStatus === "fulfilled") {
        // Only set filtered questions if we get valid data
        if (dataFilterList && dataFilterList.length > 0) {
          setFilteredQuestions(dataFilterList);
          setIsModalVisible(true);
        } else {
          // Optionally show a message that no questions were found
          setFilteredQuestions([]);
        }
      }
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
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
            {filterConditions.map((filterGroup, groupIndex) => (
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
                          onChange={(value) =>
                            handleFilterConditionChange(
                              groupIndex,
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
                    style={{ width: "100%" }}
                  >
                    Lọc câu hỏi cho bộ lọc này
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
                              <Button
                                type="primary"
                                danger
                                onClick={() => handleRemoveQuestion(record)}
                              >
                                Xóa
                              </Button>
                            ),
                          },
                        ]}
                      />
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
        {filteredQuestions.length > 0 ? (
          <Table
            dataSource={filteredQuestions}
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
                  <Button
                    type="primary"
                    disabled={selectedQuestions.some((q) => q.id === record.id)}
                    onClick={() => handleSelectQuestion(record)}
                  >
                    {selectedQuestions.some((q) => q.id === record.id)
                      ? "Đã chọn"
                      : "Chọn"}
                  </Button>
                ),
              },
            ]}
          />
        ) : (
          <p>Không tìm thấy câu hỏi nào phù hợp với bộ lọc này.</p>
        )}
      </Modal>
    </Content>
  );
};

export default ExamCreationTemplate;
