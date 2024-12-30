import PATH from "@/const/path";
import { RootState, useAppDispatch } from "@/stores";
import { editExamThunk, generateAutoExamThunk } from "@/stores/exam/thunk";
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import { Exam, FilterCondition } from "@/types/exam";
import { Subject } from "@/types/subject";
import { TagQuestion } from "@/types/tagQuestion";
import { Button, Card, Col, Input, Layout, Row, Select } from "antd";
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
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([{ numberQuestion: 0, tagAssignments: [] }]);
  const [totalQuestion, setTotalQuestion] = useState<number>(0);
  const [semester, setSemester] = useState<string>('');
  const [examDate, setExamDate] = useState<Date>();
  const [time, setTime] = useState<number>(0);
  const [note, setNote] = useState<string>('');

  const { data: tagData } = useSelector((state: RootState) => state.tagManagementReducer);
  const { pdfUrl } = useSelector((state: RootState) => state.examReducer);

  const dispatch = useAppDispatch();

  // General
  const handleFilterConditionChange = (index: number, tagId: number, optionId: number) => {
    setFilterConditions((prev) => {
      const newConditions = [...prev];
      newConditions[index] = {
        ...newConditions[index],
        tagAssignments: [{ tagId, optionId }]
      };
      return newConditions;
    });
  };

  const handleExpectCountChange = (index: number, numberQuestion: number) => {
    setFilterConditions((prev) => {
      const newConditions = [...prev];
      newConditions[index] = {
        ...newConditions[index],
        numberQuestion
      };
      return newConditions;
    });
  };

  const addFilterConditionGroup = () => {
    setFilterConditions((prev) => [...prev, { numberQuestion: 0, tagAssignments: [] }]);
  };

  const removeFilterConditionGroup = (index: number) => {
    setFilterConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    let payload: Exam = {
      id: idExam,
      semester: semester,
      numberQuestion: totalQuestion,
      filterConditions: filterConditions,
      subjectId: subjectAuthen?.id
    }

    dispatch(editExamThunk(payload)).then((actionResult) => { 
      if (actionResult.meta.requestStatus === 'fulfilled') {
        dispatch(generateAutoExamThunk(idExam!)).then((actionResult) => {
          if (actionResult.meta.requestStatus === 'fulfilled'){
            navigate(PATH.EXAM_MANAGEMENT.replace(':subjectName', subjectAuthen?.name!));
          }
        })
      }
    })
  };

  useEffect(() => {
    const storedSubject = localStorage.getItem('subjectAuthen');
    if (storedSubject) {
      setSubjectAuthen(JSON.parse(storedSubject));
    }
    dispatch(getAllTagsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (tagData) {
      setTagDisplay(tagData.filter(tag => tag.subject?.id === subjectAuthen?.id));
    }
  }, [tagData, subjectAuthen]);

  return (
    <Content className="ExamCreationTemplate" style={{ background: '#f0f2f5' }}>
      <h1 className="text-xl font-semibold mb-4">{"Tạo đề thi"}</h1>

      {/* Step 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card style={{ height: '100%' }} title={"1. Nhập thông tin tổng quát cho đề thi"}>
            <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { "Khoa" } </span>
                </label>
                <Input disabled value={subjectAuthen?.department?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { "Môn học" } </span>
                </label>
                <Input disabled value={subjectAuthen?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { "Học kỳ" } </span>
                </label>
                <Input placeholder={"Nhập học kỳ"} name="semester" onChange={(event) => {
                  setSemester(event.target.value);
                }} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { "Tổng số câu hỏi" } </span>
                </label>
                <Input placeholder={"Nhập số câu hỏi của đề thi"} name="totalQuestion" onChange={(event) => {
                  setTotalQuestion(Number(event.target.value));
                }} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { "Ngày thi" } </span>
                </label>
                <Input type="date" placeholder={"Chọn ngày thi"} name="examDate" onChange={(event) => {
                  setExamDate(new Date(event.target.value));
                }} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span> { "Thời lượng thi (phút)" } </span>
                </label>
                <Input placeholder={"Nhập thời gian thi (phút)"} name="time" onChange={(event) => {
                  setTime(Number(event.target.value));
                }} />
              </Col>

              <Col xs={24}>
                <label className="ant-form-item-label">
                  <span> { "Ghi chú" } </span>
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
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card style={{ height: '100%' }} title={`2. Chọn các yêu cầu cho câu hỏi trong đề thi`}>
            {
              filterConditions.map((filterGroup, groupIndex) => (
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }} key={`group-${groupIndex}`}>
                  {tagDisplay.map((tag, index) => (
                    <Col xs={8} key={`${groupIndex}-${index}`}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24}>
                          <label className="ant-form-item-label">
                            <span>{tag.name}</span>
                          </label>
                          <Select
                            placeholder={"Chọn thông tin nhãn"}
                            style={{ width: '100%' }}
                            onChange={(value) => handleFilterConditionChange(groupIndex, tag.id!, value as number)}
                          >
                            {tag.options!.map((option) => (
                              <Option
                                key={option.id}
                                value={option.id}
                              >
                                {option.name}
                              </Option>
                            ))}
                          </Select>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                  <Col xs={8}>
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
                          onChange={(e) => handleExpectCountChange(groupIndex, parseInt(e.target.value, 10))}
                        />
                      </Col>
                      <Col xs={4}>
                        <Button
                          style={{
                            position: 'absolute',
                            right: '20%',
                            top: '50%',
                            transform: 'translateY(-18%)',
                            backgroundColor: '#da1a17'
                          }}
                          type="primary"
                          onClick={() => removeFilterConditionGroup(groupIndex)}
                        >
                          <AiFillDelete />
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))
            }
            <Col xs={24}>
              <Button
                type="dashed"
                onClick={addFilterConditionGroup}
                style={{ width: '100%' }}>
                Thêm nhóm bộ lọc
              </Button>
            </Col>
          </Card>
        </Col>
      </Row>

      {/* Step 3 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card
            style={{ height: '100%' }}
            title={"3. Nhập thông tin cho đề thi"}
            extra={
              <div className="flex justify-center">
                <Button
                  type={mode === "auto" ? "primary" : "default"}
                  onClick={() => setMode("auto")}>
                  {"Tự động"}
                </Button>
                <Button
                  type={mode === "manual" ? "primary" : "default"}
                  className="ml-2"
                  onClick={() => setMode("manual")}>
                  {"Thủ công"}
                </Button>
              </div>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
              {
                mode === "auto" ? (
                  <Col xs={24} className="text-center">
                    <Button type="primary" onClick={handleSubmit}>
                      Tạo đề thi
                    </Button>
                  </Col>
                ) : (
                  // Content for manual mode
                  <></>
                )
              }
            </Row>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default ExamCreationTemplate;
