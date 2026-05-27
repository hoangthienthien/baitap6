import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StarFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { CartContext } from '../context/cart.context';
import { formatPrice } from '../../util/helpers';

export const ProductCard = ({ product, variant = 'deals' }) => {
  const { addToCart } = useContext(CartContext);

  const discountPercent = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.storage?.[0] || '128GB', product.colors?.[0] || 'Standard');
  };

  const getImageUrl = () => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) return product.images[0];
    return 'https://via.placeholder.com/300?text=Device';
  };

  // VARIANT B: SEARCH / DISCOVER GRID CARD
  if (variant === 'search') {
    return (
      <Link 
        to={`/products/${product.slug}`}
        className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover text-left p-4 relative"
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            -{discountPercent}%
          </span>
        )}

        {/* Product Image Box */}
        <div className="w-full aspect-square bg-[#f8fafc] rounded-xl flex items-center justify-center p-6 mb-4 overflow-hidden relative">
          <img 
            src={getImageUrl()} 
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
              {product.brand || 'Nexus Pro'}
            </span>
            <h3 className="font-bold text-[16px] text-gray-900 line-clamp-1 leading-snug group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            
            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarFilled 
                  key={i} 
                  className={`text-[12px] ${i < Math.round(product.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`} 
                />
              ))}
              <span className="text-[12px] font-semibold text-gray-400 ml-1">
                ({product.reviewsCount || 42})
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[18px] font-extrabold text-indigo-600 leading-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[13px] text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddClick}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-[13px] px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              <ShoppingCartOutlined className="text-base" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // VARIANT A: HOME PAGE / HOT DEALS / SUGGESTIONS
  return (
    <Link 
      to={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-3xl border border-slate-100/60 overflow-hidden card-hover text-left p-5 relative"
    >
      {/* Promotion Tag */}
      {discountPercent > 0 && (
        <span className="absolute top-5 left-5 z-10 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {discountPercent}% OFF
        </span>
      )}

      {/* Image container */}
      <div className="w-full aspect-square bg-[#f1f5f9]/50 rounded-2xl flex items-center justify-center p-6 mb-5 overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Name and pricing */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-[16px] text-[#0f172a] line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-[13px] text-slate-400 line-clamp-1">
            {product.description || 'Premium engineering & high performance.'}
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-extrabold text-indigo-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[14px] text-slate-400 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddClick}
            className="w-full bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200/80 text-indigo-600 font-bold text-[13px] py-3 rounded-xl text-center transition-all duration-200 cursor-pointer border border-indigo-100/50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};
