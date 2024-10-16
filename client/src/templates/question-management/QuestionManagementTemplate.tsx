import { useState } from "react"
import { Button, Col, Row, Select, Space, Tag, Tooltip } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../const/path";
import { manageQuestionActions } from "../../store/question-management/slice";
import { Question } from "../../types/question/question";
import QuestionManagementDeleteModal from "./modal/QuestionManagementDeleteModal";
import QuestionManagementEditModal from "./modal/QuestionManagementEditModal";


export const QuestionManagementTemplate = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const departmentOptions = [
    { value: '1', label: 'Khoa Khoa học và Kỹ thuật Máy tính' },
    { value: '2', label: 'Khoa Quản trị kinh doanh' },
    { value: '3', label: 'Khoa Công nghệ thông tin' },
    { value: '4', label: 'Khoa Kinh tế' },
    { value: '5', label: 'Khoa Kỹ thuật xây dựng' },
    { value: '6', label: 'Khoa Xây dựng và thiết kế nền tảng' },
    { value: '7', label: 'Khoa Tài chính và ngân hàng' },
  ]
  const courseOptions = [
    { value: '1', label: 'Cấu trúc dữ liệu và giải thuật' },
    { value: '2', label: 'Kỹ thuật lập trình' },
    { value: '3', label: 'Lập trình nâng cao' },
    { value: '4', label: 'Hệ thống thông tin' },
    { value: '5', label: 'Thiết kế web' },
    { value: '6', label: 'Thiết kế ứng dụng mobile' },
    { value: '7', label: 'Thiết kế game' },
    { value: '8', label: 'Thiết kế dịch vụ' },
    { value: '9', label: 'Thiết kế hệ thống mạng' },
  ]
  const [total, _setTotal] = useState<number>(0);
  const [isLoading, _] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const dispatch = useAppDispatch();
  const { 
    editModalShow, 
    deleteModalShow
  } = useSelector((state: RootState) => state.manageQuestionReducer);
  const listOfQuestion: Question[] = [
    {
      content: 'Question 1',
      answer: [
        { id: '1', content: 'Answer 1', isCorrect: true },
        { id: '2', content: 'Answer 2', isCorrect: false },
        { id: '3', content: 'Answer 3', isCorrect: false },
      ],
      id: String(Date.now()),
      tags: [
        {
          id: 1,
          name: 'Difficult',
          description: 'Độ khó của câu hỏi',
          option: 
            [
              {
                id: 1,
                name: 'Easy',
                tagID: 1
              }
            ]
        },
        {
          id: 2,
          name: 'Topic',
          description: 'Chủ đề của môn học',
          option: 
            [
              {
                id: 2,
                name: 'Stack',
                tagID: 2
              }
            ]
        }
      ],
      type: 'Multiple choice',
      isParent: false,
      userPreview: [
        {
          id: '1',
          fullname: 'Nguyen Sy Thanh',
          avatarUrl: 'https://gravatar.com/avatar/38d8f4f73679bca7740b6b80c2f8765b?s=400&d=robohash&r=x'
        },
        {
          id: '2',
          fullname: 'Nguyen Thanh Nhat',
          avatarUrl: 'https://gravatar.com/avatar/38d8f4f73679bca7740b6b80c2f8765b?s=400&d=monsterid&r=x'
        }
      ]
    }
  ]

  const handleModalEditOpen = (isOpen: boolean) => { 
    dispatch(manageQuestionActions.setEditModalVisibility(isOpen));
  }
  const onCloseModalEdit = () => {    
    handleModalEditOpen(false);
  };
  const [questionEdit, setQuestionEdit] = useState<Question>();

  const handleModalDeleteOpen = (isOpen: boolean) => { 
    dispatch(manageQuestionActions.setDeleteModalVisibility(isOpen));
  }
  const onCloseModalDelete = () => {    
    handleModalDeleteOpen(false);
  };
  const [questionDelete, setQuestionDelete] = useState<Question>();

  const handlePagination: TableProps<any>['onChange'] = (pagination, _filters, _sorter, _extra) => {
    if (pagination && pagination.current !== current) {
        if (pagination && pagination.current)
            setCurrent(pagination.current)
    }
    if (pagination && pagination.pageSize !== pageSize) {
        if (pagination && pagination.pageSize) {
            setPageSize(pagination.pageSize)
        }
        setCurrent(1);
    }
  };

  const TitleTable = () => (
    <Row gutter={[0, 16]}>
      <Col md={12} sm={24}>
        <Row gutter={[8, 16]}>
          <Col md={12} xs={24}>
            <Select className="!w-full"  options={departmentOptions} defaultValue={'1'}>
            </Select>
          </Col>
          <Col md={12} xs={24}>
            <Select className="!w-full" options={courseOptions} defaultValue={'1'}>
            </Select>
          </Col>
        </Row>
      </Col>
      <Col md={12} xs={24} className="flex md:justify-end">
        <Space wrap>
          <Button
            type="primary"
            icon={<>
                <span style={{ fontSize: 18, textAlign: "center", alignItems: "center" }}>
                    <FaPlusCircle />
                </span>
            </>
            }
            size={'middle'}
            onClick={() => {
              navigate(PATH.QUESTION_CREATION);
            }}
          >
            Create Question
          </Button>
          <Button
            icon={
            <>
              <span style={{ fontSize: 18, textAlign: "center", alignItems: "center" }}>
                  <AiOutlineReload />
              </span>
            </>
            }
            size={'middle'}
            // onClick={() => { fetchCategoryChannel() }}
          >
          </Button>
        </Space>
      </Col>
    </Row>
)

  const columns: ColumnsType<Question> = [
    {
      title: 'NO.',
      dataIndex: 'ID',
      className: "text-center",
      width: 80,
      render: (_text, _record, index) => {
        return (
            <>
              <Space>
                <span className="fw-bold text-gray-900 fs-5" style={{ color: "#181c32" }}>{index + 1}</span>
              </Space>
            </>
        )
      }
    },
    {
      title: 'CONTENT',
      dataIndex: 'Content',
      width: 300,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.content
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'TYPE',
      dataIndex: 'Type',
      width: 150,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.type
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'TAG',
      dataIndex: 'Tag',
      width: 200,
      className: "text-center",
      render: (_text, record, _index) => {
        const maxTagsToShow = 3; 
        const tagsToShow = record.tags.slice(0, maxTagsToShow);
        const isMoreTags = record.tags.length > maxTagsToShow;
    
        return (
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <Space>
              {tagsToShow.map((tag, index) => (
                <Tag key={index}>
                  <span>{tag.name}</span>
                </Tag>
              ))}
              {isMoreTags && (
                <Tooltip title={record.tags.join(', ')}>
                  <Tag>+{record.tags.length - maxTagsToShow} more</Tag>
                </Tooltip>
              )}
            </Space>
          </div>
        );
      }
    },    
    {
      title: 'PREVIEW',
      dataIndex: 'Preview',
      width: 200,
      className: "text-center",
      render: (_text, record, _index) => {
        const maxUserToShow = 3; 
        const userToShow = record.userPreview.slice(0, maxUserToShow);
        const isMoreUser = record.userPreview.length > maxUserToShow;
    
        return (
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <Space>
              {userToShow.map((user, index) => (
                <Tooltip key={index} title={user.fullname}>
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      marginRight: 5,
                    }}
                  />
                </Tooltip>
              ))}
              {isMoreUser && (
                <Tooltip title={record.userPreview.join(', ')}>
                  <Tag>+{record.userPreview.length - maxUserToShow} more</Tag>
                </Tooltip>
              )}
            </Space>
          </div>
        );
      }
    },
    {
      title: 'DATE',
      dataIndex: 'Date',
      width: 150,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.date
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'ACTIONS',
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space wrap className='d-flex justify-content-center'>
              <Tooltip title="Update">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}
                    onClick={() => {
                      handleModalEditOpen(true);
                      setQuestionEdit(record);
                    }}
                >
                    <FiEdit />
                </span>
              </Tooltip>

              <Tooltip title="Delete">
                <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'
                  onClick={() => { 
                    handleModalDeleteOpen(true);
                    setQuestionDelete(record);
                  }}
                >
                    <AiFillDelete />
                </span>
              </Tooltip>
            </Space>
          </>
        )
      }
    },
];

  return (
    <>
      <div className="mt-6">
        <Row gutter={[20 ,20]}>
          <Col span={24}>
            <Table 
              rowKey="id"
              columns={columns}
              dataSource={listOfQuestion}
              title={TitleTable}
              loading={isLoading}
              onChange={handlePagination}
              size='middle'
              bordered
              scroll={{ x: 1000 }}
              pagination={{
                current: current,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                total: total,
                responsive: true,
                showTotal: (total, range) => { return (<div className="fw-bold text-gray-800 fs-6">{range[0]} - {range[1]} of {total}</div>) }
              }}
            />
          </Col>
        </Row>
      </div>

      <QuestionManagementEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} question={questionEdit} />

      <QuestionManagementDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} question={questionDelete} />

    </>
  )
}

export default QuestionManagementTemplate