import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { loginUserAPI, getAccountAPI } from '../util/api';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';

export const LoginPage = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const res = await loginUserAPI(values.email, values.password);
      if (res && res.EC === 0) {
        localStorage.setItem('access_token', res.access_token);
        
        // Fetch account details to sync Context
        const acc = await getAccountAPI();
        if (acc && acc.email) {
          setUser(acc);
          setIsAuthenticated(true);
          message.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
          navigate('/');
        }
      } else {
        message.error(res?.EM || 'Email hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      message.error(err.message || 'Email hoặc mật khẩu không chính xác!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden bg-slate-50/20 py-12">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[30%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white border border-slate-100 rounded-3xl p-8 relative z-10 shadow-xl shadow-slate-100/30 text-left space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm font-semibold">Sign in to your TechNexus account to proceed.</p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
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

          <Form.Item
            label={
              <div className="flex items-center justify-between w-full">
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Password</span>
                <Link to="/forgot-password" className="text-[12px] font-bold text-indigo-600 hover:underline">Forgot password?</Link>
              </div>
            }
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
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
              {isLoading ? 'Signing In...' : (
                <>
                  <span>Sign In</span>
                  <ArrowRightOutlined />
                </>
              )}
            </button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm font-semibold text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
