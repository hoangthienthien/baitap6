import React, { useContext, useState } from 'react';
import { Button, Form, Input, notification, Typography, Divider, Row, Col, Card } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';
import { CartContext } from '../components/context/cart.context';

const { Title, Text } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const { fetchCart } = useContext(CartContext);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { email, password } = values;
        setLoading(true);
        const res = await loginApi(email, password);
        if (res.EC === 0) {
            localStorage.setItem("access_token", res.access_token);
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? ""
                }
            });
            fetchCart();
            notification.success({
                message: "Đăng nhập thành công",
                description: "Chào mừng bạn quay trở lại!"
            });
            navigate("/");
        } else {
            notification.error({
                message: "Đăng nhập thất bại",
                description: res?.EM ?? "Có lỗi xảy ra"
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
                        <Title level={3} style={{ marginBottom: 4, fontWeight: 800, tracking: '-0.025em' }}>Sign In</Title>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>Nhập thông tin tài khoản để tiếp tục</Text>
                    </div>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
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
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-slate-400" />}
                                placeholder="Nhập mật khẩu"
                                style={{ borderRadius: 8, fontSize: 13 }}
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'right', marginBottom: 12 }}>
                            <Link to="/forgot-password" style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>Quên mật khẩu?</Link>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} style={{ borderRadius: 8, background: '#2563eb', border: 'none', height: 42, fontSize: 13, fontWeight: 700 }}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>
                        <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>Hoặc</Text>
                    </Divider>

                    <div style={{ textAlign: 'center', fontSize: 12 }}>
                        <Text type="secondary" style={{ fontWeight: 600 }}>Chưa có tài khoản? </Text>
                        <Link to="/register" style={{ fontWeight: 700, color: '#2563eb' }}>Đăng ký ngay</Link>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;
