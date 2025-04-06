import { Table, Input, Button, Space, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Question } from "@/types/question";
import PDFPreview from "@/components/pdf/PDFPreview";
import { useAppDispatch } from "@/stores";
import { previewPDFFileThunk } from "@/stores/question/thunk";
import "../../../styles/table/QuestionSelectionTable.scss";
import { AiFillEye } from "react-icons/ai";

interface QuestionSelectionTableProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
  onRemoveQuestion: (question: Question) => void;
  selectedQuestions: Question[];
}

const QuestionSelectionTable: React.FC<QuestionSelectionTableProps> = ({
  questions,
  onSelectQuestion,
  onRemoveQuestion,
  selectedQuestions,
}) => {
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const dispatch = useAppDispatch();

  const handlePreview = async (questionId: string) => {
    const result = await dispatch(previewPDFFileThunk(questionId));
    if (result.meta.requestStatus === "fulfilled") {
      setPdfUrl(result.payload as string);
      setPreviewVisible(true);
    }
  };

  const filteredQuestions = questions.filter((question) =>
    question.content?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Nội dung câu hỏi",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 300,
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: Question) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<AiFillEye />}
              onClick={() => handlePreview(record.id!)}
            />
          </Tooltip>
          <Button
            type={
              selectedQuestions.some((q) => q.id === record.id)
                ? "default"
                : "primary"
            }
            onClick={() =>
              selectedQuestions.some((q) => q.id === record.id)
                ? onRemoveQuestion(record)
                : onSelectQuestion(record)
            }
          >
            {selectedQuestions.some((q) => q.id === record.id)
              ? "Bỏ chọn"
              : "Chọn"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="QuestionSelectionTable">
      <Input
        placeholder="Tìm kiếm câu hỏi"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={filteredQuestions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        rowClassName={(record) =>
          selectedQuestions.some((q) => q.id === record.id)
            ? "selected-row"
            : ""
        }
      />

      <PDFPreview
        urlPDF={pdfUrl}
        isModalOpen={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default QuestionSelectionTable;
