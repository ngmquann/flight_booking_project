import { AppstoreOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Menu, message, Row } from "antd"
import React, { useEffect, useState } from "react"
import {
  getDataByUser,
  uploadDataByUser,
  uploadPassWordUser,
} from "../../../api/UserApi"
import dayjs from "dayjs"
import { openNotification } from "../../../util/NotificationRight"

const items = [
  {
    key: "5",
    label: "Cập nhật thông tin",
  },
  {
    key: "6",
    label: "Vé của tôi",
  },
  {
    key: "7",
    label: "Thay đổi mật khẩu",
  },
]
export default function Profile() {
  const [form] = Form.useForm()
  const [selectedKey, setSelectedKey] = useState("5")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState("")
  const [address, setAddress] = useState("")
  const [ticketList, setTicketList] = useState([])
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const handleMenuClick = (e) => {
    setSelectedKey(e.key)
  }
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
        setDob(result.dateOfBirth)
        setAddress(result.address)
        console.log(result.bookingList)
        setTicketList(result.bookingList)
      }
    } catch (error) {
      message.error("Có lỗi xảy ra")
    }
  }
  const handleSubmit = () => {
    const formattedDob = dob.split("-").reverse().join("-")
    const data = {
      fullName,
      email,
      phoneNumber,
      address,
      dateOfBirth: formattedDob,
    }
    console.log(data)
    const fetchUploadProfile = async (data) => {
      try {
        const response = await uploadDataByUser(data)
        if (response.ok) {
          const message = await response.text()
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật thông tin thành công!",
          })
        }
      } catch (error) {
        openNotification({
          type: "error",
          message: "Lỗi",
          description: "Đã có lỗi xảy ra!",
        })
      }
    }
    fetchUploadProfile(data)
  }
  const handleChangePassWord = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      message.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    if (newPassword.length < 6) {
      message.error("Mật khẩu mới phải có ít nhất 6 ký tự!")
      return
    }

    if (newPassword !== confirmNewPassword) {
      message.error("Mật khẩu nhập lại không khớp!")
      return
    }
    const fetchUploadPassword = async (oldPass, newPass) => {
      try {
        const response = await uploadPassWordUser(oldPass, newPass)
        if (response.ok) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật mật khẩu thành công!",
          })
        }
      } catch (error) {
        openNotification({
          type: "error",
          message: "Mật khẩu không đúng",
          description: "Đã có lỗi xảy ra!",
        })
      }
    }
    fetchUploadPassword(oldPassword, newPassword)
  }
  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="row">
        <div className="col-md-4">
          <Card
            bordered
            style={{
              borderRadius: "10px",
              margin: "10px 0",
            }}
          >
            <h3 style={{ fontSize: "18px", paddingBottom: "20px" }}>
              Tùy chọn
            </h3>
            <Menu
              onClick={handleMenuClick}
              style={{
                width: 256,
                textAlign: "left",
              }}
              defaultSelectedKeys={["5"]}
              mode="inline"
              items={items}
            />
          </Card>
        </div>
        {selectedKey === "5" && (
          <div className="col-md-8">
            <Card
              bordered
              style={{
                borderRadius: "10px",
                margin: "10px 0",
                width: "600px",
              }}
            >
              <h3 style={{ fontSize: "18px", paddingBottom: "20px" }}>
                Cập nhật thông tin
              </h3>
              <Form
                layout="horizontal"
                initialValues={{ layout: "horizontal" }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
              >
                <Form.Item label="Họ và tên" style={{ marginBottom: "16px" }}>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  style={{ marginBottom: "16px" }}
                >
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>

                <Form.Item label="Email" style={{ marginBottom: "16px" }}>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                  />
                </Form.Item>

                <Form.Item label="Ngày sinh" style={{ marginBottom: "16px" }}>
                  <Input
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="Nhập ngày sinh"
                  />
                </Form.Item>

                <Form.Item label="Địa chỉ" style={{ marginBottom: "16px" }}>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                  />
                </Form.Item>

                <Form.Item
                  wrapperCol={{ span: 24 }}
                  style={{ textAlign: "center" }}
                >
                  <Button type="primary" onClick={handleSubmit}>
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        )}
        {selectedKey === "6" && (
          <div className="col-md-8">
            <h3 style={{ fontSize: "18px", paddingBottom: "20px" }}>
              Danh sách vé
            </h3>
            <div
              style={{
                height: "500px",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: "10px",
              }}
              className="custom-scrollbar"
            >
              {ticketList.map((item, index) => (
                <Card
                  bordered
                  style={{
                    borderRadius: "10px",
                    margin: "10px 0",
                    width: "600px",
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
                      <h3 style={{ fontSize: "18px", color: "#4096ff" }}>
                        {item.seatNumber}
                      </h3>
                      <h3
                        style={{ fontSize: "16px", color: "rgb(255, 94, 31)" }}
                      >
                        {item.flightCode}
                      </h3>
                    </Col>
                    <Col span={20}>
                      <h3 className="text-start">{item.name}</h3>
                      <Row>
                        <Col span={8}>
                          <div>
                            {dayjs(item.departureTime).utc().format("HH:mm")}
                          </div>
                          <div style={{ color: "gray" }}>
                            {item.departureAirportName}
                            <br></br>
                            {dayjs(item.departureTime)
                              .locale("vi")
                              .format("ddd, D MMM YYYY")}
                          </div>
                        </Col>
                        <Col span={8} style={{ textAlign: "center" }}>
                          <div>
                            {(() => {
                              const departure = dayjs(item.departureTime).utc()
                              const arrival = dayjs(item.arrivalTime).utc()
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
                            {dayjs(item.arrivalTime).utc().format("HH:mm")}
                          </div>
                          <div style={{ color: "gray" }}>
                            {item.arrivalAirportName}
                            <br></br>
                            {dayjs(item.arrivalTime)
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
                      <span>{item.airlineName}</span>
                    </Col>
                    <Col span={20}>
                      <Row>
                        <Col span={12}>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              paddingLeft: "20px",
                              textAlign: "left",
                            }}
                          >
                            Tổng tiền
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
                            {item.price.toLocaleString("vi-VN")} VND
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </div>
        )}
        {selectedKey === "7" && (
          <div className="col-md-8">
            <Card
              bordered
              style={{
                borderRadius: "10px",
                margin: "10px 0",
                width: "600px",
              }}
            >
              <h3 style={{ fontSize: "18px", paddingBottom: "20px" }}>
                Thay đổi mật khẩu
              </h3>
              <Form
                layout="horizontal"
                form={form}
                initialValues={{ layout: "horizontal" }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item label="Mật khẩu cũ" style={{ marginBottom: "16px" }}>
                  <Input.Password
                    placeholder="Nhập mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu mới"
                  style={{ marginBottom: "16px" }}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  style={{ marginBottom: "16px" }}
                >
                  <Input.Password
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  wrapperCol={{ span: 24 }}
                  style={{ textAlign: "center" }}
                >
                  <Button type="primary" onClick={handleChangePassWord}>
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
