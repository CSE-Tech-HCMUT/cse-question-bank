import { Subject } from "@/types/subject";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import BlockQuestionTemplate from "./BlockQuestionTemplate";
import SingleQuestionTemplate from "./SingleQuestionTemplate";

export const QuestionCreationTemplate = () => {
  const location = useLocation();
  const { isParent } = location.state as { isParent: boolean };
  const { t } = useTranslation("question_creation");
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();

  const { idQuestion } = useParams();

  useEffect(() => {
    const storedSubject = localStorage.getItem("subjectAuthen");
    if (storedSubject) {
      setSubjectAuthen(JSON.parse(storedSubject));
    }
    setLoading(false); // Đánh dấu đã load xong
  }, []);

  if (loading || !subjectAuthen) {
    // Hiển thị loading nếu chưa xong
    return <div>Loading...</div>;
  }

  return (
    <Content
      className="QuestionCreationTemplate"
      style={{ background: "#f0f2f5" }}
    >
      <h1 className="text-xl font-semibold mb-4">{t("createQuestion")}</h1>
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          {isParent ? (
            <BlockQuestionTemplate
              idQuestion={idQuestion!}
              subjectAuthen={subjectAuthen}
            />
          ) : (
            <SingleQuestionTemplate
              idQuestion={idQuestion!}
              subjectAuthen={subjectAuthen}
              isParent={false}
            />
          )}
        </Col>
      </Row>
    </Content>
  );
};
