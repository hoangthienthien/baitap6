import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordAPI, resetPasswordAPI } from '../util/api';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, KeyOutlined, LockOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (values) => {
    setIsLoading(true);
    try {
      const res = await forgotPasswordAPI(values.email);
      if (res) {
        setEmail(values.email);
        setStep(2);
        message.success('Mã xác thực OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!');
      }
    } catch (err) {
      message.error(err.message || 'Không tìm thấy tài khoản gắn liền với Email này!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setIsLoading(true);
    try {
      const res = await resetPasswordAPI(email, values.otp, values.newPassword);
      if (res) {
        message.success('Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.');
        navigate('/login');
      }
    } catch (err) {
      message.error(err.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden bg-slate-50/20 py-12">
      {/* Decorative Background Blur */}
      <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-indigo-50/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white border border-slate-100 rounded-3xl p-8 relative z-10 shadow-xl shadow-slate-100/30 text-left space-y-6">
        
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
              <p className="text-slate-400 text-sm font-semibold">Enter your email and we'll send you an OTP code.</p>
            </div>

            <Form
              layout="vertical"
              onFinish={handleRequestOtp}
              requiredMark={false}
              className="space-y-4"
            >
              <Form.Item
                label={<span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập Email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-slate-400 mr-2" />} 
                  placeholder="name@example.com" 
                  className="bg-slate-50 border-slate-200"
                />
              </Form.Item>

              <Form.Item className="pt-2 mb-0">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 transition-all duration-200"
                >
                  {isLoading ? 'Sending OTP...' : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRightOutlined />
                    </>
                  )}
                </button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Confirm OTP</h2>
              <p className="text-slate-400 text-sm font-semibold">An OTP code has been sent to <span className="text-slate-700 font-bold">{email}</span>.</p>
            </div>

            <Form
              layout="vertical"
              onFinish={handleResetPassword}
              requiredMark={false}
              className="space-y-4"
            >
              <Form.Item
                label={<span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">OTP Code</span>}
                name="otp"
                rules={[{ required: true, message: 'Vui lòng nhập mã xác thực OTP!' }]}
              >
                <Input 
                  prefix={<KeyOutlined className="text-slate-400 mr-2" />} 
                  placeholder="Enter OTP (e.g. 123456)" 
                  className="bg-slate-50 border-slate-200"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">New Password</span>}
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-slate-400 mr-2" />} 
                  placeholder="••••••••" 
                  className="bg-slate-50 border-slate-200"
                />
              </Form.Item>

              <Form.Item className="pt-2 mb-0">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 transition-all duration-200"
                >
                  {isLoading ? 'Resetting Password...' : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRightOutlined />
                    </>
                  )}
                </button>
              </Form.Item>
            </Form>

            <button 
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-slate-400 hover:text-indigo-600 hover:underline mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeftOutlined className="text-xs" />
              <span>Back to Email request</span>
            </button>
          </>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="text-sm font-bold text-indigo-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
