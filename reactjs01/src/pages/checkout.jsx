import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { createOrderApi } from '../util/api';
import { formatPrice } from '../util/helpers';
import { notification } from 'antd';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { cartItems, cartCount, cartTotal, fetchCart, setCartItems } = useContext(CartContext);

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: ''
    });

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            fetchCart();
        }
    }, []);

    const handleChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
            notification.error({ message: 'Vui lòng điền đầy đủ thông tin giao hàng' });
            return;
        }

        if (cartItems.length === 0) {
            notification.error({ message: 'Giỏ hàng trống' });
            return;
        }

        setLoading(true);
        const res = await createOrderApi({ shippingAddress, paymentMethod });
        setLoading(false);

        if (res?.EC === 0) {
            setCartItems([]);
            notification.success({
                message: 'Đặt hàng thành công! 🎉',
                description: 'Đơn hàng của bạn đã được tạo. Bạn có thể theo dõi trong mục Đơn hàng.',
                duration: 5
            });
            navigate('/orders');
        } else {
            notification.error({ message: res?.EM || 'Lỗi khi đặt hàng' });
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="text-6xl">🛒</div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 mb-6">Vui lòng thêm sản phẩm trước khi thanh toán</p>
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
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/cart" className="hover:text-indigo-600 transition-colors">Giỏ hàng</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">Thanh toán</span>
                </nav>

                <h1 className="text-2xl font-bold text-gray-800 mb-8">Thanh toán</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left - Shipping + Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                                    Thông tin giao hàng
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ tên *</label>
                                        <input
                                            type="text" name="fullName" value={shippingAddress.fullName}
                                            onChange={handleChange} required
                                            placeholder="Nguyễn Văn A"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại *</label>
                                        <input
                                            type="tel" name="phone" value={shippingAddress.phone}
                                            onChange={handleChange} required
                                            placeholder="0912 345 678"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ *</label>
                                        <input
                                            type="text" name="address" value={shippingAddress.address}
                                            onChange={handleChange} required
                                            placeholder="Số nhà, đường, phường/xã"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tỉnh/Thành phố</label>
                                        <input
                                            type="text" name="city" value={shippingAddress.city}
                                            onChange={handleChange}
                                            placeholder="TP. Hồ Chí Minh"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Quận/Huyện</label>
                                        <input
                                            type="text" name="district" value={shippingAddress.district}
                                            onChange={handleChange}
                                            placeholder="Quận 1"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phường/Xã</label>
                                        <input
                                            type="text" name="ward" value={shippingAddress.ward}
                                            onChange={handleChange}
                                            placeholder="Phường Bến Nghé"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                                    Phương thức thanh toán
                                </h2>
                                <div className="space-y-3">
                                    {/* COD */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                                    >
                                        <input
                                            type="radio" name="paymentMethod" value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-indigo-600"
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">💵</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'COD' && (
                                            <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">Mặc định</span>
                                        )}
                                    </label>

                                    {/* E-Wallet */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'E_WALLET' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                                    >
                                        <input
                                            type="radio" name="paymentMethod" value="E_WALLET"
                                            checked={paymentMethod === 'E_WALLET'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-indigo-600"
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">💳</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Ví điện tử (MoMo / ZaloPay)</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Thanh toán nhanh qua ví điện tử</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {paymentMethod === 'E_WALLET' && (
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-sm text-amber-700 flex items-start gap-2">
                                            <span className="text-lg">ℹ️</span>
                                            <span>Chức năng thanh toán qua ví điện tử đang được tích hợp. Đơn hàng sẽ được xử lý như đã thanh toán (giả lập).</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng ({cartCount} sản phẩm)</h3>

                                {/* Items preview */}
                                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                    {cartItems.map((item) => {
                                        const product = item.productId;
                                        if (!product) return null;
                                        return (
                                            <div key={product._id} className="flex items-center gap-3">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={product.images?.[0] || 'https://via.placeholder.com/60'}
                                                        alt={product.name}
                                                        className="w-14 h-14 object-cover rounded-lg"
                                                    />
                                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-800 line-clamp-1">{product.name}</p>
                                                    <p className="text-sm font-semibold text-red-500">{formatPrice(product.price * item.quantity)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tạm tính</span>
                                        <span className="font-medium">{formatPrice(cartTotal)}</span>
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
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>🛒 Đặt hàng</>
                                    )}
                                </button>

                                <Link to="/cart" className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-3 transition-colors">
                                    ← Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
