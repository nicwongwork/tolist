import React, { useState } from 'react';
import { Layout, Typography, List, Button, Form, Input, Space, Popconfirm, Card, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDuties } from './hooks/useDuties';
import { Duty } from './types/duty.interface';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export const App: React.FC = () => {
  const { duties, loading, handleAdd, handleUpdate, handleDelete } = useDuties();

  const [createForm] = Form.useForm();
  const [inlineEditForm] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const nameValidationRules = [
    { required: true, message: 'Please enter a duty name' },
    { max: 100, message: 'Duty name cannot exceed 100 characters' },
    {
      validator: (_: any, value: string) => {
        if (value && value.trim().length === 0) {
          return Promise.reject(new Error('Duty name cannot be empty or whitespaces only'));
        }
        return Promise.resolve();
      }
    }
  ];

  const onFinishCreate = (values: { name: string }) => {
    const trimmedName = values.name.trim();
    if (trimmedName) {
      handleAdd(trimmedName); // Create the duty with trimmed name
      createForm.resetFields();
    }
  };

  const handleEditClick = (item: Duty) => {
    setEditingId(item.id);
    inlineEditForm.setFieldsValue({ inlineName: item.name });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    inlineEditForm.resetFields();
  };

  const handleSaveInline = async () => {
    try {
      const values = await inlineEditForm.validateFields(['inlineName']);
      const trimmedName = values.inlineName.trim();

      if (editingId && trimmedName) {
        await handleUpdate(editingId, trimmedName); // Update the duty with the new name
        setEditingId(null);
        inlineEditForm.resetFields();
      }
    } catch (errorInfo) {
      console.log('Inline validation failed:', errorInfo);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px' }}>
        <Space size="middle">
          <CheckCircleOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
          <Title level={3} style={{ color: '#fff', margin: 0, lineHeight: '64px' }}>
            Todo Duty Manager
          </Title>
        </Space>
      </Header>

      <Content style={{ padding: '40px 20px', maxWidth: '750px', margin: '0 auto', width: '100%' }}>
        <Card style={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>

          <Form form={createForm} onFinish={onFinishCreate} layout="inline" style={{ marginBottom: '24px', display: 'flex' }}>
            <Form.Item name="name" rules={nameValidationRules} style={{ flex: 1, marginRight: '8px', marginBottom: 0 }}>
              <Input placeholder="Add a new todo duty..." maxLength={100} size="large" allowClear disabled={loading} />
            </Form.Item>
            <Form.Item style={{ marginRight: 0, marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large" loading={loading}>
                Add
              </Button>
            </Form.Item>
          </Form>

          <Spin spinning={loading} tip="Syncing with database...">
            <Form form={inlineEditForm} component={false}>
              <List
                bordered
                dataSource={duties}
                locale={{ emptyText: 'No duties found. Create one above!' }}
                renderItem={(item: Duty) => {
                  const isEditing = item.id === editingId;

                  return (
                    <List.Item
                      className="duty-item"
                      actions={
                        isEditing ? [
                          <Button type="text" icon={<SaveOutlined style={{ color: '#52c41a' }} />} onClick={handleSaveInline}>Save</Button>,
                          <Button type="text" icon={<CloseOutlined style={{ color: '#ff4d4f' }} />} onClick={handleCancelEdit}>Cancel</Button>
                        ] : [
                          <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleEditClick(item)} disabled={editingId !== null || loading}>Edit</Button>,
                          <Popconfirm
                            title="Are you sure you want to delete this duty?"
                            onConfirm={() => handleDelete(item.id)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                            disabled={editingId !== null || loading}
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} disabled={editingId !== null || loading}>Delete</Button>
                          </Popconfirm>
                        ]
                      }
                      style={{ padding: '16px 24px', alignItems: 'center' }}
                    >
                      {isEditing ? (
                        <Form.Item name="inlineName" rules={nameValidationRules} style={{ margin: 0, width: '100%', marginRight: '16px' }}>
                          <Input maxLength={100} size="large" onPressEnter={handleSaveInline} autoFocus />
                        </Form.Item>
                      ) : (
                        <span style={{ fontSize: '16px', color: '#262626', wordBreak: 'break-word' }}>
                          {item.name}
                        </span>
                      )}
                    </List.Item>
                  );
                }}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
              />
            </Form>
          </Spin>
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#bfbfbf', background: 'transparent' }}>
        Nic Wong ©2026 Created with Ant Design and PostgreSQL
      </Footer>
    </Layout>
  );
};