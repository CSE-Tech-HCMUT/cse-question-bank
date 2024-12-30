import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Button, Input, Space, Typography, Divider, Table, message, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined, EditOutlined } from "@ant-design/icons";
import "../../../../styles/tag-management/TagCreationModal.scss";
import { TagQuestion } from "@/types/tagQuestion";
import { TagOption } from "@/types/tagOption";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/stores";
import { editTagThunk } from "@/stores/tag-management/thunk";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface TagEditModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  tagData: TagQuestion | null;
}

export const TagEditModal: React.FC<TagEditModalProps> = ({ isModalOpen, onClose, tagData }) => {
  const { t } = useTranslation('tag_edit_modal');  

  const { data } = useSelector((state: RootState) => state.subjectManagementReducer);
  const dispatch = useAppDispatch();

  const schema = z.object({
    name: z.string().nonempty(t("validation.nameRequired")),
    description: z.string(),
    options: z.array(
      z.object({
        id: z.number(),
        name: z.string().nonempty(t("validation.optionRequired")),
        tagId: z.number().optional(),
        startedTime: z.string().optional(),
        updatedTime: z.string().optional(),
      })
    ).min(1, t("validation.minOptions")),
    subjectId: z.string().nonempty(t("subjectRequired")),
  });
  
  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit, setValue, getValues, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", options: [], subjectId: "" }
  });

  const [newOption, setNewOption] = useState<string>("");
  const [editingOption, setEditingOption] = useState<TagOption | null>(null);

  useEffect(() => {
    if (tagData) {
      reset(tagData);
      setValue("subjectId", tagData.subject?.id!);
    }
  }, [tagData, reset, setValue]);
  
  const options = watch("options", []);

  const handleAddOption = () => {
    const currentOptions = getValues("options");
    if (newOption && !currentOptions.some(option => option.name === newOption)) {
      const newOptionObject = {
        id: currentOptions.length ? Math.max(...currentOptions.map(o => o.id)) + 1 : 1,
        name: newOption,
        tagId: tagData ? tagData.id : 0,
      };
      setValue("options", [...currentOptions, newOptionObject]);
      setNewOption("");
    } else {
      message.warning(t("optionExists"));
    }
  };

  const handleRemoveOption = (id: number) => {
    const currentOptions = getValues("options").filter(option => option.id !== id);
    setValue("options", currentOptions);
  };

  const handleEditOption = (option: TagOption) => {
    setEditingOption(option);
    setNewOption(option.name!);
  };

  const handleSaveOption = () => {
    if (editingOption) {
      const updatedOptions = getValues("options").map(option =>
        option.id === editingOption.id ? { ...option, name: newOption } : option
      );
      setValue("options", updatedOptions);
      setEditingOption(null);
      setNewOption("");
    } else {
      handleAddOption();
    }
  };

  const onSubmit: SubmitHandler<FormData> = data => {
    dispatch(editTagThunk(data));
    reset();
  };

  const columns: ColumnsType<TagOption> = [
    { title: "ID", dataIndex: "id", key: "id", render: (_text, _record, index: number) => <span className="text-primary">{index + 1}</span> },
    { title: t("tagContent"), dataIndex: "name", key: "name" },
    {
      title: t("actions"),
      key: "actions",
      className: "!text-center",
      render: (_text: any, record: TagOption) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditOption(record)} />
          <Button type="primary" icon={<MinusCircleOutlined />} onClick={() => handleRemoveOption(record.id!)} />
        </Space>
      )
    }
  ];

  return (
    <Modal
      title={<h1 className="text-xl font-semibold mb-4">
        { t("editTag") }
      </h1>}
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      centered
      className="create-tag-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="ant-form-item-label">
            <span>{ t("name") }</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder={t("placeholderName")} />}
          />
          {errors.name && <Text type="danger">{errors.name.message}</Text>}
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="ant-form-item-label">
            <span>{ t("description") }</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} placeholder={t("placeholder description")} />}
          />
          {errors.description && <Text type="danger">{errors.description.message}</Text>}
        </div>

        <div className="flex flex-col" style={{ marginTop: 16 }}> 
          <label className="ant-form-item-label"> 
            <span>{t("subject")}</span> 
          </label> 
          <Controller 
            name="subjectId" 
            control={control} 
            render={({ field }) => ( 
              <Select {...field} placeholder={t("placeholder subject")} allowClear> 
                {data?.map(subject => ( 
                  <Select.Option key={subject.id} value={subject.id!.toString()}> 
                    {subject.name} 
                  </Select.Option> )
                )} 
              </Select> 
            )} 
          /> 
          {errors.subjectId && <Text type="danger">{errors.subjectId.message}</Text>} 
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="ant-form-item-label">
            <span>{ t("options") }</span>
          </label>
          <div className="options-input">
            <Input
              placeholder={t("placeholderOption")}
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              className="option-input"
            />
            <Button type="primary" onClick={handleSaveOption}>
              {editingOption ? t("saveOption") : <><PlusOutlined className="mr-2" /> {t("addOption")} </>}
            </Button>
          </div>
          <Table dataSource={options} columns={columns} rowKey="id" pagination={false} />
          {errors.options && <Text type="danger">{errors.options.message}</Text>}
        </div>

        <Divider />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>{t("save")}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TagEditModal;
