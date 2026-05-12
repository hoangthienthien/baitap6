import React, { useState } from 'react';
import { Button, Form, Input, notification, Typography, Row, Col, Card, Steps, Result } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from '../util/axios.customize';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    // Step 1: Gửi email để nhận mã xác nhận
    const onSendEmail = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post('/v1/api/forgot-password', { email: values.email });
            if (res && res.EC === 0) {
                setEmail(values.email);
                notification.success({
                    message: "Thành công",
                    description: "Mã xác nhận đã được gửi đến email của bạn (kiểm tra console server)."
                });
                setCurrentStep(1);
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res?.EM ?? "Email không tồn tại trong hệ thống!"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra, vui lòng thử lại!"
            });
        }
        setLoading(false);
    };

    // Step 2: Xác nhận mã và đặt mật khẩu mới
    const onResetPassword = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post('/v1/api/reset-password', {
                email: email,
                code: values.code,
                newPassword: values.newPassword
            });
            if (res && res.EC === 0) {
                notification.success({
                    message: "Đặt lại mật khẩu thành công",
                    description: "Bạn có thể đăng nhập với mật khẩu mới!"
                });
                setCurrentStep(2);
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res?.EM ?? "Mã xác nhận không đúng hoặc đã hết hạn!"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra, vui lòng thử lại!"
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
                        <Title level={2} style={{ marginBottom: 4 }}>Quên mật khẩu</Title>
                        <Text type="secondary">Khôi phục mật khẩu tài khoản của bạn</Text>
                    </div>

                    <Steps
                        current={currentStep}
                        size="small"
                        style={{ marginBottom: 24 }}
                        items={[
                            { title: 'Nhập Email' },
                            { title: 'Đặt lại' },
                            { title: 'Hoàn tất' },
                        ]}
                    />

                    {/* Step 1: Nhập email */}
                    {currentStep === 0 && (
                        <Form
                            name="forgot-password"
                            onFinish={onSendEmail}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                name="email"
                                label="Email đã đăng ký"
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Gửi mã xác nhận
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {/* Step 2: Nhập mã xác nhận + mật khẩu mới */}
                    {currentStep === 1 && (
                        <Form
                            name="reset-password"
                            onFinish={onResetPassword}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                name="code"
                                label="Mã xác nhận"
                                rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
                            >
                                <Input
                                    prefix={<SafetyOutlined />}
                                    placeholder="Nhập mã 6 số"
                                />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                label="Mật khẩu mới"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
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
                                label="Xác nhận mật khẩu mới"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {/* Step 3: Hoàn tất */}
                    {currentStep === 2 && (
                        <Result
                            status="success"
                            title="Đặt lại mật khẩu thành công!"
                            subTitle="Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ."
                            extra={[
                                <Link to="/login" key="login">
                                    <Button type="primary" size="large">
                                        Đăng nhập ngay
                                    </Button>
                                </Link>
                            ]}
                        />
                    )}

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Link to="/login">← Quay lại đăng nhập</Link>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default ForgotPasswordPage;
