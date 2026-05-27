import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getOrderDetailApi, cancelOrderApi } from '../util/api';
import { formatPrice } from '../util/helpers';
import { notification, Modal, Input } from 'antd';

const STATUS_MAP = {
    new: { label: 'Đơn mới', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', icon: '📋', step: 0 },
    confirmed: { label: 'Xác nhận', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50', icon: '✅', step: 1 },
    preparing: { label: 'Chuẩn bị', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', icon: '📦', step: 2 },
    shipping: { label: 'Đang giao', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', icon: '🚚', step: 3 },
    delivered: { label: 'Thành công', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', icon: '🎉', step: 4 },
    cancelled: { label: 'Đã hủy', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', icon: '❌', step: -1 }
};

const STEPS = ['new', 'confirmed', 'preparing', 'shipping', 'delivered'];

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        setLoading(true);
        const res = await getOrderDetailApi(orderId);
        if (res?.EC === 0) {
            setOrder(res.data);
        }
        setLoading(false);
    };

    const handleCancel = async () => {
        setCancelling(true);
        const res = await cancelOrderApi(orderId, cancelReason);
        setCancelling(false);
        setCancelModalOpen(false);

        if (res?.EC === 0) {
            notification.success({ message: res.EM });
            setOrder(res.data);
        } else {
            notification.error({ message: res?.EM || 'Lỗi khi hủy đơn hàng' });
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const canCancel = () => {
        if (!order) return false;
        if (order.status === 'new') {
            const timeDiff = Date.now() - new Date(order.createdAt).getTime();
            return timeDiff < 30 * 60 * 1000;
        }
        if (order.status === 'preparing') return true;
        return false;
    };

    const getCancelButtonText = () => {
        if (order?.status === 'preparing') return 'Gửi yêu cầu hủy cho shop';
        return 'Hủy đơn hàng';
    };

    const hasCancelRequest = () => {
        return order?.statusHistory?.some(h => h.status === 'cancel_request');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/50">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-slate-50/20">
                <p className="text-slate-500 font-bold text-sm">Đơn hàng không tồn tại</p>
                <Link to="/orders" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Xem đơn hàng</Link>
            </div>
        );
    }

    const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
    const currentStep = statusInfo.step;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <span>&gt;</span>
                    <Link to="/orders" className="hover:text-blue-600 transition-colors">Đơn hàng</Link>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-mono font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                </nav>

                {/* Order Header Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                Chi tiết đơn hàng <span className="font-mono text-blue-600 font-extrabold">#{order._id.slice(-8).toUpperCase()}</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Đặt lúc: {formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg ${statusInfo.bgColor} ${statusInfo.textColor} inline-flex items-center gap-2 w-fit border border-current/10`}>
                            <span>{statusInfo.icon}</span>
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Timeline Tracker */}
                    {order.status !== 'cancelled' ? (
                        <div className="relative pt-2 pb-4">
                            <div className="flex items-center justify-between">
                                {STEPS.map((step, index) => {
                                    const stepInfo = STATUS_MAP[step];
                                    const isActive = index <= currentStep;
                                    const isCurrent = index === currentStep;
                                    return (
                                        <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                                            {index > 0 && (
                                                <div className={`absolute top-3.5 right-1/2 w-full h-[3px] -z-10 ${index <= currentStep ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                                            )}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-premium ${
                                                isActive
                                                    ? isCurrent
                                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100 ring-4 ring-blue-50'
                                                        : 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {isActive ? '✓' : index + 1}
                                            </div>
                                            <span className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {stepInfo.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col gap-1">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">❌ Đơn hàng đã bị hủy</p>
                            {order.cancelReason && (
                                <p className="text-xs text-red-500 font-semibold">Lý do: {order.cancelReason}</p>
                            )}
                        </div>
                    )}

                    {hasCancelRequest() && order.status !== 'cancelled' && (
                        <div className="mt-4 bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-xs font-semibold text-amber-700">
                            ⏳ Đã gửi yêu cầu hủy đơn hàng cho shop
                        </div>
                    )}
                </div>

                {/* Status Timeline Details */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5">Lịch sử trạng thái</h2>
                    <div className="space-y-4">
                        {order.statusHistory.map((history, index) => {
                            const hInfo = STATUS_MAP[history.status] || { color: 'bg-slate-500', label: history.status };
                            return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${hInfo.color || 'bg-slate-400'}`}></div>
                                        {index < order.statusHistory.length - 1 && (
                                            <div className="w-[2px] h-10 bg-slate-100 mt-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-700">{history.note || hInfo.label}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{formatDate(history.timestamp)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Product List */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-50">Sản phẩm ({order.items.length})</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1 shrink-0">
                                        <img
                                            src={item.productImage || 'https://via.placeholder.com/60'}
                                            alt={item.productName}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.productName}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">SL: {item.quantity} × {formatPrice(item.price)}</p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 shrink-0">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-baseline">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tổng cộng</span>
                            <span className="text-lg font-extrabold text-blue-600">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>

                    {/* Right Column: Address & Payment */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3.5 text-xs">
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Thông tin giao hàng</h2>
                            <div className="flex gap-2">
                                <span className="text-slate-400 w-16 font-bold uppercase tracking-wider text-[10px]">Họ tên:</span>
                                <span className="text-slate-800 font-bold">{order.shippingAddress.fullName}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-slate-400 w-16 font-bold uppercase tracking-wider text-[10px]">SĐT:</span>
                                <span className="text-slate-800 font-bold">{order.shippingAddress.phone}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-slate-400 w-16 font-bold uppercase tracking-wider text-[10px]">Địa chỉ:</span>
                                <span className="text-slate-600 font-semibold leading-relaxed">
                                    {[order.shippingAddress.address, order.shippingAddress.ward, order.shippingAddress.district, order.shippingAddress.city]
                                        .filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3.5 text-xs">
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Thanh toán</h2>
                            <div className="flex gap-2">
                                <span className="text-slate-400 w-20 font-bold uppercase tracking-wider text-[10px]">Phương thức:</span>
                                <span className="text-slate-800 font-bold">
                                    {order.paymentMethod === 'COD' ? '💵 COD (Tiền mặt)' : '💳 Ví điện tử'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-slate-400 w-20 font-bold uppercase tracking-wider text-[10px]">Trạng thái:</span>
                                <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                        </div>

                        {canCancel() && !hasCancelRequest() && (
                            <button
                                onClick={() => setCancelModalOpen(true)}
                                className="w-full py-3.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-premium cursor-pointer"
                            >
                                {getCancelButtonText()}
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link to="/orders" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                        &larr; Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>

            {/* Cancel Modal */}
            <Modal
                title="Hủy đơn hàng"
                open={cancelModalOpen}
                onCancel={() => setCancelModalOpen(false)}
                onOk={handleCancel}
                confirmLoading={cancelling}
                okText={order?.status === 'preparing' ? 'Gửi yêu cầu hủy' : 'Xác nhận hủy'}
                cancelText="Đóng"
                okButtonProps={{ danger: true }}
            >
                <p className="text-xs font-semibold text-slate-500 mb-4">
                    {order?.status === 'preparing'
                        ? 'Đơn hàng đang được chuẩn bị. Yêu cầu hủy sẽ được gửi đến shop để xử lý.'
                        : 'Bạn có chắc chắn muốn hủy đơn hàng này?'
                    }
                </p>
                <Input.TextArea
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn (tùy chọn)"
                    rows={3}
                />
            </Modal>
        </div>
    );
};

export default OrderDetailPage;
