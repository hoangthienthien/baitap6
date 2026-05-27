import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetailAPI, cancelOrderAPI, confirmOrderAPI } from '../util/api';
import { formatPrice, mapOrderStatus } from '../util/helpers';
import { Steps, Spin, Button, message, Tag } from 'antd';
import { 
  ArrowLeftOutlined, 
  CloseCircleOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  CompassOutlined
} from '@ant-design/icons';

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const res = await getOrderDetailAPI(orderId);
      if (res && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const handleCancelOrder = async () => {
    setIsUpdating(true);
    try {
      const res = await cancelOrderAPI(orderId);
      if (res) {
        message.success('Đơn hàng đã được hủy thành công!');
        await fetchOrderDetail();
      }
    } catch (err) {
      message.error(err.message || 'Lỗi hủy đơn hàng');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmReceived = async () => {
    setIsUpdating(true);
    try {
      const res = await confirmOrderAPI(orderId);
      if (res) {
        message.success('Đã xác nhận nhận hàng thành công!');
        await fetchOrderDetail();
      }
    } catch (err) {
      message.error(err.message || 'Lỗi xác nhận');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-40 flex items-center justify-center">
        <Spin size="large" tip="Loading tracking details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy đơn hàng!</h2>
        <Link to="/orders" className="inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  // Get index for Steps
  const getStepIndex = (status) => {
    switch (status) {
      case 'new': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 1;
      case 'shipping': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const stepItems = [
    { title: 'Đặt hàng thành công', description: 'Đơn hàng mới tạo' },
    { title: 'Đã xác nhận', description: 'Đang chuẩn bị sản phẩm' },
    { title: 'Đang giao hàng', description: 'Đang vận chuyển' },
    { title: 'Giao hàng thành công', description: 'Đã nhận được hàng' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-left space-y-10">
      {/* Return link */}
      <Link to="/orders" className="inline-flex items-center gap-2 text-[14px] font-bold text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeftOutlined />
        <span>Back to Orders</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Details
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Order ID: #{order._id.toUpperCase()}</p>
        </div>
        <div className="flex gap-2">
          {order.status === 'new' && (
            <Button
              danger
              onClick={handleCancelOrder}
              loading={isUpdating}
              className="font-bold cursor-pointer rounded-xl h-11"
            >
              Cancel Order
            </Button>
          )}
          {order.status === 'shipping' && (
            <Button
              type="primary"
              onClick={handleConfirmReceived}
              loading={isUpdating}
              className="bg-emerald-500 hover:bg-emerald-600 border-0 font-bold cursor-pointer rounded-xl h-11"
            >
              Confirm Received
            </Button>
          )}
        </div>
      </div>

      {/* STEP PROGRESS ACCENT */}
      {order.status === 'cancelled' ? (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-center gap-4 text-rose-700">
          <CloseCircleOutlined className="text-3xl shrink-0" />
          <div>
            <h4 className="font-extrabold text-[16px]">Đơn hàng này đã bị hủy</h4>
            <p className="text-[13px] text-rose-600/80 mt-0.5">Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng của TechNexus.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 overflow-x-auto">
          <Steps 
            current={getStepIndex(order.status)} 
            items={stepItems}
            className="premium-steps min-w-[500px]"
          />
        </div>
      )}

      {/* Grid of Delivery detail & Bill Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Shipping address info */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-[16px] text-indigo-950 flex items-center gap-2">
            <CompassOutlined className="text-indigo-600" />
            <span>Shipping Information</span>
          </h3>
          <div className="space-y-3.5 text-[14px] text-slate-500 font-semibold">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Receiver Name</span>
              <span className="text-indigo-950 mt-0.5">{order.fullName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</span>
              <span className="text-indigo-950 mt-0.5">{order.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address</span>
              <span className="text-indigo-950 mt-0.5">{order.address}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment Method</span>
              <span className="text-indigo-950 mt-0.5 uppercase">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <h3 className="font-extrabold text-[16px] text-indigo-950">Invoice Breakdown</h3>
          
          <div className="space-y-4 text-[14px] font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-indigo-950">{formatPrice(order.totalPrice * 0.92)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-emerald-500 font-bold uppercase">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (8%)</span>
              <span className="text-indigo-950">{formatPrice(order.totalPrice * 0.08)}</span>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline text-indigo-950">
              <span className="font-extrabold text-[15px]">Paid Amount</span>
              <span className="text-indigo-600 font-extrabold text-[22px] tracking-tight">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS IN ORDER */}
      <section className="space-y-4">
        <h3 className="font-extrabold text-[16px] text-indigo-950">Order Invoice Items</h3>
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
          {order.items?.map((item) => (
            <div 
              key={item._id || item.productId} 
              className="flex items-center justify-between gap-6 p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2.5 shrink-0">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="text-left space-y-1">
                  <h4 className="font-extrabold text-[14px] text-indigo-950 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    {item.color} | {item.storage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 font-semibold text-[14px]">
                <div className="text-slate-400 font-bold">
                  <span>Price: {formatPrice(item.price)}</span>
                  <span className="mx-2">×</span>
                  <span className="text-indigo-950">Qty: {item.quantity}</span>
                </div>
                <span className="font-extrabold text-indigo-950 text-[15px]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
