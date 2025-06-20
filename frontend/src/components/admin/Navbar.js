import React, { useEffect, useState } from "react"
import { Button, Layout, theme } from "antd"
import { jwtDecode } from "jwt-decode"
import { Link, NavLink } from "react-router-dom"

const { Header } = Layout

const Navbar = () => {
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
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Header
      style={{
        padding: "0 20px",
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "25px" }}>
        Welcome to your website administration!
      </div>

      <div style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-user"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Hi, {fullName}</span>

        <Button type="primary" danger shape="circle" onClick={handleLogout}>
          Exit
        </Button>
      </div>
    </Header>
  )
}

export default Navbar
