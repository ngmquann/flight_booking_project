import React from "react"
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
} from "@ant-design/icons"
import { Menu, Layout } from "antd"
import { useNavigate } from "react-router-dom"

const { Sider } = Layout

function getItem(label, key, icon, children) {
  return { key, icon, children, label }
}

const items = [
  getItem("Quản lý Doanh thu", "/dashboard", <DesktopOutlined />),
  getItem("Quản lý máy bay", "/plane", <DesktopOutlined />),
  getItem("Quản lý sân bay", "/airport", <DesktopOutlined />),
  getItem("Quản lý hãng máy bay", "/airline", <FileOutlined />),
  getItem("Quản lý chuyến bay", "/flight", <PieChartOutlined />),
]

const SidebarComponent = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate()

  const handleMenuClick = ({ key }) => {
    navigate(`/admin${key}`)
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div class="demo-logo">
        <img
          src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/9/97f3e7a54e9c6987283b78e016664776.svg"
          style={{ width: "50px" }}
        />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["/admin/flight"]}
        onClick={handleMenuClick}
        mode="inline"
        items={items}
      />
    </Sider>
  )
}

export default SidebarComponent
