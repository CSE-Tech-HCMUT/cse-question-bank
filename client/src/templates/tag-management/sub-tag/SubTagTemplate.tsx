import { useState } from "react"
import { Button, Col, Row, Space, Tag, Tooltip } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { SubTag } from "../../../types/tag/tad";
import { RootState, useAppDispatch } from "../../../store";
import { manageSubTagActions } from "../../../store/tag-management/sub-tag/slice";
import SubTagCreateModal from "./modal/SubTagCreateModal";
import SubTagEditModal from "./modal/SubTagEditModal";
import SubTagDeleteModal from "./modal/SubTagDeleteModal";
import SubTagViewModal from "./modal/SubTagViewModal";


export const SubTagTemplate = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [listTags, _setListTags] = useState<SubTag[]>([
    {
      id: "1",
      name: "Difficult",
      description: "Độ khó của môn học",
      option: [
        "Hard", "Normal", "Easy"
      ],
      date: "11/07/2024",
    },
    {
      id: "2",
      name: "Level",
      description: "Mức đọ của môn học",
      option: [
        "Thông hiểu", "Vận dụng"
      ],
      date: "11/07/2024",
    }
  ]);
  const [total, _setTotal] = useState<number>(0);
  const [isLoading, _] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  
  const { createModalShow, editModalShow, deleteModalShow, viewModalShow } = useSelector((state: RootState) => state.manageSubTagReducer);

  const handleModalCreateOpen = (isOpen: boolean) => { 
    dispatch(manageSubTagActions.setCreateModalVisibility(isOpen));
  }
  const onCloseModalCreate = () => {    
    handleModalCreateOpen(false);
  };

  const handleModalEditOpen = (isOpen: boolean) => { 
    dispatch(manageSubTagActions.setEditModalVisibility(isOpen));
  }
  const onCloseModalEdit = () => {    
    handleModalEditOpen(false);
  };
  const [subTagEdit, setSubTagEdit] = useState<SubTag>();

  const handleModalDeleteOpen = (isOpen: boolean) => { 
    dispatch(manageSubTagActions.setDeleteModalVisibility(isOpen));
  }
  const onCloseModalDelete = () => {    
    handleModalDeleteOpen(false);
  };
  const [subTagDelete, setSubTagDelete] = useState<SubTag>();

  const handleModalViewOpen = (isOpen: boolean) => { 
    dispatch(manageSubTagActions.setViewModalVisibility(isOpen));
  }
  const onCloseModalView = () => {    
    handleModalViewOpen(false);
  };
  const [subTagView, setSubTagView] = useState<SubTag>();  

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
    <div className="flex sm:justify-end">
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
            handleModalCreateOpen(true);
          }}
        >
          Create Tag
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
    </div>
  )

  const columns: ColumnsType<SubTag> = [
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
      title: 'Name',
      dataIndex: 'Name',
      width: 150,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.name
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      width: 300,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.description
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'Option',
      dataIndex: 'Option',
      width: 400,
      className: "text-center",
      render: (_text, record, _index) => {
        const maxTagsToShow = 3; 
        const tagsToShow = record.option.slice(0, maxTagsToShow);
        const isMoreTags = record.option.length > maxTagsToShow;
    
        return (
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <Space>
              {tagsToShow.map((tag, index) => (
                <Tag key={index}>
                  <span>{tag}</span>
                </Tag>
              ))}
              {isMoreTags && (
                <Tooltip title={record.option.join(', ')}>
                  <Tag>+{record.option.length - maxTagsToShow} more</Tag>
                </Tooltip>
              )}
            </Space>
          </div>
        );
      }
    },    
    {
      title: 'Date',
      dataIndex: 'Date',
      width: 100,
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
              <Tooltip title="View Detail">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 20 }}
                    onClick={() => {
                      handleModalViewOpen(true);
                      setSubTagView(record);
                    }}
                >
                    <FcViewDetails />
                </span>
              </Tooltip>

              <Tooltip title="Update">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}
                    onClick={() => {
                      handleModalEditOpen(true);
                      setSubTagEdit(record);
                    }}
                >
                    <FiEdit />
                </span>
              </Tooltip>

              <Tooltip title="Delete">
                <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'
                  onClick={() => { 
                    handleModalDeleteOpen(true);
                    setSubTagDelete(record);
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
              dataSource={listTags}
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

      <SubTagCreateModal isModalOpen={createModalShow} onClose={onCloseModalCreate} />

      <SubTagEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} subTag={subTagEdit} />

      <SubTagDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} subTag={subTagDelete} />

      <SubTagViewModal isModalOpen={viewModalShow} onClose={onCloseModalView} subTag={subTagView} />

    </>
  )
}

export default SubTagTemplate