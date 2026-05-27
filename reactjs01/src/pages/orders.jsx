import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getOrdersApi } from '../util/api';
import { formatPrice } from '../util/helpers';

const STATUS_MAP = {
    new: { label: 'Đơn mới', color: 'bg-blue-50 text-blue-600 border border-blue-100', icon: '📋' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-indigo-50 text-indigo-600 border border-indigo-100', icon: '✅' },
    preparing: { label: 'Chuẩn bị', color: 'bg-amber-50 text-amber-600 border border-amber-100', icon: '📦' },
    shipping: { label: 'Đang giao', color: 'bg-purple-50 text-purple-600 border border-purple-100', icon: '🚚' },
    delivered: { label: 'Thành công', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100', icon: '🎉' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border border-red-100', icon: '❌' }
};

const TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'new', label: 'Mới' },
    { key: 'confirmed', label: 'Xác nhận' },
    { key: 'preparing', label: 'Chuẩn bị' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Giao thành công' },
    { key: 'cancelled', label: 'Đã hủy' },
];

const OrdersPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await getOrdersApi(activeTab === 'all' ? '' : activeTab);
        if (res?.EC === 0) {
            setOrders(res.data);
        }
        setLoading(false);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-xs font-semibold">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-bold">Đơn hàng của tôi</span>
                </nav>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">My Orders</h1>

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide border-b border-slate-100">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-premium cursor-pointer ${
                                activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-slate-100 text-center shadow-sm">
                        <span className="text-4xl">📋</span>
                        <p className="text-slate-500 font-bold text-sm">Không tìm thấy đơn hàng nào</p>
                        <Link to="/search" className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
                            return (
                                <Link
                                    key={order._id}
                                    to={`/orders/${order._id}`}
                                    className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-blue-200 transition-premium group"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{statusInfo.icon}</span>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">
                                                    Mã đơn: <span className="font-mono text-blue-600">#{order._id.slice(-8).toUpperCase()}</span>
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="flex items-center gap-4 mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                                        <div className="flex -space-x-3 shrink-0">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.productImage || 'https://via.placeholder.com/40'}
                                                    alt={item.productName}
                                                    className="w-10 h-10 object-cover rounded-lg border-2 border-white shadow-sm"
                                                />
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 truncate">
                                                {order.items[0]?.productName}
                                                {order.items.length > 1 && ` và ${order.items.length - 1} sản phẩm khác`}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                {order.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span>{order.paymentMethod === 'COD' ? '💵 COD' : '💳 Ví'}</span>
                                            <span>•</span>
                                            <span className={order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}>
                                                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-extrabold text-blue-600 tracking-normal capitalize">{formatPrice(order.totalAmount)}</span>
                                            <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
