import { useState } from "react"
import { Button, Col, Row, Space, Tag, Tooltip } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { manageUserActions } from "../../store/user-management/slice";
import { User } from "../../types/user/user";
import UserManagementCreateModal from "./modal/UserManagementCreateModal";
import UserManagementEditModal from "./modal/UserManagementEditModal";
import UserManagementDeleteModal from "./modal/UserManagementDeleteModal";
import UserManagementViewModal from "./modal/UserManagementViewModal";

export const UserManagementTemplate = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [listOfUsers, _setListOfUsers] = useState<User[]>([
    {
      id: "1",
      username: "nguyensythanh",
      fullname: "Nguyen Sy Thanh",
      role: 1,
      date: "11/07/2003",
      password: "123456",
      confirmPassword: "123456"
    }
  ]);
  const [total, _setTotal] = useState<number>(0);
  const [isLoading, _] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  
  const { createModalShow, editModalShow, deleteModalShow, viewModalShow } = useSelector((state: RootState) => state.manageUserReducer);

  const handleModalCreateOpen = (isOpen: boolean) => { 
    dispatch(manageUserActions.setCreateModalVisibility(isOpen));
  }
  const onCloseModalCreate = () => {    
    handleModalCreateOpen(false);
  };

  const handleModalEditOpen = (isOpen: boolean) => { 
    dispatch(manageUserActions.setEditModalVisibility(isOpen));
  }
  const onCloseModalEdit = () => {    
    handleModalEditOpen(false);
  };
  const [userEdit, setUserEdit] = useState<User>();

  const handleModalDeleteOpen = (isOpen: boolean) => { 
    dispatch(manageUserActions.setDeleteModalVisibility(isOpen));
  }
  const onCloseModalDelete = () => {    
    handleModalDeleteOpen(false);
  };
  const [userDelete, setUserDelete] = useState<User>();

  const handleModalViewOpen = (isOpen: boolean) => { 
    dispatch(manageUserActions.setViewModalVisibility(isOpen));
  }
  const onCloseModalView = () => {    
    handleModalViewOpen(false);
  };
  const [userView, setUserView] = useState<User>();

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
          Create User
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

  const columns: ColumnsType<User> = [
    {
      title: 'NO.',
      dataIndex: 'NO.',
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
      title: 'Username',
      dataIndex: 'Username',
      width: 300,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.username
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'Full Name',
      dataIndex: 'Full Name',
      width: 400,
      className: "text-center",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              <span className="fw-bold text-gray-800 fs-6 text-center! w-full" style={{ color: "#181c32" }}>{record.fullname
              }</span>
            </Space>
          </>
        )
      }
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      width: 150,
      className: "",
      render: (_text, record, _index) => {
        return (
          <>
            <Space>
              {
                record.role ? 
                  <Tag color="green">Admin</Tag> :
                  <Tag color="blue">User</Tag>
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
                      handleModalViewOpen(true);
                      setUserView(record);
                    }}
                >
                    <FcViewDetails />
                </span>
              </Tooltip>

              <Tooltip title="Update">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}
                    onClick={() => {
                      handleModalEditOpen(true);
                      setUserEdit(record);
                    }}
                >
                    <FiEdit />
                </span>
              </Tooltip>

              <Tooltip title="Delete">
                <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'
                  onClick={() => { 
                    handleModalDeleteOpen(true);
                    setUserDelete(record);
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
              dataSource={listOfUsers}
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

        <UserManagementCreateModal isModalOpen={createModalShow} onClose={onCloseModalCreate} />

        <UserManagementEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} user={userEdit} />

        <UserManagementDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} user={userDelete} />

        <UserManagementViewModal isModalOpen={viewModalShow} onClose={onCloseModalView} user={userView} />

      </div>
    </>
  )
}

export default UserManagementTemplate