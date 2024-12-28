import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Button, Input, Typography, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/stores";
import { getAllSubjectsThunk } from "@/stores/subject-management/thunk";
import { Subject } from "@/types/subject";
import { createTagThunk } from "@/stores/tag-management/thunk";

const { Text } = Typography;

interface TagCreationModalProps {
  subjectAuthen: Subject;
  isModalOpen: boolean;
  onClose: () => void;
}

export const TagCreationModal: React.FC<TagCreationModalProps> = ({ isModalOpen, onClose, subjectAuthen }) => {
  const { t } = useTranslation('tag_creation_modal');
  
  const dispatch = useAppDispatch();

  const schema = z.object({
    name: z.string().nonempty(t("nameRequired")),
    description: z.string(),
    options: z.array(
      z.object(
        { name: z.string() })).min(1, t("minOptions")
    ),
    subjectId: z.string(),
  });
  
  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { options: [], description: "", subjectId: subjectAuthen?.id }
  });

  const [newOption, setNewOption] = useState<string>();

  const options = watch("options", []);

  const handleAddOption = () => {
    const currentOptions = getValues("options");
    if (newOption && !currentOptions.some(option => option.name === newOption)) {
      setValue("options", [...currentOptions, { name: newOption}]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (option: string) => {
    const currentOptions = getValues("options").filter(o => o.name !== option);
    setValue("options", currentOptions);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    dispatch(createTagThunk(data));
    reset();
  };

  useEffect(() => { 
    setValue("subjectId", subjectAuthen?.id || ""); 
  }, [subjectAuthen, setValue]);

  useEffect(() => { 
    dispatch(getAllSubjectsThunk());
  }, []);

  return (
    <Modal
      title={<h1 className="text-xl font-semibold mb-4"> { t("create label") } </h1>}
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      centered
      className="create-tag-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="ant-form-item-label">
            <span> { t("name") } </span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder={t("placeholder name")} />}
          />
          {errors.name && <Text type="danger">{errors.name.message}</Text>}
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="ant-form-item-label">
            <span> { t("description") } </span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} placeholder={t("placeholder description")} />}
          />
          {errors.description && <Text type="danger">{errors.description.message}</Text>}
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="ant-form-item-label">
            <span> { t("options") } </span>
          </label>
          <div className="options-input">
            <Input
              placeholder={t("placeholder option")} 
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              className="option-input"
            />
            <Button type="primary" onClick={handleAddOption}>
              <PlusOutlined /> { t("add option") }
            </Button>
          </div>
          <div className="options-list" style={{ marginTop: 8 }}>
            {options.map(option => (
              <div key={option.name} className="option-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text>{option.name}</Text>
                <MinusCircleOutlined
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => handleRemoveOption(option.name)}
                />
              </div>
            ))}
          </div>
          {errors.options && <Text type="danger">{errors.options.message}</Text>}
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}> { t("cancel") } </Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}> { t("create") } </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TagCreationModal;
