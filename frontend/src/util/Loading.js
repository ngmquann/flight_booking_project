import React from 'react';
import { Spin, Row, Col } from 'antd';

export default function Loading() {
  return (
    <div className='loading-container'>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
            <Spin size="large" className='loading-spin' />
            <Spin size="large" className='loading-spin' />
            <Spin size="large" className='loading-spin' />
        </Col>
      </Row>
    </div>
  );
}
