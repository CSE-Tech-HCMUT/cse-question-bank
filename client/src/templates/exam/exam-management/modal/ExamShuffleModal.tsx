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
  Spin,
} from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useAppDispatch, RootState } from "@/stores";
import { Exam } from "@/types/exam";
import { useState, useEffect } from "react";
import { previewPDFFileThunk, shuffleExamThunk } from "@/stores/exam/thunk";
import { useSelector } from "react-redux";

const { Text, Title } = Typography;

interface ExamShuffleModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  examData: Exam | null;
}

export const ExamShuffleModal = ({
  isModalOpen,
  onClose,
  examData,
}: ExamShuffleModalProps) => {
  const dispatch = useAppDispatch();
  const [loading] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [showShuffleForm, setShowShuffleForm] = useState(false);
  const [form] = Form.useForm();
  const { pdfUrl } = useSelector((state: RootState) => state.examReducer);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [shuffledExams, setShuffledExams] = useState<Exam[]>([]);

  // Cập nhật danh sách đề trộn khi examData thay đổi
  useEffect(() => {
    if (examData?.children) {
      setShuffledExams(examData.children);
    }
  }, [examData]);

  const handleShuffle = async (values: { count: number }) => {
    if (!examData?.id) return;

    setShuffling(true);
    try {
      const result = await dispatch(
        shuffleExamThunk({
          examId: examData.id,
          isShuffleInsideQuestions: true,
          numberExams: values.count,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        message.success("Tạo đề trộn thành công");
        setShowShuffleForm(false);

        // Cập nhật lại danh sách đề trộn
        if (result.payload && Array.isArray(result.payload)) {
          setShuffledExams(result.payload);
        } else if (examData.children) {
          // Nếu API không trả về danh sách mới, giữ nguyên danh sách cũ
          setShuffledExams(examData.children);
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo đề trộn");
    } finally {
      setShuffling(false);
      form.resetFields();
    }
  };

  const handlePreview = (examId: string) => {
    dispatch(previewPDFFileThunk(examId)).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        setPreviewVisible(true);
      }
    });
  };

  const handleDownload = (examId: string) => {
    // Logic tải xuống đề thi
    message.success(`Đang tải xuống đề thi ${examId}`);
  };

  const columns = [
    {
      title: "Mã đề",
      dataIndex: "code",
      key: "code",
      render: (code: number) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      render: (semester: string) => semester,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Exam) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record.id!)}
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
              Quản lý trộn đề thi
            </Title>
          </div>
        }
      >
        <Spin spinning={loading}>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <Text strong>
                Đề gốc: {examData?.code} ({examData?.numberQuestion} câu)
              </Text>
              {!showShuffleForm && (
                <Button
                  type="primary"
                  onClick={() => setShowShuffleForm(true)}
                  loading={shuffling}
                >
                  Trộn đề mới
                </Button>
              )}
            </div>
          </div>

          {showShuffleForm ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleShuffle}
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
                <Button type="primary" htmlType="submit" loading={shuffling}>
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
        </Spin>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        title="Xem trước đề thi"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width="90%"
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <iframe
          src={pdfUrl}
          style={{ width: "100%", height: "80vh", border: "none" }}
          title="PDF Preview"
        />
      </Modal>
    </>
  );
};

export default ExamShuffleModal;
