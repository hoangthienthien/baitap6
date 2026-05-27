import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { formatPrice } from '../util/helpers';
import { notification } from 'antd';

const CartPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { cartItems, cartCount, cartTotal, cartLoading, fetchCart, updateQuantity, removeItem, clearCart } = useContext(CartContext);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId, newQty) => {
        if (newQty < 1) return;
        const res = await updateQuantity(productId, newQty);
        if (res?.EC !== 0) {
            notification.error({ message: res?.EM || 'Lỗi cập nhật giỏ hàng' });
        }
    };

    const handleRemove = async (productId, productName) => {
        const res = await removeItem(productId);
        if (res?.EC === 0) {
            notification.success({ message: `Đã xóa "${productName}" khỏi giỏ hàng` });
        }
    };

    const handleClearCart = async () => {
        const res = await clearCart();
        if (res?.EC === 0) {
            notification.success({ message: 'Đã xóa toàn bộ giỏ hàng' });
        }
    };

    if (cartLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
                    <Link to="/search" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all">
                        Mua sắm ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
                        <p className="text-sm text-gray-500 mt-1">{cartCount} sản phẩm</p>
                    </div>
                    <button onClick={handleClearCart} className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                        Xóa tất cả
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const product = item.productId;
                            if (!product) return null;
                            return (
                                <div key={product._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
                                    {/* Image */}
                                    <Link to={`/product/${product.slug}`} className="shrink-0">
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/120'}
                                            alt={product.name}
                                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
                                        />
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${product.slug}`} className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2 text-sm sm:text-base">
                                            {product.name}
                                        </Link>

                                        <div className="flex items-end gap-2 mt-2">
                                            <span className="text-lg font-bold text-red-500">{formatPrice(product.price)}</span>
                                            {product.originalPrice > product.price && (
                                                <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                            )}
                                        </div>

                                        {/* Quantity + Remove */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                                                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors font-medium"
                                                >−</button>
                                                <span className="w-12 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                                                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors font-medium"
                                                >+</button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                                                    {formatPrice(product.price * item.quantity)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemove(product._id, product.name)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {product.stock <= 5 && product.stock > 0 && (
                                            <p className="text-xs text-orange-500 mt-2">⚠️ Chỉ còn {product.stock} sản phẩm</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tạm tính ({cartCount} sản phẩm)</span>
                                    <span className="font-medium text-gray-700">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phí vận chuyển</span>
                                    <span className="font-medium text-emerald-600">Miễn phí</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-800">Tổng cộng</span>
                                        <span className="text-xl font-bold text-red-500">{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all"
                            >
                                Tiến hành thanh toán
                            </button>

                            <Link to="/search" className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-4 transition-colors">
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
