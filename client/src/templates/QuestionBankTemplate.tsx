import { useState } from 'react'
import { Table, Tag, Popconfirm, Space, message, Image, Tooltip } from 'antd';
import { Button, Col, Row } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { AiFillDelete, AiOutlineReload } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi'
import { FaPlusCircle } from 'react-icons/fa'
import { FcViewDetails } from 'react-icons/fc'

// import { fetchItemIndiningRoom, handleDeleteBackgrroundHotel } from '../../requestHepperUser/_requestts';
// import { ItemIndiningRoomCreate } from './ItemIndiningRoomCreate';
// import { ItemIndiningRoomUpdate } from './ItemIndiningRoomUpdate';
// import { ItemIndiningRoomDetails } from './ItemIndiningRoomDetails';

import "../style/style.scss";

export const QuestionBankTemplate = () => {
    const [listItem, setListItem] = useState<any>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false)
    // const [openModalCreateItem, setopenModalCreateItem] = useState<boolean>(false);
    // const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    // const [dataModalUpdate, setDataModalUpdate] = useState({});
    // const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
    // const [dataDetail, setDataDetail] = useState({})
    
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
            title: 'IMAGE',
            dataIndex: 'IMAGE',
            className: "",
            render: (_text, record, _index) => {
                return (
                    <>

                        <Image
                            width={128}
                            height={72}
                            src={record.IMAGE}
                        />
                    </>
                )
            }
        },

        {
            title: 'NAME',
            dataIndex: 'NAME_VI',
            width: 150,
            className: "",
            render: (_text, record, _index) => {
                return (
                    <>
                        <Space>
                            <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.NAME_VI
                            }</span>
                        </Space>
                    </>
                )
            }
        },

        {
            title: 'DESCRIPTION',
            dataIndex: 'DESCRIPTION_VI',
            className: "",
            render: (_text, record, _index) => {
                return (
                    <>
                        <Space>
                            <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.DESCRIPTION_VI
                            }</span>
                        </Space>
                    </>
                )
            }
        },
        {
            title: 'PRICE',
            dataIndex: 'PRICE_VI',
            className: "",
            render: (_text, record, _index) => {
                return (
                    <>
                        <Space>
                            <span className="fw-bold text-gray-800 fs-6" style={{ color: "#181c32" }}>{record.PRICE_VI
                            }</span>
                        </Space>
                    </>
                )
            }
        },


        {
            title: 'STATUS',
            dataIndex: 'STATUS',
            className: "",

            filters: [
                {
                    text: 'Active',
                    value: 1,
                },
                {
                    text: 'InActive',
                    value: 0,
                },
            ],

            onFilter: (value, record) => {

                if (record.STATUS === value) {
                    return true
                } else {
                    return false
                }
            },

            render: (STATUS) => {
                let color = STATUS === 1 ? 'green' : '#f1416c';

                if (STATUS === 1) {
                    return (
                        <>
                            <Tag color={color}>
                                <span className=" fs-6" style={{ color: "#50cd89" }}>Active</span>
                            </Tag>
                        </>
                    )
                } else {
                    return (
                        <>
                            <Tag color={color}>
                                inActive
                            </Tag>
                        </>
                    )
                }

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
                                        // setOpenViewDetail(true);
                                        // setDataDetail(record);
                                    }}
                                >
                                    <FcViewDetails />
                                </span>
                            </Tooltip>

                            <Tooltip title="Update">
                                <span style={{ cursor: "pointer", color: "#fcb900", fontSize: 18 }}

                                    onClick={() => {
                                        // setOpenModalUpdate(true);
                                        // setDataModalUpdate(record);
                                    }}
                                >
                                    <FiEdit />
                                </span>
                            </Tooltip>

                            <Tooltip title="Delete">
                                <Popconfirm
                                    placement='leftTop'
                                    title="Delete the Backgroud"
                                    description="Are you sure to delete this Backgroud?"
                                    //handle delete
                                    // onConfirm={() => handleDeleteItem(record.id)}
                                    okText="Confirm"
                                    cancelText="Cancel"
                                >
                                    <span style={{ cursor: "pointer", color: "#ff4d4f", fontSize: 18 }} title='Delete Channel'>
                                        <AiFillDelete />
                                    </span>
                                </Popconfirm>

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
                            dataSource={listItem}
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

                {/* <ItemIndiningRoomCreate
                    openModalCreateItem={openModalCreateItem}
                    setopenModalCreateItem={setopenModalCreateItem}
                    fetchInfor={fetchInfor}
                />


                <ItemIndiningRoomUpdate
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    dataModalUpdate={dataModalUpdate}
                    fetchInfor={fetchInfor}
                />


                <ItemIndiningRoomDetails
                    openViewDetail={openViewDetail}
                    setOpenViewDetail={setOpenViewDetail}
                    dataDetail={dataDetail}

                /> */}
            </div>
        </>
    )
}

export default QuestionBankTemplate
