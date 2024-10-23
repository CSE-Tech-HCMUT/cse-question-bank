import { useEffect, useState } from "react"
import { Button, Col, Row, Space, Tooltip } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store";
import { manageOptionActions } from "../../../store/tag-management/option/slice";
import OptionManagementCreateModal from "./modal/OptionManagementCreateModal";
import OptionManagementEditModal from "./modal/OptionManagementEditModal";
import { Option } from "../../../types/option/option";
import OptionManagementViewModal from "./modal/OptionManagementViewModal";
import OptionManagementDeleteModal from "./modal/OptionManagementDeleteModal";
import { getAllTagsThunk } from "../../../store/tag-management/thunk";
import { useParams } from "react-router-dom";


export const OptionManagementTemplate = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, _setTotal] = useState<number>(0);
  const [isLoading, _] = useState<boolean>(false);

  const params = useParams();  

  const dispatch = useAppDispatch();
  let { 
    createModalShow, 
    editModalShow, 
    deleteModalShow, 
    viewModalShow
  } = useSelector((state: RootState) => state.manageOptionReducer);

  const {
    listOfTags
  } = useSelector((state: RootState) => state.manageTagReducer)
  console.log(listOfTags);

  const handleModalCreateOpen = (isOpen: boolean) => { 
    dispatch(manageOptionActions.setCreateModalVisibility(isOpen));
  }
  const onCloseModalCreate = () => {    
    handleModalCreateOpen(false);
  };

  const handleModalEditOpen = (isOpen: boolean) => { 
    dispatch(manageOptionActions.setEditModalVisibility(isOpen));
  }
  const onCloseModalEdit = () => {    
    handleModalEditOpen(false);
  };
  const [optionEdit, setOptionEdit] = useState<Option>();

  const handleModalDeleteOpen = (isOpen: boolean) => { 
    dispatch(manageOptionActions.setDeleteModalVisibility(isOpen));
  }
  const onCloseModalDelete = () => {    
    handleModalDeleteOpen(false);
  };
  const [optionDelete, setOptionDelete] = useState<Option>();

  const handleModalViewOpen = (isOpen: boolean) => { 
    dispatch(manageOptionActions.setViewModalVisibility(isOpen));
  }
  const onCloseModalView = () => {    
    handleModalViewOpen(false);
  };
  const [optionView, setOptionView] = useState<Option>();  

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

  useEffect(() => { 
    dispatch(getAllTagsThunk())
  }, [])

  const TitleTable = () => (
    <Row gutter={[0, 16]}>
      <Col md={24} xs={24} className="flex md:justify-end">
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
            Create Option
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

  const columns: ColumnsType<Option> = [
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
      width: 600,
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
      title: 'Date',
      dataIndex: 'Date',
      width: 400,
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
                      setOptionView(record);
                    }}
                >
                    <FcViewDetails />
                </span>
              </Tooltip>

              <Tooltip title="Update">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}
                    onClick={() => {
                      handleModalEditOpen(true);
                      setOptionEdit(record);
                    }}
                >
                    <FiEdit />
                </span>
              </Tooltip>

              <Tooltip title="Delete">
                <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'
                  onClick={() => { 
                    handleModalDeleteOpen(true);
                    setOptionDelete(record);
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
              dataSource={listOfTags.find((tag) => tag.id === Number(params.id))?.options!}
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

      <OptionManagementCreateModal isModalOpen={createModalShow} onClose={onCloseModalCreate} />

      <OptionManagementEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} option={optionEdit} />

      <OptionManagementDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} option={optionDelete} />

      <OptionManagementViewModal isModalOpen={viewModalShow} onClose={onCloseModalView} option={optionView} />

      {/* <SubTagCreateModal isModalOpen={createModalShow} onClose={onCloseModalCreate} />

      <SubTagEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} tag={subTagEdit} />

      <SubTagDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} tag={subTagDelete} />

      <SubTagViewModal isModalOpen={viewModalShow} onClose={onCloseModalView} tag={subTagView} /> */}

    </>
  )
}

export default OptionManagementTemplate