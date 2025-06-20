import { Card, DatePicker, message, Space } from "antd";
import { Column } from "@ant-design/charts";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import Loading from "../../util/Loading";
import { getAllRevenueByDate, getAllRevenueByMonth, getDashboardSummary } from "../../api/RevenueApi";
import { Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';
export default function DashboardComponent() {
  const [dailyData, setDailyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [yearPick, setYearPick] = useState(2024);
  const [summary, setSummary] = useState(null);
  const fetchRevenueByDate = async () => {
    setLoading(true);
    try {
      const response = await getAllRevenueByDate();
      if (response) {
        const daily = response.map(item => ({
          name: new Date(item.createdAt).getHours() + ":00",
          value: item.totalRevenue,
        }));
        setDailyData(daily);
      }
    } catch (error) {
      message.error("Failed to fetch daily revenue data!");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueByMonth = async (year) => {
    setLoading(true);
    try {
      const response = await getAllRevenueByMonth(year);
      if (response) {
        const monthly = response.monthlyRevenues.map(item => ({
          name: `Month ${item.month}`, 
          value: item.totalRevenue,
        }));
        setYearlyData(monthly);
      }
    } catch (error) {
      message.error("Failed to fetch monthly revenue data!");
    } finally {
      setLoading(false);
    }
  };
  const fetchDashboardSummary = async () => {
    setLoading(true);
    try {
      const response = await getDashboardSummary();
      if (response) {
        setSummary(response);
      }
    } catch (error) {
      message.error("Failed to fetch monthly revenue data!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardSummary()
    fetchRevenueByDate();
    fetchRevenueByMonth(yearPick); 
  }, [yearPick]);

  if (loading) return <Loading />;

  const dailyConfig = {
    data: dailyData,
    xField: "name",
    yField: "value",
    label: {
      position: "top",
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    columnStyle: {
      fill: "#73d13d",
    },
    height: 300,
  };

  const monthlyConfig = {
    data: yearlyData,
    xField: "name",
    yField: "value",
    label: {
      position: "top",
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    columnStyle: {
      fill: "#fa5e8d",
    },
    height: 300,
  };
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <div style={{ padding: 20 }}>
      <div>
      <Row gutter={16}>
          <Col span={4}>
           <Card title="Tổng người dùng" bordered={false}>
              <Statistic
                value={summary ? summary.totalUsers : 0}
                formatter={formatter}
              />
            </Card>
          </Col>
          <Col span={4}>
          <Card title="Tổng hãng máy bay" bordered={false}>
            <Statistic
              value={summary ? summary.totalAirlines : 0}
              formatter={formatter}
            />
            </Card>
          </Col>

          <Col span={4}>
           <Card title="Tổng sân bay" bordered={false}>
            <Statistic
              value={summary ? summary.totalAirports : 0}
              formatter={formatter}
            />
            </Card>
          </Col>
          <Col span={4}>
            <Card title="Tổng máy bay" bordered={false}>
              <Statistic
                value={summary ? summary.totalPlanes : 0}
                formatter={formatter}
              />
              </Card>
          </Col>
          <Col span={4}>
            <Card title="Tổng chuyến bay" bordered={false}>
              <Statistic
                value={summary ? summary.totalFlights : 0}
                formatter={formatter}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Title  style={{  marginTop: 20,marginBottom: 20 }}level={2}>Doanh thu</Title>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Title level={4} style={{ textAlign: "center" }}>Doanh thu theo ngày</Title>
          <Column
            {...dailyConfig}
            data={dailyData.map(item => ({
              ...item,
              value: item.value / 1000000, 
            }))}
          />
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <em>Đơn vị tính: Triệu</em>
          </div>
        </div>
  
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Title level={4} style={{ textAlign: "center" }}>Doanh thu theo tháng ({yearPick})</Title>
          <DatePicker
            picker="year"
            onChange={(date) => {
              if (date) {
                setYearPick(date.year());
              }
            }}
            format="YYYY"
            style={{ marginBottom: 20, alignSelf: "center" }}
          />
          <Column
            {...monthlyConfig}
            data={yearlyData.map(item => ({
              ...item,
              value: item.value / 1000000, 
            }))}
          />
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <em>Đơn vị tính: Triệu</em>
          </div>
        </div>
      </div>
    </div>
  );
  
}
