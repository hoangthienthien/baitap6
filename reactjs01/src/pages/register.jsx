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
        <Row justify="center" align="middle" className="min-h-screen bg-[#f8fafc]">
            <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                <Card
                    style={{
                        borderRadius: 16,
                        boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
                        border: '1px solid #f1f5f9'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3} style={{ marginBottom: 4, fontWeight: 800, tracking: '-0.025em' }}>Register</Title>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>Tạo tài khoản mới để sử dụng hệ thống</Text>
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
                                prefix={<UserOutlined className="text-slate-400" />}
                                placeholder="Nguyễn Văn A"
                                style={{ borderRadius: 8, fontSize: 13 }}
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
                                prefix={<MailOutlined className="text-slate-400" />}
                                placeholder="your@email.com"
                                style={{ borderRadius: 8, fontSize: 13 }}
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
                                prefix={<LockOutlined className="text-slate-400" />}
                                placeholder="Tối thiểu 6 ký tự"
                                style={{ borderRadius: 8, fontSize: 13 }}
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
                                prefix={<LockOutlined className="text-slate-400" />}
                                placeholder="Nhập lại mật khẩu"
                                style={{ borderRadius: 8, fontSize: 13 }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} style={{ borderRadius: 8, background: '#2563eb', border: 'none', height: 42, fontSize: 13, fontWeight: 700 }}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>
                        <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>Hoặc</Text>
                    </Divider>

                    <div style={{ textAlign: 'center', fontSize: 12 }}>
                        <Text type="secondary" style={{ fontWeight: 600 }}>Đã có tài khoản? </Text>
                        <Link to="/login" style={{ fontWeight: 700, color: '#2563eb' }}>Đăng nhập ngay</Link>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;
