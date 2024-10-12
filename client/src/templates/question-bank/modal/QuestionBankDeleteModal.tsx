import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { SimpleQuestion } from "../../../types/question/question";

interface QuestionBankDeleteModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  question: SimpleQuestion;
}

export const QuestionBankDeleteModal: React.FC<QuestionBankDeleteModalProps> = ({ isModalOpen, onClose, question }) => {
  const [simpleQuestion, setSimpleQuestion] = useState<SimpleQuestion | null>(null);

  useEffect(() => {
    setSimpleQuestion(question);
  }, [question]);

  const handleDelete = () => {
    if (simpleQuestion) {
      
    }
    onClose(); 
  };

  return (
    <Modal
      title="Xác nhận xóa"
      open={isModalOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleDelete}>
          Xóa
        </Button>,
      ]}
    >
      <p>Bạn có chắc chắn muốn xóa câu hỏi này?</p>
      <p><strong>{simpleQuestion?.content}</strong></p>
    </Modal>
  );
};

export default QuestionBankDeleteModal;
