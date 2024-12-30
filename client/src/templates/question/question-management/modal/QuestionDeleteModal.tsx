import { Modal, Button, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/stores";
import { deleteQuestionThunk } from "@/stores/question/thunk";
import { Question } from "@/types/question";

const { Text } = Typography;

export const QuestionDeleteModal = ({
    isModalOpen,
    onClose,
    questionData,
} : {
    isModalOpen: boolean;
    onClose: () => void;
    questionData: Question | null;
}) => {
    const { t } = useTranslation('question_delete_modal');
    const dispatch = useAppDispatch();

    const onDelete = () => {
        // Call API to delete user and then close modal
        dispatch(deleteQuestionThunk(questionData?.id!));
    };

    return ( 
        <Modal
            open={isModalOpen}
            onCancel={onClose}
            footer={null}
            centered
            title={null}
            width={600}
        >
            <div style={{ textAlign: "center", padding: "20px" }}>
                {/* Icon cảnh báo */}
                <ExclamationCircleOutlined style={{ fontSize: "48px", color: "#faad14" }} />

                {/* Tiêu đề */}
                <h2 style={{ margin: "20px 0 10px" }}>{t("areYouSure")}</h2>

                {/* Nội dung */}
                <Text type="secondary" style={{ fontSize: "16px" }}>
                    {t("deleteConfirmationOne")} <Text strong style={{ color: "#ff4d4f" }}>{questionData?.content || t("thisQuestion")}</Text> ? {t("deleteConfirmationTwo")}
                </Text>

                {/* Nút hành động */}
                <div style={{ marginTop: "30px" }}>
                    <Button style={{ marginRight: "10px" }} onClick={onClose}>
                        {t("cancel")}
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={onDelete}
                        style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
                    >
                        {t("delete")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default QuestionDeleteModal;