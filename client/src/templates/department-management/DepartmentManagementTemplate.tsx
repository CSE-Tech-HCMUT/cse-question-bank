import { useState } from "react"
import { Button, Col, Row, Space, Tag, Tooltip } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiFillDelete, AiOutlineReload } from "react-icons/ai";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { User } from "../../types/user/user";
import { Department } from "../../types/department/department";
import { manageDepartmentActions } from "../../store/department-management/slice";
import DepartmentManagementCreateModal from "./modal/DepartmentMangementCreateModal";
import DepartmentManagementEditModal from "./modal/DepartmentManagementEditModal";
import DepartmentManagementDeleteModal from "./modal/DepartmentMangementDeleteModal";

export const DepartmentManagementTemplate = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [listOfDepartments, _setListOfDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Khoa Khoa học và Kỹ thuật Máy tính",
      subjects: [
        "Kỹ thuật lập trình", 
        "Cấu trúc dữ liệu và giải thuật", 
        "Lập trình nâng cao"
      ],
      date: "11/07/2003",
    }
  ]);
  const [total, _setTotal] = useState<number>(0);
  const [isLoading, _] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  
  const { createModalShow, editModalShow, deleteModalShow } = useSelector((state: RootState) => state.manageDepartmentReducer);

  const handleModalCreateOpen = (isOpen: boolean) => { 
    dispatch(manageDepartmentActions.setCreateModalVisibility(isOpen));
  }
  const onCloseModalCreate = () => {    
    handleModalCreateOpen(false);
  };

  const handleModalEditOpen = (isOpen: boolean) => { 
    dispatch(manageDepartmentActions.setEditModalVisibility(isOpen));
  }
  const onCloseModalEdit = () => {    
    handleModalEditOpen(false);
  };
  const [departmentEdit, setDepartmentEdit] = useState<User>();

  const handleModalDeleteOpen = (isOpen: boolean) => { 
    dispatch(manageDepartmentActions.setDeleteModalVisibility(isOpen));
  }
  const onCloseModalDelete = () => {    
    handleModalDeleteOpen(false);
  };
  const [departmentDelete, setDepartmentDelete] = useState<User>();

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
          Create Department
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

  const columns: ColumnsType<Department> = [
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
      title: 'Subject',
      dataIndex: 'Subject',
      width: 400,
      className: "text-center",
      render: (_text, record, _index) => {
        const maxTagsToShow = 3; 
        const tagsToShow = record.subjects!.slice(0, maxTagsToShow);
        const isMoreTags = record.subjects!.length > maxTagsToShow;
    
        return (
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <Space>
              {tagsToShow.map((tag, index) => (
                <Tag key={index}>
                  <span>{tag}</span>
                </Tag>
              ))}
              {isMoreTags && (
                <Tooltip title={record.subjects!.join(', ')}>
                  <Tag>+{record.subjects!.length - maxTagsToShow} more</Tag>
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
      width: 200,
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
                      
                    }}
                >
                    <FcViewDetails />
                </span>
              </Tooltip>

              <Tooltip title="Update">
                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}
                    onClick={() => {
                      handleModalEditOpen(true);
                      setDepartmentEdit(record);
                    }}
                >
                    <FiEdit />
                </span>
              </Tooltip>

              <Tooltip title="Delete">
                <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'
                  onClick={() => { 
                    handleModalDeleteOpen(true);
                    setDepartmentDelete(record);
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
              dataSource={listOfDepartments}
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

        <DepartmentManagementCreateModal isModalOpen={createModalShow} onClose={onCloseModalCreate} />

        <DepartmentManagementEditModal isModalOpen={editModalShow} onClose={onCloseModalEdit} department={departmentEdit} />

        <DepartmentManagementDeleteModal isModalOpen={deleteModalShow} onClose={onCloseModalDelete} department={departmentDelete} />

      </div>
    </>
  )
}

export default DepartmentManagementTemplate