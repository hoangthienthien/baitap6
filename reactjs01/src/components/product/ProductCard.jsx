import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, calcDiscount } from '../../util/helpers';
import { CartContext } from '../context/cart.context';
import { AuthContext } from '../context/auth.context';
import { notification } from 'antd';

const ProductCard = ({ product, variant = 'home' }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const discount = calcDiscount(product.originalPrice, product.price);

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Ngăn chặn chuyển hướng đến trang chi tiết khi nhấn nút Add to Cart
        e.stopPropagation();

        if (!auth.isAuthenticated) {
            notification.info({ message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' });
            navigate('/login');
            return;
        }

        const res = await addToCart(product._id, 1);
        if (res?.EC === 0) {
            notification.success({ message: `Đã thêm "${product.name}" vào giỏ hàng!` });
        } else {
            notification.error({ message: res?.EM || 'Lỗi thêm giỏ hàng' });
        }
    };

    return (
        <Link 
            to={`/product/${product.slug}`} 
            className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200/80 border border-slate-100 overflow-hidden transition-premium hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-slate-50/50 aspect-square flex items-center justify-center p-4">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {discount > 0 && (
                        <span className="bg-[#ef4444] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            {discount}% OFF
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-[#10b981] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            New
                        </span>
                    )}
                    {product.isBestSeller && (
                        <span className="bg-[#f59e0b] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            Bán chạy
                        </span>
                    )}
                </div>

                {/* Stock Tag */}
                {product.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                        <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Hết hàng</span>
                    </div>
                ) : product.stock < 10 && (
                    <span className="absolute bottom-3 right-3 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-100 z-10">
                        Chỉ còn {product.stock}
                    </span>
                )}
            </div>

            {/* Info Container */}
            <div className="p-4 flex flex-col flex-1">
                {/* Brand / Category */}
                {product.category && (
                    <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                        {product.category.name}
                    </p>
                )}
                
                {/* Product Name */}
                <h3 className="font-semibold text-slate-800 text-xs sm:text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">({product.reviewCount || 0})</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-auto">Đã bán {product.sold || 0}</span>
                </div>
                
                {/* Price & Action Button */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm sm:text-base font-bold text-blue-600">{formatPrice(product.price)}</span>
                        {discount > 0 && (
                            <span className="text-[10px] text-slate-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>
                        )}
                    </div>

                    {/* Add to Cart button */}
                    {variant === 'search' ? (
                        <button
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold rounded-lg transition-premium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            Add to Cart
                        </button>
                    ) : (
                        <button
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                            className="w-full py-2 px-3 bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200/50 hover:border-transparent text-[11px] font-bold rounded-lg transition-premium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
