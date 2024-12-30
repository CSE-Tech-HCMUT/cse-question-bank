import { RootState, useAppDispatch } from "@/stores";
import { questionActions } from "@/stores/question/slice";
import { createQuestionThunk, getAllQuestionsThunk, previewPDFFileThunk } from "@/stores/question/thunk";
import { Question } from "@/types/question";
import { TagAssignment } from "@/types/tagOption";
import { Button, Space, TableProps, Tag, Tooltip } from "antd"
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { QuestionDeleteModal } from "./modal";
import { useNavigate } from "react-router-dom";
import PATH from "@/const/path";
import PDFPreview from "@/components/pdf/PDFPreview";
import { Subject } from "@/types/subject";

export const QuestionManagementTemplate = () => {
  const { t } = useTranslation('question_management')

  const navigate = useNavigate();

  // Authen
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();

  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const { pdfUrl } = useSelector((state: RootState) => state.questionReducer);

  const handlePagination: TableProps<Question>["onChange"] = (pagination) => {
    if (pagination?.current !== current) setCurrent(pagination.current!);
    if (pagination?.pageSize !== pageSize) {
        setPageSize(pagination.pageSize!);
        setCurrent(1);
    }
  };
  
  // pdf
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const onClose = () => { 
    setIsModalOpen(false);
  }

  const { data, deleteModalShow } = useSelector((state: RootState) => state.questionReducer);
  const dispatch = useAppDispatch();

  const handleClickCreateQuestion = () => {
    dispatch(createQuestionThunk({
      subjectId: subjectAuthen?.id
    }))
      .then((actionResult) => {
        if (actionResult.meta.requestStatus === 'fulfilled') {
          const idQuestion = (actionResult.payload as Question).id;
  
          if (idQuestion) {
            navigate(PATH.QUESTION_CREATION.replace(':subjectName', subjectAuthen?.name!) + '/' + idQuestion);
          } 
        }
      }
    )
  };

  // Delete Modal
  const [deleteQuestion, setDeleteQuestion] = useState<Question>();

  const handleModalDeleteOpen = () => {
    dispatch(questionActions.setDeleteModalVisibility(true));
  };

  const handleModalDeleteClose = () => {
    dispatch(questionActions.setDeleteModalVisibility(false));
  };

  const TitleTable = () => (
    <div className="flex sm:justify-end">
      <Space wrap>
        <Button
            type="primary"
            icon={<FaPlusCircle />}
            size={'middle'}
            onClick={handleClickCreateQuestion}
        >
            { t("create question") }
        </Button>
      </Space>
    </div>
  )

  const columns: ColumnsType<Question> = [
    {
      title: t("no"),
      dataIndex: "id",
      key: "id",
      className: "!text-center",
      render: (_text, _record, index: number) => <span className="text-primary">{index + pageSize*(current - 1) + 1}</span>
    },
    {
      title: t("content"),
      dataIndex: "content",
      key: "content",
      render: (text: string) => <span className="text-primary">{text}</span>
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text: string) => <span className="text-primary">{text}</span>
    },
    {
      title: t("subject"),
      dataIndex: "subject",
      key: "subject",
      width: 150,
      render: (subject: Subject) => <span className="text-primary">{subject?.name}</span>
    },
    {
      title: t("tag"),
      dataIndex: "tagAssignments",
      key: "tagAssignments",
      className: "!text-center",
      width: 300,
      render: (tagAssignments: TagAssignment[]) => {
        const MAX_OPTIONS = 3;
        const visibleTagAssignments = tagAssignments.slice(0, MAX_OPTIONS);
        const hiddenTagAssignments = tagAssignments.slice(MAX_OPTIONS);
    
        // Hàm để xác định màu của tag dựa trên vị trí của nó
        const getTagColor = (index: number) => {
          switch(index) {
            case 0:
              return 'red';
            case 1:
              return 'blue';
            case 2:
              return 'green';
            default:
              return 'cyan';
          }
        };
    
        return (
          <>
            {
              visibleTagAssignments.map((tagAssignment, index) => (
                <Tag color={getTagColor(index)} key={tagAssignment.id} className="mb-1">
                  {tagAssignment.option?.name}
                </Tag>
              ))
            }
            {hiddenTagAssignments.length > 0 && (
              <Tag color="cyan">+{hiddenTagAssignments.length} more</Tag>
            )}
          </>
        )
      }
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
                        dispatch(previewPDFFileThunk(record.id!)).then((actionResult) => { 
                          if (actionResult.meta.requestStatus === 'fulfilled') {
                            setIsModalOpen(true);
                          }
                        })
                        // setViewTagQuestion(record);
                        // handleModalViewOpen();
                      }}
                    />
                </span>
            </Tooltip>
            <Tooltip title={t("edit")}>
                <span>
                    <FiEdit 
                      className="custom-icon" 
                      onClick={() => { 
                        // setEditTagQuestion(record);
                        // handleModalEditOpen();
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
    }
  ]

  useEffect(() => { 
    const storedSubject = localStorage.getItem('subjectAuthen'); 
    if (storedSubject) { 
      setSubjectAuthen(JSON.parse(storedSubject)); 
    } 

    dispatch(getAllQuestionsThunk()).then((actionResult) => {
      if(actionResult.meta.requestStatus === "fulfilled"){
        setTotal(data?.length!);
        setLoading(false);
      }
    });
  }, []);
  
  return (
    <main className="bg-gray-100 rounded-md">
      <h1 className="text-3xl font-bold mb-4">
        { t("question management") }
      </h1>

      {/* table */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <Table
          rowKey="id"
          loading={loading}
          title={TitleTable}
          columns={columns}
          dataSource={data?.filter((question) => question.subject?.id === subjectAuthen?.id)}
          onChange={handlePagination}
          scroll={{ x: 1000 }}
          size="middle"
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
        />
      </div>

      {/* Modal */}
      <QuestionDeleteModal isModalOpen={deleteModalShow!} onClose={handleModalDeleteClose} questionData={deleteQuestion!} />

      <PDFPreview urlPDF={pdfUrl} isModalOpen={isModalOpen} onClose={onClose} />
    </main>
  )
}

export default QuestionManagementTemplate