import React, { useEffect, useState } from "react"
import {
  Button,
  Card,
  Flex,
  Form,
  List,
  message,
  Modal,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd"
import Loading from "../../util/Loading"
import {
  getAllFlights,
  getFlightById,
  searchByCode,
  setStatusFlight,
} from "../../api/FlightApi"
import { EditOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons"
import Search from "antd/es/input/Search"
import { Link, useLocation } from "react-router-dom"
import { Drawer } from "antd"
import { getTicketById } from "../../api/TicketApi"

export default function FlightComponent() {
  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Airline",
      dataIndex: "airline",
      key: "airline",
    },
    {
      title: "Departure Time",
      dataIndex: "departureTime",
      key: "departureTime",
    },
    {
      title: "Arrival Time",
      dataIndex: "arrivalTime",
      key: "arrivalTime",
    },
    {
      title: "Departure Airport",
      dataIndex: "departureAirport",
      key: "departureAirport",
    },
    {
      title: "Arrival Airport",
      dataIndex: "arrivalAirport",
      key: "arrivalAirport",
    },
    {
      title: "Hidden/Show",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <span>
          <Form.Item valuePropName="checked">
            <Switch
              checked={record.status}
              onChange={() => handleStatusChange(record.key)}
            />
          </Form.Item>
        </span>
      ),
    },
    {
      title: "Option",
      key: "option",
      render: (_, record) => (
        <span>
          <Tooltip title="Edit">
            <Button type="default" shape="circle" icon={<EditOutlined />} />
          </Tooltip>
          |
          <Tooltip title="Search">
            <Button
              type="default"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
        </span>
      ),
    },
  ]
  const location = useLocation()
  const newPath = `${location.pathname}/create`
  const [data, setData] = useState([])
  const [dataSeat, setDataSeat] = useState([])
  const [flightInfo, setFlightInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openUser, setOpenUser] = useState(false)
  const [ticketId, setTicketId] = useState(null)
  const [detailTicket, setDetailTicket] = useState(null)
  const [reload, setReload] = useState(false)
  const [codeSearch, setCodeSearch] = useState("")
  const fetchFlight = async () => {
    setLoading(true)
    try {
      const response = await getAllFlights()
      if (response) {
        const tableData = response.map((flight, index) => ({
          key: flight.id,
          stt: index + 1,
          code: flight.codeFlight,
          airline: flight.airline,
          departureTime: new Date(flight.departureTime).toUTCString(),
          arrivalTime: new Date(flight.arrivalTime).toUTCString(),
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          status: flight.status,
        }))
        setData(tableData)
      }
    } catch (error) {
      message.error("Failed to fetch airlines!")
    } finally {
      setLoading(false)
    }
  }
  const fetchFlightByCode = async () => {
    try {
      const response = await searchByCode(codeSearch)
      console.log(response)
      if (response) {
        const tableData = response.map((flight, index) => ({
          key: flight.id,
          stt: index + 1,
          code: flight.codeFlight,
          airline: flight.airline,
          departureTime: new Date(flight.departureTime).toUTCString(),
          arrivalTime: new Date(flight.arrivalTime).toUTCString(),
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          status: flight.status,
        }))
        setData(tableData)
      }
    } catch (error) {
      message.error("Failed to fetch airlines!")
    } finally {
      setLoading(false)
    }
  }
  const fetchTicket = async () => {
    try {
      const response = await getTicketById(ticketId)
      if (response.ok) {
        const result = await response.json()
        console.log(result)

        setDetailTicket(result)
      }
    } catch (error) {
      message.error("Failed to fetch airlines!")
    }
  }
  useEffect(() => {
    fetchFlightByCode()
  }, [codeSearch])
  useEffect(() => {
    fetchTicket()
  }, [ticketId])
  useEffect(() => {
    fetchFlight()
  }, [reload])
  if (loading) return <Loading />
  const handleStatusChange = (id) => {
    const fetchStatus = async () => {
      try {
        const response = await setStatusFlight(id)
        if (response.ok) {
          const result = await response.text()
          console.log(result)
          message.success(result)
          setReload((prev) => !prev)
        }
      } catch (error) {
        message.error("Failed to fetch!")
      }
    }
    fetchStatus()
  }
  const handleSearch = (record) => {
    console.log(record)
  }

  const showModal = (record) => {
    const fetchFlight = async () => {
      setLoading(true)
      try {
        const response = await getFlightById(record.key)
        console.log(response)
        if (response) {
          console.log(response)

          setFlightInfo({
            code: response.codeFlight,
            airline: response.airline,
            departureTime: new Date(response.departureTime).toUTCString(),
            arrivalTime: new Date(response.arrivalTime).toUTCString(),
            departureAirport: response.departureAirport,
            arrivalAirport: response.arrivalAirport,
            busPrice: response.busPrice.toLocaleString() + " VND",
            ecoPrice: response.ecoPrice.toLocaleString() + " VND",
            busClass: response.plane.busClass,
            ecoClass: response.plane.ecoClass,
            planeName: response.plane.name,
            logoAirline: response.logoAirline,
          })
          setDataSeat(response.seats)
          console.log(flightInfo)
        }
      } catch (error) {
        message.error("Failed to fetch airlines!")
      } finally {
        setLoading(false)
      }
    }
    fetchFlight()
    setOpen(true)
  }
  const handleCancel = () => {
    setOpen(false)
  }
  const showDrawer = (ticketId) => {
    setOpenUser(true)
  }

  const handleSetIdTicket = (seatId) => {
    console.log(seatId)
    setTicketId(seatId)
    showDrawer()
  }
  const onClose = () => {
    setOpenUser(false)
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1>Flight Information</h1>
        <Link to={newPath}>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Flight
          </Button>
        </Link>
      </div>
      <div className="d-flex justify-content-end pb-4">
        <Search
          placeholder="Search by flight code!"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => setCodeSearch(e.target.value)}
          style={{
            width: 500,
          }}
        />
      </div>
      <Table columns={columns} dataSource={data} />;
      <Modal
        open={open}
        title="Flight Information"
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
        width={1200}
      >
        <div className="d-flex">
          <div className="col-6">
            {flightInfo && (
              <Card
                title={`Chuyến bay ${flightInfo.code}`}
                bordered={false}
                style={{
                  width: "100%",
                  boxShadow: "none",
                }}
              >
                <div className="d-flex justify-content-center align-items-center pb-5">
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={flightInfo.logoAirline}
                    alt="Logo Airline"
                  />
                </div>
                <div className="d-flex justify-content-between px-5">
                  <p>Hãng máy bay: {flightInfo.airline}</p>
                  <p>Tên máy bay: {flightInfo.planeName}</p>
                </div>
                <div className="d-flex justify-content-between px-5">
                  <p>Sân bay đi: {flightInfo.departureAirport}</p>
                  <p>Thời gian đi: {flightInfo.departureTime}</p>
                </div>
                <div className="d-flex justify-content-between px-5">
                  <p>Sân bay đến: {flightInfo.arrivalAirport}</p>
                  <p>Thời gian đến: {flightInfo.arrivalTime}</p>
                </div>
                <div className="d-flex justify-content-between px-5">
                  <p>Giá vé thường: {flightInfo.ecoPrice}</p>
                  <p>Giá vé thương gia: {flightInfo.busPrice}</p>
                </div>
                <div className="d-flex justify-content-between px-5">
                  <p>Số ghế thường: {flightInfo.ecoClass} ghế</p>
                  <p>Số ghế thương gia: {flightInfo.busClass} ghế</p>
                </div>
              </Card>
            )}
          </div>
          <div className="col-6">
            <List
              itemLayout="vertical"
              size="small"
              pagination={{
                onChange: (page) => {
                  console.log(page)
                },
                pageSize: 5,
              }}
              dataSource={dataSeat}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={
                      <>
                        Tên ghế: {item.seatNumber} / Thuộc loại:{" "}
                        {item.seatClass} <br />
                        Trạng thái:{" "}
                        <span
                          className={`badge ${
                            !item.available ? "bg-success" : "bg-danger"
                          } rounded-pill`}
                        >
                          {!item.available ? "Đã đặt" : "Đang trống"}
                        </span>
                        {!item.available ? (
                          <Button
                            type="default"
                            style={{ margin: "0 5px" }}
                            shape="circle"
                            icon={<SearchOutlined />}
                            onClick={() => handleSetIdTicket(item.id)}
                          />
                        ) : (
                          ""
                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
      <Drawer title="Thông tin người đặt vé" onClose={onClose} open={openUser}>
        {detailTicket && (
          <>
            <p>Tên: {detailTicket.clientName}</p>
            <p>Email: {detailTicket.clientEmail}</p>
            <p>Phone: {detailTicket.clientPhone}</p>
            <p>Ngày đặt: {detailTicket.createAt}</p>
            <p>Luggage Type: {detailTicket.luggageType}</p>
            <p>
              Ticket Price:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(detailTicket.ticketPrice)}
            </p>
          </>
        )}
      </Drawer>
    </div>
  )
}
