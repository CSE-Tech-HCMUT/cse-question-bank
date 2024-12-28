import { Button, Space, TableProps, Tag, theme, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaPlusCircle } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import { TagQuestion } from "@/types/tagQuestion";
import { TagOption } from "@/types/tagOption";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/stores";
import { tagManagementActions } from "@/stores/tag-management/slice";
import { TagCreationModal, TagDeleteModal, TagEditModal, TagViewModal } from "./modal";
import "../../../styles/tag-management/TagCreationModal.scss"
import { getAllTagsThunk } from "@/stores/tag-management/thunk";
import { Subject } from "@/types/subject";

export const TagManagementTemplate = () => {
  const { t } = useTranslation('tag_management')

  // authen
  const [subjectAuthen, setSubjectAuthen] = useState<Subject>();

  const { 
    token: { colorPrimary }
  } = theme.useToken();

  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const handlePagination: TableProps<TagQuestion>["onChange"] = (pagination) => {
    if (pagination?.current !== current) setCurrent(pagination.current!);
    if (pagination?.pageSize !== pageSize) {
        setPageSize(pagination.pageSize!);
        setCurrent(1);
    }
  };

  const { createModalShow, editModalShow, deleteModalShow, viewModalShow, data } = useSelector((state: RootState) => state.tagManagementReducer);
  const dispatch = useAppDispatch();

  // Create Modal
  const handleModalCreateOpen = () => {
    dispatch(tagManagementActions.setCreateModalVisibility(true));
  };

  const handleModalCreateClose = () => {
    dispatch(tagManagementActions.setCreateModalVisibility(false));
  };

  // Edit Modal
  const [editTagQuestion, setEditTagQuestion] = useState<TagQuestion>();

  const handleModalEditOpen = () => {
    dispatch(tagManagementActions.setEditModalVisibility(true));
  };

  const handleModalEditClose = () => {
    dispatch(tagManagementActions.setEditModalVisibility(false));
  };

  // Delete Modal
  const [deleteTagQuestion, setDeleteTagQuestion] = useState<TagQuestion>();

  const handleModalDeleteOpen = () => {
    dispatch(tagManagementActions.setDeleteModalVisibility(true));
  };

  const handleModalDeleteClose = () => {
    dispatch(tagManagementActions.setDeleteModalVisibility(false));
  };

  // View Modal
  const [viewTagQuestion, setViewTagQuestion] = useState<TagQuestion>();

  const handleModalViewOpen = () => {
    dispatch(tagManagementActions.setViewModalVisibility(true));
  };

  const handleModalViewClose = () => {
    dispatch(tagManagementActions.setViewModalVisibility(false));
  };
  
  const TitleTable = () => (
    <div className="flex sm:justify-end">
      <Space wrap>
        <Button
            type="primary"
            icon={<FaPlusCircle />}
            size={'middle'}
            onClick={handleModalCreateOpen}
        >
            { t("create tag") }
        </Button>
      </Space>
    </div>
  )

  const columns: ColumnsType<TagQuestion> = [
    {
      title: t("no"),
      dataIndex: "id",
      key: "id",
      className: "!text-center",
      render: (_text, _record, index: number) => <span className="text-primary">{index + 1}</span>
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="text-primary">{text}</span>
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span className="text-primary">{text}</span>
    },
    {
      title: t("subject"),
      dataIndex: "subject",
      key: "subject",
      render: (record: Subject) => <span className="text-primary">{record?.name}</span>
    },
    {
      title: t("options"),
      dataIndex: "options",
      key: "options",
      className: "!text-center",
      render: (options: TagOption[]) => {
        const MAX_OPTIONS = 3;
        const visibleOptions = options.slice(0, MAX_OPTIONS);
        const hiddenOptions = options.slice(MAX_OPTIONS);

        return (
          <div>
              {visibleOptions.map((option) => (
                  <Tag color={colorPrimary} key={option.id} className="mb-1">
                      {option.name}
                  </Tag>
              ))}
              {hiddenOptions.length > 0 && (
                  <Tag color="cyan">+{hiddenOptions.length} more</Tag>
              )}
          </div>
        );
      }
    },
    {
      title: t("actions"),
      key: "actions",
      className: "!text-center",
      render: (record: TagQuestion) => (
        <Space>
            <Tooltip title={t("view details")}>
                <span>
                    <AiFillEye
                      className="custom-icon"
                      onClick={() => { 
                        setViewTagQuestion(record);
                        handleModalViewOpen();
                      }}
                    />
                </span>
            </Tooltip>
            <Tooltip title={t("edit")}>
                <span>
                    <FiEdit 
                      className="custom-icon" 
                      onClick={() => { 
                        setEditTagQuestion(record);
                        handleModalEditOpen();
                      }}
                    />
                </span>
            </Tooltip>
            <Tooltip title={t("delete")}>
                <span>
                    <AiFillDelete
                      className="custom-icon"
                      onClick={() => { 
                        setDeleteTagQuestion(record);
                        handleModalDeleteOpen();
                      }}
                    />
                </span>
            </Tooltip>
        </Space>
      ),
    }
  ]
 
  useEffect(() => { 
    const storedSubject = localStorage.getItem('subjectAuthen'); 
    if (storedSubject) { 
      setSubjectAuthen(JSON.parse(storedSubject)); 
    }
    dispatch(getAllTagsThunk()).then((actionResult) => {
      if(actionResult.meta.requestStatus === "fulfilled"){
        setTotal(data?.length!);
        setLoading(false);
      }
    })
  }, []);

  return (
    <main className="bg-gray-100 rounded-md">
      <h1 className="text-3xl font-bold mb-4">
        { t("tag management") }
      </h1>

      {/* table */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <Table
          rowKey="id"
          loading={loading}
          title={TitleTable}
          columns={columns}
          dataSource={data?.filter((tag) => tag.subject?.id === subjectAuthen?.id)}
          onChange={handlePagination}
          scroll={{ x: 1000 }}
          size="middle"
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
        />
      </div>

      <TagCreationModal isModalOpen={createModalShow!} onClose={handleModalCreateClose} subjectAuthen={subjectAuthen!} />
      <TagEditModal tagData={editTagQuestion!} isModalOpen={editModalShow!} onClose={handleModalEditClose} />
      <TagDeleteModal tagData={deleteTagQuestion!} isModalOpen={deleteModalShow!} onClose={handleModalDeleteClose} />
      <TagViewModal tagData={viewTagQuestion!} isModalOpen={viewModalShow!} onClose={handleModalViewClose} />

    </main>
  )
}

export default TagManagementTemplate