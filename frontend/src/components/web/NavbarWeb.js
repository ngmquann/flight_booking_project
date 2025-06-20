import { DatePicker, Layout, Menu } from "antd"
import { Header } from "antd/es/layout/layout"
import React, { useEffect, useState } from "react"
import { Button, Modal, Checkbox, Form, Input, Flex } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { login, register } from "../../api/UserApi"
import Loading from "../../util/Loading"
import { jwtDecode } from "jwt-decode"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { NavLink } from "react-router-dom"
dayjs.extend(customParseFormat)

const items1 = ["Chuyến bay", "Săn vé rẻ", "Blog du lịch"].map(
  (key, index) => ({
    key: index,
    label: key,
  })
)

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf("day")
}

export default function NavbarWeb() {
  const [open, setOpen] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const token = localStorage.getItem("jwtToken")
  const [fullName, setFullName] = useState("")
  useEffect(() => {
    if (token && typeof token === "string") {
      const userData = jwtDecode(token)
      console.log(userData)
      if (userData && userData.fullName) {
        setFullName(userData.fullName)
      }
    }
  }, [])
  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    setTimeout(() => {
      window.location.href = "/"
    }, 1000)
  }
  const showModalRegister = () => {
    setOpenRegister(true)
  }
  const showModal = () => {
    setOpen(true)
  }
  const handleOk = (e) => {
    setOpen(false)
  }
  const handleOkRegister = (e) => {
    setOpenRegister(false)
  }
  const handleCancel = (e) => {
    setOpen(false)
  }
  const handleCancelRegister = (e) => {
    setOpenRegister(false)
  }
  const onFinish = async (values) => {
    const data = {
      email: values.username,
      password: values.password,
    }
    try {
      const result = await login(data)
      if (result) {
        const token = localStorage.getItem("jwtToken")
        if (token) {
          const userData = jwtDecode(token)
          if (userData && userData.role) {
            console.log(userData.role)
            if (userData.role === "ADMIN" || userData.role === "STAFF") {
              setTimeout(() => {
                window.location.href = "/admin/dashboard"
              }, 2000)
            } else {
              setTimeout(() => {
                window.location.href = "/"
              }, 2000)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const onRegisterFinish = async (values) => {
    const dob = new Date(values.dob)
    const formatDate = [
      ("0" + dob.getDate()).slice(-2),
      ("0" + (dob.getMonth() + 1)).slice(-2),
      dob.getFullYear(),
    ].join("-")
    const data = {
      email: values.email,
      password: values.password,
      address: values.address,
      phoneNumber: values.phone,
      fullName: values.name,
      dateOfBirth: formatDate,
    }
    try {
      await register(data)
      setOpenRegister(false)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo">
          <NavLink to={"/"}>
            <img
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/9/97f3e7a54e9c6987283b78e016664776.svg"
              style={{ width: 150 }}
            />
          </NavLink>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        <div>
          {fullName ? (
            <div
              style={{
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <NavLink
                to={"/profile"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-user"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span style={{ color: "white" }}>Hi, {fullName}</span>
              </NavLink>
              <Button
                type="primary"
                danger
                shape="circle"
                onClick={handleLogout}
              >
                Exit
              </Button>
            </div>
          ) : (
            <>
              <Button type="primary" onClick={showModal}>
                Đăng nhập
              </Button>
              <Button type="primary" onClick={showModalRegister}>
                Đăng ký
              </Button>
            </>
          )}
          <Modal
            title="Đăng nhập ngay!"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            centered
          >
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              style={{
                maxWidth: "100%",
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="">Forgot password</a>
                </Flex>
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
                or <a href="">Register now!</a>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Đăng ký ngay!"
            open={openRegister}
            onOk={handleOkRegister}
            onCancel={handleCancelRegister}
            footer={null}
            centered
          >
            <Form
              layout="vertical"
              name="register"
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onRegisterFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Full name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error("The password that you entered do not match!")
                      )
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Date of birth"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "Please select your DOB!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                  // format="DD/MM/YYYY"
                />
              </Form.Item>
              <Form.Item
                label={null}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button onClick={handleCancelRegister}>Cancel</Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ marginLeft: "8px" }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Header>
    </div>
  )
}
