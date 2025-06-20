import { Footer } from "antd/es/layout/layout"
import React from "react"
import "./footer.css"
import {
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons"

export default function FooterWeb() {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      <div className="footer-container">
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <ul>
            <li>
              <a href="/#">Trung tâm hỗ trợ</a>
            </li>
            <li>
              <a href="/#">Quy định chung</a>
            </li>
            <li>
              <a href="/#">Điều khoản sử dụng</a>
            </li>
            <li>
              <a href="/#">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="/#">Góp ý và báo lỗi</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Khám phá thêm</h3>
          <ul>
            <li>
              <a href="/#">Đặt vé máy bay</a>
            </li>
            <li>
              <a href="/#">Ưu đãi theo mùa và dịp lễ</a>
            </li>
            <li>
              <a href="/#">Bài viết về du lịch</a>
            </li>
            <li>
              <a href="/#">Traveller Review Awards</a>
            </li>
            <li>
              <a href="/#">Tìm chuyến bay</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Điều khoản và cài đặt</h3>
          <ul>
            <li>
              <a href="/#">Bảo mật & Cookie</a>
            </li>
            <li>
              <a href="/#">Điều khoản và điều kiện</a>
            </li>
            <li>
              <a href="/#">Tranh chấp đối tác</a>
            </li>
            <li>
              <a href="/#">Chính sách chống Nô lệ Hiện đại</a>
            </li>
            <li>
              <a href="/#">Chính sách về Quyền con người</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Hỗ trợ khách hàng</h3>
          <ul>
            <li>
              <PhoneOutlined /> 1900-2642
            </li>
            <li>
              <MailOutlined /> info@kqn.vn
            </li>
            <li style={{ display: "flex", justifyContent: "space-evenly" }}>
              <a href="/#">
                <FacebookOutlined />
              </a>
              <a href="/#">
                <InstagramOutlined />
              </a>
              <a href="/#">
                <TwitterOutlined />
              </a>
              <a href="/#">
                <YoutubeOutlined />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="footer-line" />
      KQN Company ©{new Date().getFullYear()}
    </Footer>
  )
}
