import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { getBestSellerProductsApi } from '../util/api';
import { formatPrice } from '../util/helpers';
import { notification } from 'antd';
import ProductCard from '../components/product/ProductCard';

const CartPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { cartItems, cartCount, cartTotal, cartLoading, fetchCart, updateQuantity, removeItem, clearCart } = useContext(CartContext);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCart();

        // Fetch suggestions (You may also like)
        getBestSellerProductsApi(4).then(res => {
            if (res?.EC === 0) setSuggestions(res.data);
        });
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
            <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-xs font-semibold">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-slate-50/20">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Your Cart is Empty</h2>
                    <p className="text-slate-400 text-xs max-w-xs mx-auto">Bạn chưa thêm thiết bị nào vào giỏ hàng TechNexus.</p>
                </div>
                <Link to="/search" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10">
            <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
                
                {/* Title Section */}
                <div className="pb-4 border-b border-slate-100 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Cart</h1>
                        <p className="text-slate-400 text-xs mt-1">Check your items and proceed to secure checkout.</p>
                    </div>
                    <button 
                        onClick={handleClearCart} 
                        className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-premium cursor-pointer"
                    >
                        Remove All
                    </button>
                </div>

                {/* 2-Column Cart Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {cartItems.map((item) => {
                            const product = item.productId;
                            if (!product) return null;

                            // Dynamic spec label parsing
                            const specLabel = product.specs 
                                ? `${product.specs.color || 'Titanium Gray'} | ${product.specs.storage || product.specs.type || '256GB'}` 
                                : 'Default Config';

                            return (
                                <div 
                                    key={product._id} 
                                    className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-5 hover:shadow-md transition-premium"
                                >
                                    {/* Item Image */}
                                    <Link to={`/product/${product.slug}`} className="shrink-0 bg-slate-50 rounded-xl overflow-hidden w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-2">
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/120'}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </Link>

                                    {/* Item Details */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <Link 
                                                    to={`/product/${product.slug}`} 
                                                    className="font-extrabold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 text-xs sm:text-sm tracking-tight"
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                                                    {specLabel}
                                                </p>
                                            </div>
                                            <span className="text-sm font-extrabold text-blue-600 shrink-0">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>

                                        {/* Actions: Qty Selector and Trash Button */}
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-bold cursor-pointer"
                                                >−</button>
                                                <span className="w-10 h-8 flex items-center justify-center text-xs font-bold text-slate-700">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-bold cursor-pointer"
                                                >+</button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(product._id, product.name)}
                                                className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-premium cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>

                                        {product.stock <= 5 && product.stock > 0 && (
                                            <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-1.5">⚠️ Chỉ còn {product.stock} thiết bị</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm sticky top-24">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Order Summary</h3>

                            <div className="space-y-3.5 text-xs font-medium text-slate-500 pb-4 border-b border-slate-100">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-slate-800 font-bold">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Shipping</span>
                                    <span className="text-emerald-500 font-bold uppercase tracking-wider">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span className="text-slate-800 font-bold">{formatPrice(cartTotal * 0.1)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Total</span>
                                <span className="text-xl font-extrabold text-blue-600">{formatPrice(cartTotal * 1.1)}</span>
                            </div>

                            {/* Promo Code Input */}
                            <div className="space-y-2 pt-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promo Code</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Enter code" 
                                        className="flex-1 px-3.5 py-2 bg-slate-50 text-xs rounded-lg outline-none border border-slate-200/80 focus:border-blue-500 focus:bg-white transition-colors"
                                    />
                                    <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-premium cursor-pointer">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Proceed to Checkout */}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                Proceed to Checkout &rarr;
                            </button>

                            {/* SSL Encryption Badge */}
                            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold tracking-wide uppercase pt-1">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure SSL Encryption
                            </div>
                        </div>
                    </div>
                </div>

                {/* You may also like suggestions section */}
                {suggestions.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">You may also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestions.map((p) => (
                                <ProductCard key={p._id} product={p} variant="home" />
                            ))}
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default CartPage;
