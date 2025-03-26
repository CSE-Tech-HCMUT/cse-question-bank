import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Question } from '@/types/question';
import { FilterCondition } from '@/types/exam';

interface QuestionSelectionTableProps {
  questions: any[]; // Dữ liệu truyền vào sẽ là kiểu mảng bao gồm các đối tượng như bạn đã cung cấp
  onSelectQuestion: (question: Question) => void;
  onRemoveQuestion: (question: Question) => void; // Hàm để xóa câu hỏi khỏi selectedQuestions
  selectedQuestions: Question[];  // Truyền selectedQuestions vào để đồng bộ
  filterConditions: FilterCondition[];  // Truyền filterConditions vào
}

const QuestionSelectionTable: React.FC<QuestionSelectionTableProps> = ({
  questions,
  onSelectQuestion,
  onRemoveQuestion,
  selectedQuestions,
  filterConditions
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // Lưu trạng thái các câu hỏi đã chọn

  const handleSearch = (content: string) => {
    setSearchText(content);
  };

  // Giải nén tất cả câu hỏi từ các đối tượng trong questions
  const allQuestions: Question[] = questions.reduce((acc: Question[], curr: any) => {
    return [...acc, ...curr.questions];
  }, []);

  // Lọc câu hỏi theo các điều kiện từ filterConditions và tìm kiếm
  const filteredQuestions = allQuestions.filter((question) => {
    return filterConditions.every((condition) => {
      return condition.tagAssignments!.every((tagAssignment: any) => {
        return question.content?.toLowerCase().includes(searchText.toLowerCase());
      });
    });
  });

  const handleRowSelect = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);  // Cập nhật các câu hỏi đã chọn
  };

  // Hàm xử lý khi chọn câu hỏi
  const handleSelect = (question: Question) => {
    if (selectedQuestions.find(q => q.id === question.id)) {
      onRemoveQuestion(question);  // Nếu đã chọn, gọi hàm xóa câu hỏi khỏi selectedQuestions
    } else {
      onSelectQuestion(question);  // Nếu chưa chọn, gọi hàm thêm câu hỏi vào selectedQuestions
    }
  };

  // Cập nhật cột "Hành động"
  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Question) => (
        <Button
          type="primary"
          onClick={() => handleSelect(record)}  // Gọi hàm handleSelect khi chọn câu hỏi
          disabled={selectedQuestions.some(q => q.id === record.id)}  // Disable button nếu câu hỏi đã được chọn
        >
          {selectedQuestions.some(q => q.id === record.id) ? 'Đã chọn' : 'Chọn'}
        </Button>
      ),
    },
  ];

  // Thêm class để thay đổi màu sắc dòng khi đã chọn
  const rowClassName = (record: Question) => {
    return selectedQuestions.some(q => q.id === record.id) ? 'row-disabled' : '';  
  };

  return (
    <div>
      <Input
        placeholder="Tìm kiếm câu hỏi"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredQuestions}
        columns={columns}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: handleRowSelect,
        }}
        rowClassName={rowClassName}  
      />
 
      <div>
        <span>Tổng số câu hỏi đã lọc: {filteredQuestions.length}</span>
      </div>
    </div>
  );
};

export default QuestionSelectionTable;
