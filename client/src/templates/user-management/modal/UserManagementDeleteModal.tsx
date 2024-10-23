import { Modal, Button, Alert } from "antd";
import { ModalProps } from "../../../types/modal/modal";

export const UserManagementDeleteModal: React.FC<ModalProps> = ({ isModalOpen, onClose, user }) => {

  const handleDelete = () => {
    if (user) {
      
    }
    onClose(); 
  };

  return (
    <Modal
      title={
        <h1 className="text-2xl mb-4">
          Delete User
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
      <p>Are you sure you want to delete <span className="font-semibold"> {user?.username} </span> ?</p>

      <Alert
        message="Warning"
        description="By Deleteing this user, you won’t be able to access the system."
        type="error"
        showIcon
        className="my-6"
      />
    </Modal>
  );
};

export default UserManagementDeleteModal;
