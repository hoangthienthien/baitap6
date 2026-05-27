import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersAPI } from '../util/api';
import { formatPrice, mapOrderStatus } from '../util/helpers';
import { Spin, Table, Tag, Button, Empty } from 'antd';
import { ShoppingOutlined, RightOutlined } from '@ant-design/icons';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'new', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrdersAPI(activeStatus);
        if (res && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [activeStatus]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-left space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingOutlined className="text-indigo-600" />
            <span>My Orders</span>
          </h2>
          <p className="text-slate-400 text-[14px] mt-1 font-medium">Track your active deliveries and review order history.</p>
        </div>
      </div>

      {/* Horizontal Scrollable Status Pills Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border shrink-0 ${
              activeStatus === tab.key
                ? 'bg-indigo-600 text-white border-indigo-650 shadow-md shadow-indigo-500/10'
                : 'bg-white text-gray-500 border-slate-100 hover:border-slate-200 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center bg-white border border-slate-100 rounded-3xl">
          <Spin size="large" tip="Loading orders..." />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300"
            >
              {/* Left Column: ID & Date */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-[15px] text-indigo-950">
                    Order ID: #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <Tag color={mapOrderStatus(order.status).color} className="font-bold border-0 px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
                    {mapOrderStatus(order.status).label}
                  </Tag>
                </div>
                <p className="text-[13px] font-semibold text-slate-400">
                  Placed on: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-[13px] text-slate-500 font-bold">
                  Items count: {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                </p>
              </div>

              {/* Right Column: Pricing & Link */}
              <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider">Total amount</span>
                  <span className="text-[18px] font-extrabold text-indigo-600 leading-tight">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>

                <Link 
                  to={`/orders/${order._id}`}
                  className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[13px] px-5 py-3 rounded-2xl border border-slate-200 hover:border-indigo-100 flex items-center gap-1.5 transition-all duration-200"
                >
                  <span>Track Details</span>
                  <RightOutlined className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
          <Empty description="Bạn chưa đặt đơn hàng nào." />
          <Link to="/search" className="bg-indigo-600 text-white font-bold text-[13px] px-6 py-3 rounded-xl transition-all">
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
};
