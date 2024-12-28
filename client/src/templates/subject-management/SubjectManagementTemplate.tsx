import { RootState, useAppDispatch } from "@/stores";
import { useSelector } from "react-redux";
import { Typography, Collapse } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllSubjectsThunk } from "@/stores/subject-management/thunk";
import PATH from "@/const/path";

const { Title } = Typography;

export const SubjectManagementTemplate = () => {
  const { data } = useSelector((state: RootState) => state.subjectManagementReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubjectClick = (key: string | string[]) => { 
    const subjectId = Array.isArray(key) ? key[0] : key;
    const selectedSubject = data?.find(subject => subject.id === subjectId); 
    if (selectedSubject) { 
      const subjectName = selectedSubject.name!.replace(/\s+/g, '-').toLowerCase(); 
      localStorage.setItem('subjectAuthen', JSON.stringify(selectedSubject));
      navigate(PATH.DASHBOARD.replace(':subjectName', subjectName));
    } 
  };

  useEffect(() => {
    dispatch(getAllSubjectsThunk());
  }, [dispatch]);

  const items = data?.map((subject) => ({
    key: subject.id!,
    label: <span onClick={() => { handleSubjectClick(subject.id!) }} className="text-[16px] hover:text-[#3c8dbc] transition-all duration-200">{subject.name}</span>,
    children: <p>Click để xem ngân hàng câu hỏi của {subject.name}</p>
  }));

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Quản lý môn học</Title>
      <Collapse accordion items={items} />
    </div>
  );
};

export default SubjectManagementTemplate;
