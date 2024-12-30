import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

export const HomeFooter: React.FC = () => (
  <Footer style={{ background: '#0388B4', padding: '50px 50px', boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)', color: 'white' }}>
    <Row justify="space-between" gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <Title level={4} style={{ color: 'white' }}>Contact</Title>
        <Text style={{ color: 'white' }}>123 Street Name, City, Country</Text><br/>
        <Text style={{ color: 'white' }}>Phone: (123) 456-7890</Text><br/>
        <Text style={{ color: 'white' }}>Email: contact@example.com</Text><br/>
        <div style={{ marginTop: '10px' }}>
          <Link href="https://www.facebook.com" target="_blank"><FacebookOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} /></Link>
          <Link href="https://www.twitter.com" target="_blank"><TwitterOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} /></Link>
          <Link href="https://www.linkedin.com" target="_blank"><LinkedinOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} /></Link>
          <Link href="https://www.instagram.com" target="_blank"><InstagramOutlined style={{ fontSize: '24px', color: 'white' }} /></Link>
        </div>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Title level={4} style={{ color: 'white' }}>Quick Links</Title>
        <Link href="#" style={{ display: 'block', color: 'white', marginBottom: '10px' }}>Home</Link>
        <Link href="#" style={{ display: 'block', color: 'white', marginBottom: '10px' }}>About Us</Link>
        <Link href="#" style={{ display: 'block', color: 'white', marginBottom: '10px' }}>Services</Link>
      </Col>
    </Row>
    <Row justify="center" style={{ marginTop: '30px' }}>
      <Text style={{ color: 'white' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Text>
    </Row>
  </Footer>
);

export default HomeFooter;
