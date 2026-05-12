import React, { useContext, useState } from 'react';
import { Button, Form, Input, notification, Typography, Divider, Row, Col, Card } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';

const { Title, Text } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
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
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                <Card
                    style={{
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2} style={{ marginBottom: 4 }}>Đăng nhập</Title>
                        <Text type="secondary">Nhập thông tin tài khoản để tiếp tục</Text>
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
                                prefix={<MailOutlined />}
                                placeholder="your@email.com"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'right', marginBottom: 8 }}>
                            <Link to="/forgot-password">Quên mật khẩu?</Link>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>
                        <Text type="secondary">Hoặc</Text>
                    </Divider>

                    <div style={{ textAlign: 'center' }}>
                        <Text>Chưa có tài khoản? </Text>
                        <Link to="/register">Đăng ký ngay</Link>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;
