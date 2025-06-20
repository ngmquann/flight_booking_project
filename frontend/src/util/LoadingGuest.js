import { LoadingOutlined } from "@ant-design/icons"
import { Col, Row, Spin } from "antd"
import React from "react"

export default function LoadingGuest() {
  return (
    <div className="loading-container">
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Col>
      </Row>
    </div>
  )
}
