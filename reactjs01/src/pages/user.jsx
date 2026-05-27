import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getUserAPI } from '../util/api';
import { Card, Spin, Tag, Button } from 'antd';
import { UserOutlined, MailOutlined, SafetyCertificateOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export const UserProfilePage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadUserProfile = async () => {
      try {
        const res = await getUserAPI();
        if (res && res.user) {
          setUserDetails(res.user);
        } else if (user) {
          setUserDetails(user);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
        // Fallback to Context user if API fails due to temporary offline or similar
        if (user) setUserDetails(user);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated, authLoading, user]);

  if (authLoading || isLoading) {
    return (
      <div className="py-40 flex items-center justify-center">
        <Spin size="large" tip="Loading user profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-left">
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/30 space-y-8 relative overflow-hidden">
        {/* Decorative blur ball */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-650 font-extrabold text-2xl shadow-sm border border-indigo-100/50">
            {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-indigo-950">{userDetails?.name}</h2>
            <Tag color="indigo" className="font-bold uppercase tracking-wider text-[10px] px-2.5 rounded-full border-0">
              Customer Account
            </Tag>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-6 space-y-5 text-[14px]">
          <div className="flex items-center gap-4 py-1.5">
            <MailOutlined className="text-indigo-500 text-lg shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email Address</span>
              <span className="text-indigo-950 font-semibold mt-0.5">{userDetails?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 py-1.5">
            <UserOutlined className="text-indigo-500 text-lg shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Account ID</span>
              <span className="text-indigo-950 font-mono text-[13px] font-semibold mt-0.5">#{userDetails?._id || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 py-1.5">
            <SafetyCertificateOutlined className="text-indigo-500 text-lg shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Identity Status</span>
              <span className="text-emerald-500 font-bold mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Verified Client</span>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-6 flex gap-4">
          <Link 
            to="/orders" 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold py-3.5 rounded-2xl text-center shadow-lg shadow-indigo-600/10 transition-all duration-200"
          >
            Manage Orders
          </Link>
          <Link 
            to="/cart"
            className="flex-1 bg-slate-50 hover:bg-slate-100 text-indigo-650 font-bold py-3.5 rounded-2xl text-center border border-slate-200 transition-all duration-200"
          >
            View Giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
};
