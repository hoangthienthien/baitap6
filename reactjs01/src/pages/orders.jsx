import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getOrdersApi } from '../util/api';
import { formatPrice } from '../util/helpers';

const STATUS_MAP = {
    new: { label: 'Đơn hàng mới', color: 'bg-blue-100 text-blue-700', icon: '📋' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-indigo-100 text-indigo-700', icon: '✅' },
    preparing: { label: 'Đang chuẩn bị', color: 'bg-amber-100 text-amber-700', icon: '📦' },
    shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700', icon: '🚚' },
    delivered: { label: 'Đã giao thành công', color: 'bg-emerald-100 text-emerald-700', icon: '🎉' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: '❌' }
};

const TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'new', label: 'Mới' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">Đơn hàng của tôi</span>
                </nav>

                <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h1>

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${activeTab === tab.key
                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📋</span>
                        </div>
                        <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
                        <Link to="/search" className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all">
                            Mua sắm ngay
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
                                    className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-indigo-200 transition-all group"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{statusInfo.icon}</span>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Mã đơn: <span className="font-mono text-gray-700">#{order._id.slice(-8).toUpperCase()}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>

                                    {/* Items preview */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex -space-x-2">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.productImage || 'https://via.placeholder.com/40'}
                                                    alt={item.productName}
                                                    className="w-12 h-12 object-cover rounded-lg border-2 border-white"
                                                />
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center">
                                                    <span className="text-xs font-bold text-gray-500">+{order.items.length - 3}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 line-clamp-1">
                                                {order.items[0]?.productName}
                                                {order.items.length > 1 && ` và ${order.items.length - 1} sản phẩm khác`}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {order.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{order.paymentMethod === 'COD' ? '💵 COD' : '💳 Ví điện tử'}</span>
                                            <span>•</span>
                                            <span>{order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-red-500">{formatPrice(order.totalAmount)}</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
