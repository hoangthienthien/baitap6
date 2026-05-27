import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserAPI } from '../util/api';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setIsLoading(true);
    try {
      const res = await registerUserAPI(values.name, values.email, values.password);
      if (res) {
        message.success('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
        navigate('/login');
      }
    } catch (err) {
      message.error(err.message || 'Email này đã tồn tại trên hệ thống!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden bg-slate-50/20 py-12">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-indigo-50/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white border border-slate-100 rounded-3xl p-8 relative z-10 shadow-xl shadow-slate-100/30 text-left space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm font-semibold">Join TechNexus to start exploring premium devices.</p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleRegister}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Full Name</span>}
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-slate-400 mr-2" />} 
              placeholder="John Doe" 
              className="bg-slate-50 border-slate-200"
            />
          </Form.Item>

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

          <Form.Item
            label={<span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Password</span>}
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
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
              {isLoading ? 'Creating Account...' : (
                <>
                  <span>Create Account</span>
                  <ArrowRightOutlined />
                </>
              )}
            </button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm font-semibold text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
