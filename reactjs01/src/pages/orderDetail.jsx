import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getOrderDetailApi, cancelOrderApi } from '../util/api';
import { formatPrice } from '../util/helpers';
import { notification, Modal, Input } from 'antd';

const STATUS_MAP = {
    new: { label: 'Đơn hàng mới', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', icon: '📋', step: 0 },
    confirmed: { label: 'Đã xác nhận', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50', icon: '✅', step: 1 },
    preparing: { label: 'Đang chuẩn bị', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', icon: '📦', step: 2 },
    shipping: { label: 'Đang giao hàng', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', icon: '🚚', step: 3 },
    delivered: { label: 'Đã giao thành công', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', icon: '🎉', step: 4 },
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

    // Kiểm tra có thể hủy không
    const canCancel = () => {
        if (!order) return false;
        if (order.status === 'new') {
            const timeDiff = Date.now() - new Date(order.createdAt).getTime();
            return timeDiff < 30 * 60 * 1000; // 30 phút
        }
        if (order.status === 'preparing') return true; // gửi yêu cầu hủy
        return false;
    };

    const getCancelButtonText = () => {
        if (order?.status === 'preparing') return 'Gửi yêu cầu hủy cho shop';
        return 'Hủy đơn hàng';
    };

    // Kiểm tra có yêu cầu hủy đang chờ
    const hasCancelRequest = () => {
        return order?.statusHistory?.some(h => h.status === 'cancel_request');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-gray-500 text-lg">Đơn hàng không tồn tại</p>
                <Link to="/orders" className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">Xem đơn hàng</Link>
            </div>
        );
    }

    const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
    const currentStep = statusInfo.step;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/orders" className="hover:text-indigo-600 transition-colors">Đơn hàng</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                </nav>

                {/* Order Header */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                Chi tiết đơn hàng <span className="font-mono text-indigo-600">#{order._id.slice(-8).toUpperCase()}</span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Đặt lúc: {formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} inline-flex items-center gap-1.5 w-fit`}>
                            <span>{statusInfo.icon}</span>
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Status Timeline */}
                    {order.status !== 'cancelled' ? (
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                {STEPS.map((step, index) => {
                                    const stepInfo = STATUS_MAP[step];
                                    const isActive = index <= currentStep;
                                    const isCurrent = index === currentStep;
                                    return (
                                        <div key={step} className="flex flex-col items-center flex-1 relative">
                                            {/* Connector line */}
                                            {index > 0 && (
                                                <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${index <= currentStep ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                                            )}
                                            {/* Circle */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 text-sm transition-all ${isActive
                                                ? isCurrent
                                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-100'
                                                    : 'bg-indigo-500 text-white'
                                                : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                {isActive ? '✓' : index + 1}
                                            </div>
                                            <span className={`text-[10px] sm:text-xs mt-2 text-center ${isActive ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>
                                                {stepInfo.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-sm text-red-700 font-medium">❌ Đơn hàng đã bị hủy</p>
                            {order.cancelReason && (
                                <p className="text-sm text-red-600 mt-1">Lý do: {order.cancelReason}</p>
                            )}
                        </div>
                    )}

                    {/* Cancel request notice */}
                    {hasCancelRequest() && order.status !== 'cancelled' && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm text-amber-700 font-medium">⏳ Đã gửi yêu cầu hủy đơn hàng cho shop</p>
                        </div>
                    )}
                </div>

                {/* Status History */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Lịch sử trạng thái</h2>
                    <div className="space-y-4">
                        {order.statusHistory.map((history, index) => {
                            const hInfo = STATUS_MAP[history.status] || { color: 'bg-gray-500', label: history.status };
                            return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full ${hInfo.color || 'bg-gray-400'}`}></div>
                                        {index < order.statusHistory.length - 1 && (
                                            <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 -mt-1">
                                        <p className="text-sm font-medium text-gray-800">{history.note || hInfo.label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(history.timestamp)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm ({order.items.length})</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <img
                                        src={item.productImage || 'https://via.placeholder.com/60'}
                                        alt={item.productName}
                                        className="w-16 h-16 object-cover rounded-xl"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.productName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">SL: {item.quantity} × {formatPrice(item.price)}</p>
                                    </div>
                                    <span className="text-sm font-bold text-red-500 shrink-0">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 mt-4 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">Tổng cộng</span>
                                <span className="text-xl font-bold text-red-500">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping + Payment Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin giao hàng</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                    <span className="text-gray-500 w-24 shrink-0">Họ tên:</span>
                                    <span className="text-gray-800 font-medium">{order.shippingAddress.fullName}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gray-500 w-24 shrink-0">SĐT:</span>
                                    <span className="text-gray-800 font-medium">{order.shippingAddress.phone}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gray-500 w-24 shrink-0">Địa chỉ:</span>
                                    <span className="text-gray-800">
                                        {[order.shippingAddress.address, order.shippingAddress.ward, order.shippingAddress.district, order.shippingAddress.city]
                                            .filter(Boolean).join(', ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Thanh toán</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                    <span className="text-gray-500 w-24 shrink-0">Phương thức:</span>
                                    <span className="text-gray-800 font-medium">
                                        {order.paymentMethod === 'COD' ? '💵 Thanh toán khi nhận hàng' : '💳 Ví điện tử'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gray-500 w-24 shrink-0">Trạng thái:</span>
                                    <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {order.paymentStatus === 'paid' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cancel Button */}
                        {canCancel() && !hasCancelRequest() && (
                            <button
                                onClick={() => setCancelModalOpen(true)}
                                className="w-full py-3 border-2 border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-all"
                            >
                                {getCancelButtonText()}
                            </button>
                        )}
                    </div>
                </div>

                {/* Back link */}
                <div className="text-center mt-8">
                    <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                        ← Quay lại danh sách đơn hàng
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
                <p className="text-sm text-gray-600 mb-4">
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
