import { useState } from "react"
import { MainTag } from "../../types/tag/tag";
import { Button, Col, Row, Select, Space, Tag, Tooltip } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { manageMainTagActions } from "../../store/tag-management/slice";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../const/path";
import TagManagementCreateModal from "./modal/TagManagementCreateModal";
import TagManagementEditModal from "./modal/TagManagementEditModal";
import TagManagementDeleteModal from "./modal/TagManagementDeleteModal";

export const TagManagementTemplate = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, _setTotal] = useState<number>(0);
  const [isLoading, _] = useState<boolean>(false);

  // const [listOfDepartments, _setListOfDepartments] = useState<Department[]>([
  //   {
  //     id: "1",
  //     name: "Khoa Khoa học và Kỹ thuật Máy tính",
  //     subjects: [
  //       "Kỹ thuật lập trình", 
  //       "Cấu trúc dữ liệu và giải thuật", 
  //       "Lập trình nâng cao"
  //     ],
  //     date: "11/07/2003",
  //   }
  // ]);
  const [listMainTags, _setListMainTags] = useState<MainTag[]>([
    {
      id: "1",
      name: "Tag 1",
      createdUser: "Nguyen Sy Thanh",
      date: "11/07/2024",
      status: true
    }
  ]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
  
  const { createModalShow, editModalShow, deleteModalShow } = useSelector((state: RootState) => state.manageMainTagReducer);

  const handleModalCreateOpen = (isOpen: boolean) => { 
    dispatch(manageMainTagActions.setCreateModalVisibility(isOpen));
  }
  const onCloseModalCreate = () => {    
    handleModalCreateOpen(false);
  };

  const handleModalEditOpen = (isOpen: boolean) => { 
    dispatch(manageMainTagActions.setEditModalVisibility(isOpen));
  }
  const onCloseModalEdit = () => {    
    handleModalEditOpen(false);
  };
  const [mainTagEdit, setMainTagEdit] = useState<MainTag>();

  const handleModalDeleteOpen = (isOpen: boolean) => { 
    dispatch(manageMainTagActions.setDeleteModalVisibility(isOpen));
  }
  const onCloseModalDelete = () => {    
    handleModalDeleteOpen(false);
  };
  const [mainTagDelete, setMainTagDelete] = useState<MainTag>();

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
                handleModalCreateOpen(true);
              }}
            >
              Create Main Tag
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

  const columns: ColumnsType<MainTag> = [
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
      width: 300,
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
      title: 'Created User',
      dataIndex: 'Created User',
      width: 400,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6 text-center! w-full" style={{ color: "#181c32" }}>{record.createdUser
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      width: 150,
      className: "",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              {
                record.status ? 
                  <Tag color="green">Active</Tag> :
                  <Tag color="red">Inactive</Tag>
              }
            </Space>
          </>
        )
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
                      navigate(PATH.TAG_MANAGEMENT + PATH.TAG_MAIN + `/${record.id}`) 
                    }}
                >
                    <FcViewDetails />
                </span>
              </Tooltip>

              <Tooltip title="Update">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}
                    onClick={() => {
                      handleModalEditOpen(true);
                      setMainTagEdit(record);
                    }}
                >
                    <FiEdit />
                </span>
              </Tooltip>

              <Tooltip title="Delete">
                <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'
                  onClick={() => { 
                    handleModalDeleteOpen(true);
                    setMainTagDelete(record);
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
              dataSource={listMainTags}
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

      <TagManagementCreateModal isModalOpen={createModalShow} onClose={onCloseModalCreate} />

      <TagManagementEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} mainTag={mainTagEdit} />

      <TagManagementDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} mainTag={mainTagDelete}/>
    </>
  )
}

export default TagManagementTemplate