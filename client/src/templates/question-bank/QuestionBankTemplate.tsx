import { useState } from 'react'
import { Table, Space, Tooltip } from 'antd';
import { Button, Col, Row } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { AiFillDelete, AiOutlineReload } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi'
import { FaPlusCircle } from 'react-icons/fa'
import { FcViewDetails } from 'react-icons/fc'
import { SimpleQuestion } from '../../types/question/question';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { manageBankQuestionActions } from '../../store/question-bank/slice';
import QuestionBankEditModal from './QuestionBankEditModal';

import "../../style/style.scss";
import QuestionBankViewModal from './QuestionBankViewModal';
import QuestionBankDeleteModal from './QuestionBankDeleteModal';

export const QuestionBankTemplate = () => {
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [listQuestion, _setListQuestion] = useState<SimpleQuestion[]>([
      {
        content: '[A4] Đoạn mã trên bị thiếu câu lệnh gencode(emit.emitLABEL(label_1,o.frame)). Hãy chọn vị trí dòng thích hợp nhất cho câu lệnh này?',
        id: String(Date.now()),
        type: 'multiple-choice',
        tag: 'Data Structures And Algorithms',
        difficult: 0,
        isParent: false,
        answer: [
          {
            id: '1',
            content: 'giữa dòng 8 và 9',
            isCorrect: true
          },
          {
            id: '2',
            content: 'giữa dòng 9 và 10',
            isCorrect: false
          },
          {
            id: '3',
            content: 'giữa dòng 11 và 12',
            isCorrect: false
          },
          {
            id: '4',
            content: 'giữa dòng 7 và 8',
            isCorrect: false
          }
        ]
      }
    ]);

    const [total, _setTotal] = useState<number>(0);
    const [isLoading, _] = useState<boolean>(false);

    const { editModalShow, viewModalShow, deleteModalShow } = useSelector((state: RootState) => state.manageBankQuestionReducer);
    const dispatch = useAppDispatch();
    const [ questionEdit, setQuestionEdit ] = useState<SimpleQuestion>();
    const [ questionView, setQuestionView ] = useState<SimpleQuestion>();
    const [questionDelete, setQuestionDelete ] = useState<SimpleQuestion>();
    
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

    const handleModalEditOpen = (isOpen: boolean) => { 
      dispatch(manageBankQuestionActions.setEditModalVisibility(isOpen))
    } 
    const handleModalViewOpen = (isOpen: boolean) => { 
      dispatch(manageBankQuestionActions.setViewModalVisibility(isOpen))
    } 
    const handleModalDeleteOpen = (isOpen: boolean) => { 
      dispatch(manageBankQuestionActions.setDeleteModalVisibility(isOpen))
    }

    const TitleTable = () => {
      return (
          <>
              <div className='flex justify-content-sm-end'>
                  <Space wrap >
                      <Button
                          type="primary"
                          icon={<>
                              <span style={{ fontSize: 18, textAlign: "center", alignItems: "center" }}>
                                  <FaPlusCircle />
                              </span>
                          </>
                          }
                          size={'middle'}
                          // onClick={() => { setopenModalCreateItem(true) }}
                      >
                          Create Question
                      </Button>

                      <Button
                          icon={<>
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
              </div>

          </>
      )
    };

    const columns: ColumnsType<any> = [
        {
            title: 'NO.',
            dataIndex: 'STT',
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
            dataIndex: 'CONTENT',
            width: 600,
            className: "",
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
            dataIndex: 'TYPE',
            width: 150,
            className: "",
            render: (_text, record, _index) => {
                return (
                    <>
                        <Space>
                            <span className="fw-bold text-gray-800 fs-6 text-center! w-full" style={{ color: "#181c32" }}>{record.type
                            }</span>
                        </Space>
                    </>
                )
            }
        },
        {
          title: 'TAG',
          dataIndex: 'TAG',
          width: 150,
          className: "",
          render: (_text, record, _index) => {
              return (
                  <>
                      <Space>
                          <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.tag
                          }</span>
                      </Space>
                  </>
              )
          }
        },
        {
          title: 'DIFFICULT',
          dataIndex: 'DIFFICULT',
          width: 100,
          className: "",
          render: (_text, record, _index) => {
              return (
                  <>
                      <Space>
                          <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.difficult
                          }</span>
                      </Space>
                  </>
              )
          }
        },
        {
          title: 'ACTIONS',
          className: "",
          render: (_text, record, _index) => {
              return (
                  <>
                      <Space wrap className='d-flex justify-content-center'>
                          <Tooltip title="View Detail">
                              <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 20 }}

                                  onClick={() => {
                                    handleModalViewOpen(true);
                                    setQuestionView(record);
                                  }}
                              >
                                  <FcViewDetails />
                              </span>
                          </Tooltip>

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
      <div className='mt-n7'>
        <Row gutter={[20, 20]}>
            <Col span={24}>
                <Table
                    // {...tableProps}
                    columns={columns}
                    dataSource={listQuestion}
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

        <QuestionBankEditModal
          isModalOpen={editModalShow}
          onClose={() => { handleModalEditOpen(false) }}
          question={questionEdit!}
        />

        <QuestionBankViewModal 
          isModalOpen={viewModalShow}
          onClose={() => { handleModalViewOpen(false) }}
          question={questionView!}
        />

        <QuestionBankDeleteModal 
          isModalOpen={deleteModalShow}
          onClose={() => { handleModalDeleteOpen(false) }}
          question={questionDelete!}
        />

      </div>
    </>
  )
}

export default QuestionBankTemplate
