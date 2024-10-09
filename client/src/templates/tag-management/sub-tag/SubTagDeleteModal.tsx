import { Modal, Button, Alert } from "antd";
import { ModalProps } from "../../../types/modal/modal";

export const SubTagDeleteModal: React.FC<ModalProps> = ({ isModalOpen, onClose, subTag }) => {

  const handleDelete = () => {
    if (subTag) {
      
    }
    onClose(); 
  };

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4">
          Delete Sub Tag
        </h1>
      }
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
      <p>Are you sure you want to delete <span className="font-semibold"> {subTag?.name} </span> ?</p>

      <Alert
        message="Warning"
        description="By Deleteing this tag, you won’t be able to access the system."
        type="error"
        showIcon
        className="my-6"
      />
    </Modal>
  );
};

export default SubTagDeleteModal;
