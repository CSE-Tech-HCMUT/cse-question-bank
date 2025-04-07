import PDFPreview from "@/components/pdf/PDFPreview";
import PATH from "@/const/path";
import { RootState, useAppDispatch } from "@/stores";
import { examActions } from "@/stores/exam/slice";
import {
  createExamThunk,
  getAllExamsThunk,
  previewPDFFileThunk,
} from "@/stores/exam/thunk";
import { Exam } from "@/types/exam";
import { Subject } from "@/types/subject";
import { Button, Space, TableProps, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { AiFillDelete, AiFillEye, AiFillProfile } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ExamDeleteModal, ExamShuffleModal } from "./modal";

export const ExamManagementTemplate = () => {
  const navigate = useNavigate();

  // Authen
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();

  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const handlePagination: TableProps<Exam>["onChange"] = (pagination) => {
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
  };

  const { data, deleteModalShow, pdfUrl, shuffleModalShow } = useSelector(
    (state: RootState) => state.examReducer
  );
  const dispatch = useAppDispatch();

  const handleClickCreateExam = () => {
    dispatch(
      createExamThunk({
        subjectId: subjectAuthen?.id,
      })
    ).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        const idExam = (actionResult.payload as Exam).id;

        if (idExam) {
          navigate(
            PATH.EXAM_CREATION.replace(":subjectName", subjectAuthen?.name!) +
              "/" +
              idExam
          );
        }
      }
    });
  };

  // Delete Modal
  const [deleteExam, setDeleteExam] = useState<Exam>();

  const handleModalDeleteOpen = () => {
    dispatch(examActions.setDeleteModalVisibility(true));
  };

  const handleModalDeleteClose = () => {
    dispatch(examActions.setDeleteModalVisibility(false));
  };

  // Shuffle Modal
  const [shuffleExam, setShuffleExam] = useState<Exam>();

  const handleModalShuffleOpen = () => {
    dispatch(examActions.setShuffleModalVisibility(true));
  };

  const handleModalShuffleClose = () => {
    dispatch(examActions.setShuffleModalVisibility(false));
  };

  const handlePreviewPdf = (id: string) => {
    console.log(id);

    dispatch(previewPDFFileThunk(id)).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        setIsModalOpen(true);
      }
    });
  };

  const TitleTable = () => (
    <div className="flex sm:justify-end">
      <Space wrap>
        <Button
          type="primary"
          icon={<FaPlusCircle />}
          size={"middle"}
          onClick={handleClickCreateExam}
        >
          {"Tạo đề thi"}
        </Button>
      </Space>
    </div>
  );

  const columns: ColumnsType<Exam> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      className: "!text-center",
      render: (_text, _record, index: number) => (
        <span className="text-primary">
          {index + pageSize * (current - 1) + 1}
        </span>
      ),
    },
    {
      title: "Tên kì thi",
      dataIndex: "name",
      key: "name",
      className: "!text-center",
      render: (_text: string) => (
        <span className="text-primary">{"Cuối kì"}</span>
      ),
    },
    {
      title: "Học kì",
      dataIndex: "semester",
      key: "semester",
      className: "!text-center",
      render: (_text: string) => <span className="text-primary">{241}</span>,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      className: "!text-center",
      render: (_text: string) => <span className="text-primary">{90}</span>,
    },
    {
      title: "Số lượng câu hỏi",
      dataIndex: "numberQuestion",
      key: "numberQuestion",
      className: "!text-center",
      render: (text: number) => <span className="text-primary">{text}</span>,
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      className: "!text-center",
      width: 200,
      render: (subject: Subject) => (
        <span className="text-primary">{subject?.name}</span>
      ),
    },
    {
      title: "Ngày thi",
      dataIndex: "date",
      key: "date",
      className: "!text-center",
      render: (_text: string) => (
        <span className="text-primary">
          {new Date("2025-05-17").toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      className: "!text-center",
      render: (record: Exam) => (
        <Space>
          <Tooltip title={"Quản lý việc trộn đề thi"}>
            <span>
              <AiFillProfile
                className="custom-icon"
                onClick={() => {
                  handleModalShuffleOpen();
                  setShuffleExam(record);
                }}
              />
            </span>
          </Tooltip>
          <Tooltip title={"Xem chi tiết"}>
            <span>
              <AiFillEye
                className="custom-icon"
                onClick={() => {
                  handlePreviewPdf(record.id!);
                }}
              />
            </span>
          </Tooltip>
          <Tooltip title={"Chỉnh sửa"}>
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
          <Tooltip title={"Xóa"}>
            <span>
              <AiFillDelete
                className="custom-icon"
                onClick={() => {
                  setDeleteExam(record);
                  handleModalDeleteOpen();
                }}
              />
            </span>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const storedSubject = localStorage.getItem("subjectAuthen");
    if (storedSubject) {
      setSubjectAuthen(JSON.parse(storedSubject));
    }

    dispatch(getAllExamsThunk()).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        setTotal(data?.length!);
        setLoading(false);
      }
    });
  }, []);

  return (
    <main className="bg-gray-100 rounded-md">
      <h1 className="text-3xl font-bold mb-4">{"Quản lý đề thi"}</h1>

      {/* table */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <Table
          rowKey="id"
          loading={loading}
          title={TitleTable}
          columns={columns}
          dataSource={data?.filter(
            (exam) => exam.subject?.id === subjectAuthen?.id
          )}
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
      <ExamDeleteModal
        isModalOpen={deleteModalShow!}
        onClose={handleModalDeleteClose}
        examData={deleteExam!}
      />
      <ExamShuffleModal
        isModalOpen={shuffleModalShow!}
        onClose={handleModalShuffleClose}
        examData={shuffleExam!}
      />

      <PDFPreview urlPDF={pdfUrl} isModalOpen={isModalOpen} onClose={onClose} />
    </main>
  );
};

export default ExamManagementTemplate;
