import React, { useState } from 'react';
import { Layout, Typography, List, Button, Form, Input, Space, Popconfirm, Card, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Duty } from './types/duty.interface';
import './index.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export const App: React.FC = () => {
  const [duties, setDuties] = useState<Duty[]>([
    { id: '1', name: 'Design backend database schema architecture (Plain SQL)' },
    { id: '2', name: 'Setup frontend layout with Ant Design components' },
    { id: '3', name: 'Write robust Jest unit tests and handle extreme edge cases' },
  ]);

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
      const newId = String(Date.now());
      const newDuty: Duty = { id: newId, name: trimmedName };
      setDuties([...duties, newDuty]);
      createForm.resetFields();
      message.success('Duty created successfully');
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
        setDuties(duties.map(d => d.id === editingId ? { ...d, name: trimmedName } : d));
        setEditingId(null);
        inlineEditForm.resetFields();
        message.success('Duty updated successfully');
      }
    } catch (errorInfo) {
      console.log('Inline validation failed:', errorInfo);
    }
  };

  const handleDelete = (id: string) => {
    setDuties(duties.filter(d => d.id !== id));
    message.success('Duty deleted successfully');
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

          <Form
            form={createForm}
            onFinish={onFinishCreate}
            layout="inline"
            style={{ marginBottom: '24px', display: 'flex' }}
          >
            <Form.Item
              name="name"
              rules={nameValidationRules}
              style={{ flex: 1, marginRight: '8px', marginBottom: 0 }}
            >
              <Input placeholder="Add a new todo duty..." maxLength={100} size="large" allowClear />
            </Form.Item>
            <Form.Item style={{ marginRight: 0, marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large">
                Add
              </Button>
            </Form.Item>
          </Form>

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
                        <Button
                          type="text"
                          icon={<SaveOutlined style={{ color: '#52c41a' }} />}
                          onClick={handleSaveInline}
                        >
                          Save
                        </Button>,
                        <Button
                          type="text"
                          icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      ] : [
                        <Button
                          type="text"
                          icon={<EditOutlined style={{ color: '#1890ff' }} />}
                          onClick={() => handleEditClick(item)}
                          disabled={editingId !== null}
                        >
                          Edit
                        </Button>,
                        <Popconfirm
                          title="Are you sure you want to delete this duty?"
                          onConfirm={() => handleDelete(item.id)}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                          disabled={editingId !== null}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={editingId !== null}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      ]
                    }
                    style={{ padding: '16px 24px', alignItems: 'center' }}
                  >
                    {isEditing ? (
                      <Form.Item
                        name="inlineName"
                        rules={nameValidationRules}
                        style={{ margin: 0, width: '100%', marginRight: '16px' }}
                      >
                        <Input
                          maxLength={100}
                          size="large"
                          onPressEnter={handleSaveInline}
                          autoFocus
                        />
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
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#bfbfbf', background: 'transparent' }}>
        Nic Wong ©2026 Created with Ant Design and React
      </Footer>
    </Layout>
  );
};