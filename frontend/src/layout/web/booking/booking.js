import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Result,
  Row,
  Steps,
} from "antd"
import React, { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { getFlightById } from "../../../api/FlightApi"
import dayjs from "dayjs"
import LoadingGuest from "../../../util/LoadingGuest"
import { payment } from "../../../api/PaymentApi"
import { openNotification } from "../../../util/NotificationRight"
import { getDataByUser } from "../../../api/UserApi"

export default function Booking() {
  const location = useLocation()
  const [componentDisabled, setComponentDisabled] = useState(false)
  const flightData = location.state?.flight
  const selectedLuggage = location.state?.luggage
  const seatClass = location.state?.seatClass
  const totalPrice = location.state?.totalPrice
  const [flightChecked, setFlightChecked] = useState(flightData)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(1)
  const queryParams = new URLSearchParams(location.search)
  const info = queryParams.has("info") ? queryParams.get("info") : null
  console.log(info)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (info === "success" || info === "failed") {
      setCurrent(2)
    }
  }, [info])
  useEffect(() => {
    fetchDataUser()
  }, [])
  const fetchDataUser = async () => {
    try {
      const response = await getDataByUser()
      if (response.ok) {
        const result = await response.json()
        console.log(result)
        setFullName(result.fullName)
        setPhoneNumber(result.phoneNumber)
        setEmail(result.email)
      }
    } catch (error) {
      message.error("Có lỗi xảy ra")
    }
  }
  const navigate = useNavigate()

  const handleNextPayment = () => {
    const bookingData = {
      name: fullName,
      email: email,
      phone: phoneNumber,
      flightId: flightChecked.id,
      luggageId: selectedLuggage,
      seatCLass: seatClass,
    }
    if (fullName === "" || email === "" || phoneNumber === "") {
      message.error("Cần điền đủ thông tin người đặt vé")
      return
    }
    console.log("Dữ liệu gửi đi:", bookingData)
    const fetchDataPayment = async (bookingData) => {
      try {
        const response = await payment(bookingData)
        const paymentUrl = await response.text()

        if (response.ok) {
          console.log("Redirecting to:", paymentUrl)
          window.location.href = paymentUrl
        }
      } catch (error) {
        openNotification({
          type: "error",
          message: "Bạn phải đăng nhập trước!",
          description: "Vui lòng đăng nhập để được đặt vé",
        })
      }
    }
    fetchDataPayment(bookingData)
  }

  if (loading) return <LoadingGuest />
  return (
    <div>
      <div class="container">
        <Steps
          size="small"
          current={current}
          items={[
            {
              title: "Chi tiết chuyến đi của bạn",
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
        {current === 1 && flightChecked && (
          <div class="row">
            <div class="col-md-6">
              <Card
                bordered
                style={{
                  borderRadius: "10px",
                  margin: "10px 0",
                }}
              >
                <h3 style={{ fontSize: "18px" }}>
                  Thông tin liên hệ (nhận vé/phiếu thanh toán)
                </h3>
                <div>
                  <Form
                    labelCol={{
                      span: 4,
                    }}
                    wrapperCol={{
                      span: 14,
                    }}
                    layout="horizontal"
                    disabled={componentDisabled}
                    style={{
                      maxWidth: 600,
                      textAlign: "left",
                    }}
                  >
                    <Form.Item label="Họ và tên">
                      <Input
                        style={{ padding: "8px" }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item label="Số điện thoại">
                      <Input
                        style={{
                          padding: "8px",
                        }}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item label="Email">
                      <Input
                        style={{ padding: "8px" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Card>
            </div>
            <div class="col-md-6">
              <Card
                bordered
                style={{
                  borderRadius: "10px",
                  margin: "10px 0",
                }}
              >
                <h3 style={{ fontSize: "16px" }}> Tóm tắt chuyến bay</h3>
                <Row
                  align="middle"
                  style={{
                    paddingBottom: "15px",
                  }}
                >
                  <Col span={4} style={{ textAlign: "center" }}>
                    <img
                      src={flightChecked?.logoAirline}
                      alt={flightChecked?.airline}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Col>
                  <Col span={20}>
                    <h3 className="text-start">{flightChecked.name}</h3>
                    <Row>
                      <Col span={8}>
                        <div>
                          {dayjs(flightChecked.departureTime)
                            .utc()
                            .format("HH:mm")}
                        </div>
                        <div style={{ color: "gray" }}>
                          {flightChecked.departureLocation}(
                          {flightChecked.codeDepartAirport})<br></br>
                          {dayjs(flightChecked.departureTime)
                            .locale("vi")
                            .format("ddd, D MMM YYYY")}
                        </div>
                      </Col>
                      <Col span={8} style={{ textAlign: "center" }}>
                        <div>
                          {(() => {
                            const departure = dayjs(
                              flightChecked.departureTime
                            ).utc()
                            const arrival = dayjs(
                              flightChecked.arrivalTime
                            ).utc()
                            const duration = arrival.diff(departure, "minute")
                            const hours = Math.floor(duration / 60)
                            const minutes = duration % 60
                            return `${hours}h ${minutes}m`
                          })()}
                        </div>
                        <div className="process-flight"></div>
                        <div style={{ fontSize: "12px", color: "gray" }}>
                          Bay thẳng
                        </div>
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        <div>
                          {dayjs(flightChecked.arrivalTime)
                            .utc()
                            .format("HH:mm")}
                        </div>
                        <div style={{ color: "gray" }}>
                          {flightChecked.arrivalLocation} (
                          {flightChecked.codeArriAirport})<br></br>
                          {dayjs(flightChecked.arrivalTime)
                            .locale("vi")
                            .format("ddd, D MMM YYYY")}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row
                  align="middle"
                  style={{
                    paddingTop: "4px",
                    borderTop: "1px solid rgb(205, 208, 209)",
                  }}
                >
                  <Col span={4} style={{ textAlign: "center" }}>
                    <img
                      src="https://tse3.mm.bing.net/th?id=OIP.kklIaX3TV97u5KnjU_Kr4wHaHa&pid=Api&P=0&h=180"
                      alt="Vn pay"
                      style={{ width: "60px", height: "auto" }}
                    />
                  </Col>
                  <Col span={20}>
                    <h3 className="text-start">{flightChecked.name}</h3>
                    <Row>
                      <Col span={12}>
                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: "600",
                            paddingLeft: "20px",
                            textAlign: "left",
                          }}
                        >
                          Thanh toán bằng
                        </div>
                      </Col>
                      <Col span={12} style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "20px",
                            color: "rgb(255, 94, 31)",
                            fontWeight: "bold",
                          }}
                        >
                          {totalPrice.toLocaleString("vi-VN")} VND
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        )}
        {info === "success" && (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle="Kiểm tra gmail để biết rõ về thông tin chuyến bay của bạn"
            extra={[
              <Button type="primary" key="console">
                Vé của tôi
              </Button>,
              <Button key="buy" onClick={() => navigate("/")}>
                Đặt vé tiếp
              </Button>,
            ]}
          />
        )}
        {current === 2 && info === "failed" && (
          <Result
            status="error"
            title="Thanh toán lỗi"
            subTitle="Kiểm tra thêm thông để biết rõ về nguyên nhân lỗi chuyến bay của bạn"
            extra={[
              <Button key="buy" onClick={() => navigate("/")}>
                Quay về trang đặt vé
              </Button>,
            ]}
          />
        )}
        {!info && (
          <div>
            <Button
              type="primary"
              size="large"
              onClick={() => handleNextPayment()}
            >
              Tiếp theo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
