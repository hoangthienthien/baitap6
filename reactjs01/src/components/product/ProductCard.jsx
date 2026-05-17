import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calcDiscount } from '../../util/helpers';

const ProductCard = ({ product }) => {
    const discount = calcDiscount(product.originalPrice, product.price);

    return (
        <Link to={`/product/${product.slug}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-50 aspect-square">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {discount > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                            -{discount}%
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                            Mới
                        </span>
                    )}
                    {product.isBestSeller && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                            Bán chạy
                        </span>
                    )}
                </div>
                {/* Stock warning */}
                {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute bottom-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-lg">
                        Còn {product.stock} sp
                    </span>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-700 font-bold px-4 py-2 rounded-lg">Hết hàng</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                {/* Category */}
                {product.category && (
                    <p className="text-xs text-indigo-500 font-medium mb-1 uppercase tracking-wide">
                        {product.category.name}
                    </p>
                )}
                {/* Name */}
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                </h3>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    <span className="text-xs text-gray-400 ml-auto">Đã bán {product.sold}</span>
                </div>
                {/* Price */}
                <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-red-500">{formatPrice(product.price)}</span>
                    {discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
