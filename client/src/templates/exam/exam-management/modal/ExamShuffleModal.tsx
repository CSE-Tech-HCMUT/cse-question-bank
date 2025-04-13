import {
  Modal,
  Button,
  Typography,
  Table,
  Space,
  Tag,
  message,
  InputNumber,
  Form,
} from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/stores";
import { Exam } from "@/types/exam";
import { useState, useEffect } from "react";
import PDFPreview from "@/components/pdf/PDFPreview";
import { shuffleExamThunk } from "@/stores/exam/thunk";

const { Text, Title } = Typography;

export const ExamShuffleModal = ({
  isModalOpen,
  onClose,
  examData,
}: {
  isModalOpen: boolean;
  onClose: () => void;
  examData: Exam | null;
}) => {
  const dispatch = useAppDispatch();
  const [shuffledExams, setShuffledExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [showShuffleForm, setShowShuffleForm] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen && examData?.shuffledExams) {
      //   setShuffledExams(examData.shuffledExams);
    }
  }, [isModalOpen, examData]);

  const handleShuffleClick = () => {
    setShowShuffleForm(true);
  };

  const onShuffle = async (values: { count: number }) => {
    if (!examData?.id) return;

    setLoading(true);
    try {
      const actionResult = await dispatch(
        shuffleExamThunk({
          examId: examData.id,
          isShuffleInsideQuestions: true,
          numberExams: values.count,
        })
      );

      if (actionResult.meta.requestStatus === "fulfilled") {
        onClose();
      }
      //   setShuffledExams((prev) => [...prev, ...newExams]);
      setShowShuffleForm(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo đề trộn");
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  const handlePreview = (exam: Exam) => {
    setPreviewExam(exam);
    setPreviewVisible(true);
  };

  const handleDownload = (examId: string) => {
    message.info(`Đang tải xuống đề thi ${examId}`);
  };

  const columns = [
    {
      title: "Mã đề",
      dataIndex: "examCode",
      key: "examCode",
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Exam) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id!)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={800}
        title={
          <div className="flex justify-between items-center">
            <Title level={4} className="mb-0">
              Quản lý việc trộn đề thi
            </Title>
          </div>
        }
      >
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Text strong>
              Đề gốc: {examData?.examCode} ({examData?.numberQuestion} câu)
            </Text>
            {!showShuffleForm && (
              <Button
                type="primary"
                onClick={handleShuffleClick}
                loading={loading}
              >
                Trộn đề thi
              </Button>
            )}
          </div>
        </div>

        {showShuffleForm ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={onShuffle}
            initialValues={{ count: 1 }}
          >
            <Form.Item
              label="Số lượng đề cần tạo"
              name="count"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng đề" },
                {
                  type: "number",
                  min: 1,
                  max: 100,
                  message: "Số lượng từ 1-100",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                placeholder="Nhập số lượng đề cần tạo"
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowShuffleForm(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Xác nhận
              </Button>
            </div>
          </Form>
        ) : (
          <Table
            columns={columns}
            dataSource={shuffledExams}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "Chưa có đề thi trộn nào" }}
          />
        )}
      </Modal>

      <PDFPreview
        urlPDF={""}
        isModalOpen={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
    </>
  );
};

export default ExamShuffleModal;
