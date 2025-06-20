import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip, Popconfirm, message, Form, Input, Upload, Modal, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteAirline, getAllAirline, createOrUpdateAirline } from '../../api/AirlineApi';
export default function AirlineComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [fileList, setFileList] = useState([]);

    const fetchAirlines = async () => {
        setLoading(true);
        try {
            const response = await  getAllAirline();
            if(response){
                const tableData = response.map((airline, index) => ({
                    key: airline.id,
                    stt: index + 1,
                    name: airline.name,
                    logo: `${airline.logo}`,
                }));
                setData(tableData);
            }
        } catch (error) {
            message.error('Failed to fetch airlines!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirlines();
    }, []);

    const handleDelete = async (record) => {
        try {
            const response = await deleteAirline(record.key)
            if (response.ok) {
                message.success('Airline deleted successfully!');
                fetchAirlines();
            } else {
                const errorData = await response.text();
                message.error(errorData);
            }
        } catch (error) {
            message.error('Error while deleting airline!');
        }
    };

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditRecord(record);
        if (record) {
            form.setFieldsValue({
                airlineName: record.name,
            });
            setFileList([{ url: record.logo }]);
        } else {
            form.resetFields();
            setFileList([]);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setFileList([]);
        setEditRecord(null);
    };

    const handleSubmit = async (values) => {
        if (!values.airlineName || fileList.length === 0) {
            message.error('Please fill in all required fields!');
            return;
        }
    
        let base64 = null;
        if (fileList[0].originFileObj) {
            base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileList[0].originFileObj);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        } else if (fileList[0].url) {
            // Existing base64 image
            base64 = fileList[0].url;
        }
    
        const formData = new FormData();
        formData.append('airlineName', values.airlineName);
        if (base64) {
            formData.append('logo', base64);
        }
        if (editRecord) {
            formData.append('id', editRecord.key);
        }
    
        setFormLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8081/api/admin/airline/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            
            if (response.ok) {
                message.success(editRecord ? 'Airline updated successfully!' : 'Airline created successfully!');
                fetchAirlines();
                closeModal();
            } else {
                const errorData = await response.json();
                if (Array.isArray(errorData)) {
                    message.error(errorData.join(', '));
                } else {
                    message.error(errorData);
                }
            }
        } catch (error) {
            message.error('An error occurred while submitting the form!');
        } finally {
            setFormLoading(false);
        }
    };
    const onFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const columns = [
        {
            title: 'Stt',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo) => <img src={logo} alt="Airline Logo" style={{ width: 100, height: 100 }} />,
        },
        {
            title: 'Option',
            key: 'option',
            render: (_, record) => (
                <span>
                    <Tooltip title="Edit">
                        <Button type="default" shape="circle" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    </Tooltip>
                    {' | '}
                    <Popconfirm
                        title="Are you sure you want to delete this airline?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Airline Information</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Airline
                </Button>
            </div>

            <Spin spinning={loading}>
                <Table columns={columns} dataSource={data} />
            </Spin>

            <Modal
                title={editRecord ? 'Edit Airline' : 'Add Airline'}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Airline Name"
                        name="airlineName"
                        rules={[{ required: true, message: 'Please input the airline name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        label="Airline Logo"
                        rules={[{ required: true, message: 'Please upload a logo!' }]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onFileChange}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" loading={formLoading}>
                            {editRecord ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}