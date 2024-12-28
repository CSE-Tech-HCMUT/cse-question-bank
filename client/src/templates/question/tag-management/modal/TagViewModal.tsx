import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, Table, Space } from 'antd';
import { TagQuestion } from '@/types/tagQuestion';
import { useTranslation } from "react-i18next";
import { ColumnsType } from 'antd/es/table';
import { TagOption } from '@/types/tagOption';

interface ViewTagManagementModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  tagData: TagQuestion | null;
}

export const TagViewModal: React.FC<ViewTagManagementModalProps> = ({ isModalOpen, onClose, tagData }) => {
  const { t } = useTranslation('tag_view_modal');
  const [form] = Form.useForm();

  useEffect(() => {
    if (tagData) {
      form.setFieldsValue(tagData);
    }
  }, [tagData, form]);

  const columns: ColumnsType<TagOption> = [
    { title: t('id'), dataIndex: 'id', key: 'id', render: (_text, _record, index: number) => <span className="text-primary">{index + 1}</span> },
    { title: t('name'), dataIndex: 'name', key: 'name' },
  ];

  return (
    <Modal
      title={<h1 className="text-xl font-semibold mb-4">{t('viewTag')}</h1>}
      open={isModalOpen}
      onCancel={onClose}
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={onClose}>{t('close')}</Button>
        </Space>
      }
      centered
      className="create-tag-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t('name')}
          name="name"
        >
          <Input placeholder={t('placeholderName')} readOnly />
        </Form.Item>
        <Form.Item
          label={t('description')}
          name="description"
        >
          <Input placeholder={t('placeholderDescription')} readOnly />
        </Form.Item>
        <Form.Item
          label={t('subject')}
        >
          <Input value={tagData?.subject?.name} placeholder={t('placeholderSubject')} readOnly />
        </Form.Item>
        <Form.Item label={t('tagOptions')}>
          <Table dataSource={tagData?.options || []} columns={columns} rowKey="id" pagination={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagViewModal;
