import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Modal,
  Tag,
  Space,
  Tooltip,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  createQuestionThunk,
  editQuestionThunk,
  getQuestionByIdThunk,
  previewPDFFileThunk,
} from "@/stores/question/thunk";
import { RootState, useAppDispatch } from "@/stores";
import PATH from "@/const/path";
import { Question } from "@/types/question";
import { Subject } from "@/types/subject";
import SingleQuestionTemplate from "./SingleQuestionTemplate";
import { TagAssignment } from "@/types/tagOption";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { questionActions } from "@/stores/question/slice";
import {
  QuestionDeleteModal,
  QuestionUpdateModal,
} from "../question-management";

interface QuestionCreationProp {
  idQuestion: string;
  subjectAuthen: Subject;
}

const BlockQuestionTemplate: React.FC<QuestionCreationProp> = ({
  idQuestion,
  subjectAuthen,
}) => {
  const { t } = useTranslation("question_creation");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [typeOfQuestion, setTypeOfQuestion] = useState<string>("Trắc nghiệm");
  const [contentQuestion, setContentQuestion] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] =
    useState<boolean>(false);
  const [idQuestionChild, setIdQuestionChild] = useState<string>("");
  const [modalKey, setModalKey] = useState(0);

  // Lấy dữ liệu câu hỏi cha từ reducer
  const { pdfUrl, dataById, deleteModalShow, editModalShow } = useSelector(
    (state: RootState) => state.questionReducer
  );

  // Delete Modal
  const [deleteQuestion, setDeleteQuestion] = useState<Question>();
  const handleModalDeleteOpen = () => {
    dispatch(questionActions.setDeleteModalVisibility(true));
  };
  const handleModalDeleteClose = () => {
    dispatch(questionActions.setDeleteModalVisibility(false));
  };

  // Update Modal
  const [updateQuestion, setUpdateQuestion] = useState<Question>();
  const handleModalEditOpen = () => {
    dispatch(questionActions.setEditModalVisibility(true));
  };
  const handleModalEditClose = () => {
    dispatch(questionActions.setEditModalVisibility(false));
  };

  useEffect(() => {
    if (!editModalShow) {
      dispatch(getQuestionByIdThunk(idQuestion));
    }
  }, [editModalShow, dispatch, idQuestion]);

  useEffect(() => {
    if (!deleteModalShow) {
      dispatch(getQuestionByIdThunk(idQuestion));
    }
  }, [deleteModalShow, dispatch, idQuestion]);

  // Xử lý preview PDF
  const handlePreviewPDF = () => {
    const payload: Question = {
      id: idQuestion,
      content: contentQuestion,
      type: typeOfQuestion,
      subjectId: subjectAuthen?.id,
      isParent: true,
      subQuestions: dataById?.subQuestions, // Sử dụng danh sách câu hỏi con từ reducer
    };

    dispatch(editQuestionThunk(payload)).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        dispatch(previewPDFFileThunk(idQuestion!)).then((actionResult) => {
          if (actionResult.meta.requestStatus === "fulfilled") {
            setIsModalOpen(true);
          }
        });
      }
    });
  };

  // Xử lý submit
  const handleSubmit = () => {
    const payload: Question = {
      id: idQuestion,
      content: contentQuestion,
      type: typeOfQuestion,
      subjectId: subjectAuthen?.id,
      isParent: true,
      subQuestions: dataById?.subQuestions,
    };

    dispatch(editQuestionThunk(payload)).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        navigate(
          PATH.QUESTION_MANAGEMENT.replace(":subjectName", subjectAuthen?.name!)
        );
      }
    });
  };

  const handleCreateQuestion = async () => {
    if (!subjectAuthen?.id) {
      console.error("Subject ID is missing");
      return;
    }

    const payload: Question = {
      subjectId: subjectAuthen.id,
      parentId: idQuestion,
    };

    const actionResult = await dispatch(createQuestionThunk(payload));

    if (actionResult.meta.requestStatus === "fulfilled") {
      const newQuestion = actionResult.payload as Question;
      if (newQuestion.id) {
        await dispatch(getQuestionByIdThunk(idQuestion));
        setIdQuestionChild(newQuestion.id);
        setModalKey((prev) => prev + 1);
        setIsAddQuestionModalOpen(true);
      }
    }
  };

  const handleCloseAddQuestionModal = (success = false) => {
    setIsAddQuestionModalOpen(false);
    if (success) {
      setModalKey((prev) => prev + 1); // Reset modal khi đóng thành công
      dispatch(getQuestionByIdThunk(idQuestion)); // Refresh dữ liệu
    }
  };

  // Lấy dữ liệu câu hỏi cha khi component mount
  useEffect(() => {
    dispatch(getQuestionByIdThunk(idQuestion));
  }, [dispatch, idQuestion]);

  useEffect(() => {
    // Khi modal add question đóng, fetch lại dữ liệu
    if (!isAddQuestionModalOpen) {
      dispatch(getQuestionByIdThunk(idQuestion));
    }
  }, [isAddQuestionModalOpen, dispatch, idQuestion]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{t("blockQuestion")}</h1>

      {/* Step 1: Nhập thông tin câu hỏi cha */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card title={t("stepOne")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span>{t("department")}</span>
                </label>
                <Input disabled value={subjectAuthen?.department?.name} />
              </Col>

              <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span>{t("subject")}</span>
                </label>
                <Input disabled value={subjectAuthen?.name} />
              </Col>

              {/* <Col xs={24} md={12}>
                <label className="ant-form-item-label">
                  <span>{t("typeQuestion")}</span>
                </label>
                <Input
                  placeholder={t("placeholderTypeQuestion")}
                  value={typeOfQuestion}
                  onChange={(e) => setTypeOfQuestion(e.target.value)}
                />
              </Col> */}

              <Col xs={24}>
                <label className="ant-form-item-label">
                  <span>{t("instructionalQuestion")}</span>
                </label>
                <Input.TextArea
                  value={contentQuestion}
                  onChange={(e) => setContentQuestion(e.target.value)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Step 2: Hiển thị bảng câu hỏi con */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card
            title={"2. " + t("subQuestions")}
            extra={
              <Button type="primary" onClick={handleCreateQuestion}>
                {t("addSubQuestion")}
              </Button>
            }
          >
            <Table
              dataSource={dataById?.subQuestions}
              columns={[
                {
                  title: t("contentQuestion"),
                  dataIndex: "content",
                  key: "content",
                },
                {
                  title: t("tag"),
                  dataIndex: "tagAssignments",
                  key: "tagAssignments",
                  className: "!text-center",
                  width: 300,
                  render: (tagAssignments: TagAssignment[]) => {
                    const MAX_OPTIONS = 3;
                    const visibleTagAssignments = tagAssignments.slice(
                      0,
                      MAX_OPTIONS
                    );
                    const hiddenTagAssignments =
                      tagAssignments.slice(MAX_OPTIONS);

                    // Hàm để xác định màu của tag dựa trên vị trí của nó
                    const getTagColor = (index: number) => {
                      switch (index) {
                        case 0:
                          return "red";
                        case 1:
                          return "blue";
                        case 2:
                          return "green";
                        default:
                          return "cyan";
                      }
                    };

                    return (
                      <>
                        {visibleTagAssignments.map((tagAssignment, index) => (
                          <Tag
                            color={getTagColor(index)}
                            key={tagAssignment.id}
                            className="mb-1"
                          >
                            {tagAssignment.option?.name}
                          </Tag>
                        ))}
                        {hiddenTagAssignments.length > 0 && (
                          <Tag color="cyan">
                            +{hiddenTagAssignments.length} more
                          </Tag>
                        )}
                      </>
                    );
                  },
                },
                {
                  title: t("actions"),
                  key: "actions",
                  className: "!text-center",
                  render: (record: Question) => (
                    <Space>
                      <Tooltip title={t("view details")}>
                        <span>
                          <AiFillEye
                            className="custom-icon"
                            onClick={() => {
                              dispatch(previewPDFFileThunk(record.id!)).then(
                                (actionResult) => {
                                  if (
                                    actionResult.meta.requestStatus ===
                                    "fulfilled"
                                  ) {
                                    setIsModalOpen(true);
                                  }
                                }
                              );
                            }}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title={t("edit")}>
                        <span>
                          <FiEdit
                            className="custom-icon"
                            onClick={() => {
                              setUpdateQuestion(record);
                              handleModalEditOpen();
                            }}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title={t("delete")}>
                        <span>
                          <AiFillDelete
                            className="custom-icon"
                            onClick={() => {
                              setDeleteQuestion(record);
                              handleModalDeleteOpen();
                            }}
                          />
                        </span>
                      </Tooltip>
                    </Space>
                  ),
                },
              ]}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Step 3: Nút lưu và xem trước PDF */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} className="flex justify-end">
          <Button onClick={() => navigate(-1)}>{t("cancel")}</Button>
          <Button type="primary" onClick={handleSubmit} className="ml-2">
            {t("save")}
          </Button>
          <Button type="primary" onClick={handlePreviewPDF} className="ml-2">
            {t("previewPdf")}
          </Button>
        </Col>
      </Row>

      {/* Modal xem trước PDF */}
      <Modal
        title={t("previewPdf")}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%"
      >
        <iframe src={pdfUrl} width="100%" height="500px" />
      </Modal>

      {/* Modal thêm câu hỏi đơn */}
      <Modal
        key={`add-question-modal-${modalKey}`}
        title={t("addSubQuestion")}
        visible={isAddQuestionModalOpen}
        onCancel={() => handleCloseAddQuestionModal()}
        footer={null}
        width="80%"
        destroyOnClose
      >
        <SingleQuestionTemplate
          key={`single-question-${modalKey}`}
          subjectAuthen={subjectAuthen}
          parentId={idQuestion}
          idQuestion={idQuestionChild}
          isParent={true}
          onCloseModal={handleCloseAddQuestionModal}
        />
      </Modal>

      <QuestionUpdateModal
        isModalOpen={editModalShow!}
        onClose={handleModalEditClose}
        questionData={updateQuestion!}
      />

      <QuestionDeleteModal
        isModalOpen={deleteModalShow!}
        onClose={handleModalDeleteClose}
        questionData={deleteQuestion!}
      />
    </div>
  );
};

export default BlockQuestionTemplate;
