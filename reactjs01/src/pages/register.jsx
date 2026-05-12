import React, { useState } from 'react';
import { Button, Form, Input, notification, Typography, Divider, Row, Col, Card } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { createUserApi } from '../util/api';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { name, email, password } = values;
        setLoading(true);
        const res = await createUserApi(name, email, password);
        if (res) {
            notification.success({
                message: "Đăng ký thành công",
                description: "Tài khoản đã được tạo. Vui lòng đăng nhập!"
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Đăng ký thất bại",
                description: "Email đã tồn tại hoặc có lỗi xảy ra!"
            });
        }
        setLoading(false);
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                <Card
                    style={{
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2} style={{ marginBottom: 4 }}>Đăng ký tài khoản</Title>
                        <Text type="secondary">Tạo tài khoản mới để sử dụng hệ thống</Text>
                    </div>

                    <Form
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nguyễn Văn A"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="your@email.com"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Tối thiểu 6 ký tự"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập lại mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>
                        <Text type="secondary">Hoặc</Text>
                    </Divider>

                    <div style={{ textAlign: 'center' }}>
                        <Text>Đã có tài khoản? </Text>
                        <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;
