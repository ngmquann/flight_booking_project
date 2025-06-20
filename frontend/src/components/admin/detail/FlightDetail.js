import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd';
import { getAllAirport } from '../../../api/AirportApi';
import { getAllPlane } from '../../../api/PlaneApi';
import { createOrUpdateFlight } from '../../../api/FlightApi';
import {  Drawer } from 'antd';
export default function FlightDetail() {
  const [airport, setAirport] = useState([]);
  const [planes, setPlane] = useState([]);
  const [form] = Form.useForm();
  const [id, setId] = useState(null);
  const [airportDep, setAirportDep] = useState([]);

  // Fetch airport data
  const fetchAirport = async () => {
    try {
      const response = await getAllAirport();
      if (response) {
        setAirport(response);
      }
    } catch (error) {
      message.error('Failed to fetch airports!');
    }
  };

  // Fetch plane data
  const fetchData = async () => {
    try {
      const apiData = await getAllPlane();
      if (apiData) {
        setPlane(apiData);
        console.log(apiData)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAirport();
    fetchData();
  }, []);

  const onFinish = async(values) => {
    const { departure_time, arrival_time,departure_id,arrival_id, ...rest } = values;
    const updatedAirportDep = [{ id: departure_id }, { id: arrival_id }];
    setAirportDep(updatedAirportDep);

    const formattedValues = {
    ...rest,
    departure_time: departure_time.format('YYYY-MM-DD HH:mm:ss'), 
    arrival_time: arrival_time.format('YYYY-MM-DD HH:mm:ss'),
    airport_list:updatedAirportDep,
    departure_id:departure_id,
    arrival_id:arrival_id
  };
    try{
      const result = await createOrUpdateFlight(formattedValues);
      if(result.ok){
        const infor = await result.text();
        console.log(infor)
        message.success(infor)
        form.resetFields();
      }else{
        const data = await result.text();
        message.error(data)
      }
    }
    catch (error) {
      console.log(error)
      message.error("Error")
    }
  };

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: 'middle',
        }}
        size="middle"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}
        onFinish={onFinish} // Khi submit form
      >
        <Form.Item label="Mã máy bay" name="code">
          <Input />
        </Form.Item>
        <Form.Item label="Sân bay đi" name="departure_id" rules={[{ required: true, message: 'Please select a departure airport!' }]}>
          <Select>
            {airport.map((airport) => (
              <Select.Option key={airport.id} value={airport.id}>
                {airport.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Sân bay đến" name="arrival_id" rules={[{ required: true, message: 'Please select an arrival airport!' }]}>
          <Select>
            {airport.map((airport) => (
              <Select.Option key={airport.id} value={airport.id}>
                {airport.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Thời gian khởi hành" name="departure_time" rules={[{ required: true, message: 'Please select a departure time!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Thời gian đến" name="arrival_time" rules={[{ required: true, message: 'Please select an arrival time!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Giá ghế thường" name="eco_price" rules={[{ required: true, message: 'Please input the economy seat price!' }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Giá ghế thương gia" name="bus_price" rules={[{ required: true, message: 'Please input the business seat price!' }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Thuộc máy bay" name="plane_id" rules={[{ required: true, message: 'Please select a plane!' }]}>
          <Select>
            {planes.map((plane) => (
              <Select.Option key={plane.id} value={plane.id}>
                {plane.name}({plane.nameAirline})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}
