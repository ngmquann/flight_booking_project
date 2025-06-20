import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip, Popconfirm, message, Form, Input, Modal, Select, InputNumber } from 'antd';
import { createOrUpdatePlane, deletePlane, getAllPlane } from '../../api/PlaneApi';
import { addAirport, deleteAirport } from '../../api/AirportApi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Loading from '../../util/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllAirline } from '../../api/AirlineApi';

export default function PlaneComponent() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [airline, setAirline] = useState(null);
  const [name, setName] = useState('');
  const [eco, setEco] = useState('');
  const [businis, setBusinis] = useState('');
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(null);
  const [plane, setPlane] = useState(null);
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
      title: 'Total business',
      dataIndex: 'bus',
      key: 'bus',
    },
    {
      title: 'Total economy',
      dataIndex: 'eco',
      key: 'eco',
    },
    {
      title: 'Airline',
      dataIndex: 'airline',
      key: 'airline',
    },
    {
      title: 'Option',
      key: 'option',
      render: (_, record) => (
        <span>
          <Tooltip title="Edit">
            <Button 
              type="default" 
              shape="circle" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)} 
            />
          </Tooltip>
          |
          <Popconfirm
            title="Delete the Plane?"
            description="Are you sure you want to delete this plane?"
            onConfirm={() => handleDelete(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button 
                type="danger" 
                shape="round" 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiData = await getAllPlane();
        if (apiData) {
          const tableData = apiData.map((plane, index) => ({
            key: plane.id,
            stt: index + 1,
            name: plane.name,
            bus: plane.busClass,
            eco: plane.ecoClass,
            airlineId: plane.airlineId,
            airline:plane.nameAirline
          }));
          setData(tableData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reload]);
  const fetchAirlines = async () => {
    setLoading(true);
    try {
        const response = await  getAllAirline();
        if(response){
            setAirline(response);
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
  if (loading) return <Loading />;

  const handleEdit = (record) => {
    console.log('Record in handleEdit:', record);
    setId(record.key);
    setName(record.name);
    setEco(record.eco);
    setBusinis(record.bus);
    setPlane(record.airlineId)
    form.setFieldsValue({
      name: record.name,
      eco: record.eco,
      businis: record.bus,

    });
    setOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      const result = await deletePlane(record.key);
      if (result.ok) {
        const infor = await result.text();
        setReload((prev) => !prev);
        message.success(infor);
      } else {
        const data = await result.text();
        message.error(data);
      }
    } catch (error) {
      message.error('Error');
    }
  };

  const cancel = () => {
    message.error('Action cancelled');
  };

  const handleCancel = () => {
    setId(null);
    setName('');
    setEco('');
    setBusinis('');
    setPlane(null)
    form.resetFields();
    setOpen(false);
  };

  const onFinish = async () => {
    const formData = {
      id:id,
      name:name,
      eco_class:eco,
      bus_class: businis,
      airlineId:plane
    };
    try {
      const result = await createOrUpdatePlane(formData);
      if (result.ok) {
        const data = await result.text();
        form.resetFields();
        setId(null);
        setName('');
        setEco('');
        setBusinis('');
        setPlane(null)
        setReload((prev) => !prev);
        message.success(data);
      } else {
        const data = await result.json();
        message.error(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Plane Information</h1>
        <span onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
        </span>
      </div>
      <Modal
        title="Tùy chọn sân bay"
        centered
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          labelAlign="right"
        >
          <Form.Item
            label="Tên máy bay"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Số ghế thường"
            name="eco"
            rules={[
              {
                required: true,
                message: 'Please input the economy class seats!',
              },
            ]}
          >
            <InputNumber value={eco} onChange={(e) => setEco(e)} />
          </Form.Item>

          <Form.Item
            label="Số ghế thương gia"
            name="businis"
            rules={[
              {
                required: true,
                message: 'Please input the business class seats!',
              },
            ]}
          >
            <InputNumber put value={businis}  onChange={(value) => setBusinis(value)} />
          </Form.Item>
          <Form.Item label="Thuộc hãng máy bay">
            <Select 
                value={plane} 
                onChange={(value) => setPlane(value)}
                placeholder="Chọn hãng"
            >
                {airline && airline.map((airline) => (
                <Select.Option key={airline.id} value={airline.id}>
                    {airline.name}
                </Select.Option>
                ))}
            </Select>
            </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
