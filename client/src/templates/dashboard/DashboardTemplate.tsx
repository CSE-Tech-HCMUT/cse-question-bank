import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Table,
  Dropdown,
  Menu,
} from "antd";
import { Subject } from "../../types/subject";
import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "@/stores";
import "../../styles/dashboard/DashboardTemplate.scss";
import { useTranslation } from "react-i18next";
import PATH from "@/const/path";
import {
  createQuestionThunk,
  getAllQuestionsThunk,
} from "@/stores/question/thunk";
import { Question } from "@/types/question";
import { createExamThunk } from "@/stores/exam/thunk";
import { useSelector } from "react-redux";
import { FaPlusCircle, FaFileAlt, FaList } from "react-icons/fa";

const { Content } = Layout;
const { Title, Text } = Typography;

export const DashboardTemplate: React.FC = () => {
  const { t } = useTranslation("dashboard");

  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();
  const { data: listOfQuestions } = useSelector(
    (state: RootState) => state.questionReducer
  );
  const { data: listOfExams } = useSelector(
    (state: RootState) => state.examReducer
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreateQuestion = (isParent: boolean) => {
    dispatch(
      createQuestionThunk({
        subjectId: subjectAuthen?.id,
        isParent: isParent,
      })
    ).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        const idQuestion = (actionResult.payload as Question).id;

        if (idQuestion) {
          navigate(
            PATH.QUESTION_CREATION.replace(
              ":subjectName",
              subjectAuthen?.name!
            ) +
              "/" +
              idQuestion,
            { state: { isParent } }
          );
        }
      }
    });
  };

  const handleClickCreateExam = () => {
    dispatch(
      createExamThunk({
        subjectId: subjectAuthen?.id,
      })
    ).then((actionResult) => {
      if (actionResult.meta.requestStatus === "fulfilled") {
        const idExam = (actionResult.payload as Question).id;

        if (idExam) {
          navigate(PATH.EXAM_CREATION + "/" + idExam);
        }
      }
    });
  };

  const handleMenuClick = (e: any) => {
    if (e.key === "single") {
      handleCreateQuestion(false);
    } else if (e.key === "block") {
      handleCreateQuestion(true);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="single" icon={<FaFileAlt />}>
        {t("single_question")}
      </Menu.Item>
      <Menu.Item key="block" icon={<FaList />}>
        {t("block_question")}
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    const storedSubject = localStorage.getItem("subjectAuthen");
    if (storedSubject) {
      setSubjectAuthen(JSON.parse(storedSubject));
    }
    dispatch(getAllQuestionsThunk());
  }, [dispatch]);

  const columns = [
    {
      title: t("statisticTitle"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("count"),
      dataIndex: "count",
      key: "count",
    },
  ];

  const data = [
    {
      key: "1",
      title: t("questionCount"),
      count: listOfQuestions?.filter(
        (question) => question.subject?.id === subjectAuthen?.id
      )?.length,
    },
    {
      key: "2",
      title: t("examCount"),
      count: listOfExams?.filter(
        (exam) => exam.subject?.id === subjectAuthen?.id
      )?.length,
    },
  ];

  return (
    <Content className="DashboardTemplate" style={{ background: "#f0f2f5" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} md={12}>
          <Card hoverable className="hover-card" style={{ height: "100%" }}>
            <Title level={2}>{t("title")}</Title>
            <Text>
              {t("content_1")}
              <br />
              <br />
              {t("content_2")}
            </Text>
            <div className="flex items-center" style={{ marginTop: "20px" }}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="primary"
                  size="large"
                  icon={<FaPlusCircle />}
                  className="mr-2"
                >
                  {t("createQuestion")}
                </Button>
              </Dropdown>
              <Button
                onClick={handleClickCreateExam}
                type="default"
                size="large"
              >
                {t("createExam")}
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            hoverable
            cover={
              <img
                src="/src/assets/images/question-bank.png"
                alt="Questionbank"
                style={{
                  width: "100%",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  padding: "0 auto",
                }}
              />
            }
            styles={{
              body: { padding: "0", height: "32px", overflow: "auto" },
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24}>
          <Card hoverable className="hover-card" style={{ height: "100%" }}>
            <Title level={2}>{t("statistics")}</Title>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default DashboardTemplate;
