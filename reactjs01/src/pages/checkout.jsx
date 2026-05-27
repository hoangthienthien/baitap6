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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-slate-50/20">
                <div className="text-6xl">🛒</div>
                <div className="text-center">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Your Cart is Empty</h2>
                    <p className="text-slate-400 text-xs mb-6">Vui lòng thêm sản phẩm trước khi thanh toán</p>
                    <Link to="/search" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <span>&gt;</span>
                    <Link to="/cart" className="hover:text-blue-600 transition-colors">Giỏ hàng</Link>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-bold">Thanh toán</span>
                </nav>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left - Shipping + Payment */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2.5">
                                    <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold border border-blue-100">1</span>
                                    Thông tin giao hàng
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ tên *</label>
                                        <input
                                            type="text" name="fullName" value={shippingAddress.fullName}
                                            onChange={handleChange} required
                                            placeholder="Nguyễn Văn A"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-premium bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại *</label>
                                        <input
                                            type="tel" name="phone" value={shippingAddress.phone}
                                            onChange={handleChange} required
                                            placeholder="0912 345 678"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-premium bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ giao hàng *</label>
                                        <input
                                            type="text" name="address" value={shippingAddress.address}
                                            onChange={handleChange} required
                                            placeholder="Số nhà, đường, phường/xã"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-premium bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tỉnh/Thành phố</label>
                                        <input
                                            type="text" name="city" value={shippingAddress.city}
                                            onChange={handleChange}
                                            placeholder="TP. Hồ Chí Minh"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-premium bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quận/Huyện</label>
                                        <input
                                            type="text" name="district" value={shippingAddress.district}
                                            onChange={handleChange}
                                            placeholder="Quận 1"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-premium bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phường/Xã</label>
                                        <input
                                            type="text" name="ward" value={shippingAddress.ward}
                                            onChange={handleChange}
                                            placeholder="Phường Bến Nghé"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-premium bg-slate-50/50 focus:bg-white shadow-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2.5">
                                    <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold border border-blue-100">2</span>
                                    Phương thức thanh toán
                                </h2>
                                <div className="space-y-3">
                                    {/* COD */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-premium ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <input
                                            type="radio" name="paymentMethod" value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-lg">
                                                💵
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Thanh toán bằng tiền mặt khi giao hàng</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* E-Wallet */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-premium ${paymentMethod === 'E_WALLET' ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <input
                                            type="radio" name="paymentMethod" value="E_WALLET"
                                            checked={paymentMethod === 'E_WALLET'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-lg">
                                                💳
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Ví điện tử (MoMo / ZaloPay)</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Thanh toán trực tuyến bảo mật và tiện lợi</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {paymentMethod === 'E_WALLET' && (
                                    <div className="mt-4 p-4 bg-blue-50/30 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed font-semibold">
                                        ℹ️ Chức năng thanh toán qua ví điện tử đang được tích hợp. Đơn hàng sẽ được tạo lập ở trạng thái mô phỏng đã thanh toán.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right - Order Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm sticky top-24">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Đơn hàng ({cartCount} sp)</h3>

                                {/* Items Preview */}
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                                    {cartItems.map((item) => {
                                        const product = item.productId;
                                        if (!product) return null;
                                        return (
                                            <div key={product._id} className="flex items-center gap-3">
                                                <div className="relative shrink-0 w-12 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                                                    <img
                                                        src={product.images?.[0] || 'https://via.placeholder.com/60'}
                                                        alt={product.name}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                                                    <p className="text-[11px] font-extrabold text-blue-600 mt-0.5">{formatPrice(product.price * item.quantity)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3 text-xs font-semibold text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Tạm tính</span>
                                        <span className="text-slate-800 font-bold">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-emerald-500 font-bold uppercase tracking-wide">Miễn phí</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Tổng cộng</span>
                                        <span className="text-lg font-extrabold text-blue-600">{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>Đặt hàng &rarr;</>
                                    )}
                                </button>

                                <Link to="/cart" className="block text-center text-xs font-bold text-slate-400 hover:text-blue-600 mt-2 transition-colors">
                                    &larr; Quay lại giỏ hàng
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
