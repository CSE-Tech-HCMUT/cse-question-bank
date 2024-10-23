import { Modal, Button, Alert } from "antd";
import { ModalProps } from "../../../types/modal/modal";
import { useAppDispatch } from "../../../store";
import { deleteTagByIdThunk } from "../../../store/tag-management/thunk";

export const TagManagementDeleteModal: React.FC<ModalProps> = ({ isModalOpen, onClose, tag }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (tag && tag.id) {
      dispatch(deleteTagByIdThunk(tag.id))
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
      <p>Are you sure you want to delete <span className="font-semibold"> {tag?.name} </span> ?</p>

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

export default TagManagementDeleteModal;
