import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { getProductsAPI } from '../util/api';
import { formatPrice } from '../util/helpers';
import { DeleteOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Spin, Input, Button, message, Empty } from 'antd';

export const CartPage = () => {
  const { cartItems, isLoading, totalPrice, updateQuantity, removeFromCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for promo code
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // States for recommendations
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await getProductsAPI({ limit: 4 });
        if (res && res.data) {
          setSuggestions(res.data.slice(0, 4));
        } else if (res && Array.isArray(res)) {
          setSuggestions(res.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      } finally {
        setIsSuggestionsLoading(false);
      }
    };
    loadSuggestions();
  }, []);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      message.error('Vui lòng nhập mã giảm giá!');
      return;
    }
    if (promoCode.toUpperCase() === 'NEXUS20') {
      setDiscount(totalPrice * 0.2); // 20% discount
      setIsPromoApplied(true);
      message.success('Đã áp dụng mã giảm giá NEXUS20 thành công (Giảm 20%)!');
    } else {
      message.error('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để tiến hành thanh toán!');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      message.warning('Giỏ hàng trống!');
      return;
    }
    // Navigate to checkout and pass discount info if any
    navigate('/checkout', { state: { discount } });
  };

  const calculatedTax = totalPrice * 0.08; // 8% standard tax
  const grandTotal = totalPrice - discount + calculatedTax;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left space-y-16">
      
      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: SHOPPING CART LIST */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Cart</h2>
            <p className="text-slate-400 text-[14px] mt-1 font-medium">Check your items and proceed to secure checkout.</p>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center bg-white border border-gray-100 rounded-3xl">
              <Spin size="large" tip="Loading your cart..." />
            </div>
          ) : cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item._id || item.productId?._id || item.productId} 
                  className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300"
                >
                  {/* Left part: Image + details */}
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-3 shrink-0">
                      <img 
                        src={item.productId?.images?.[0] || item.image} 
                        alt={item.productId?.name || item.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <h4 className="font-extrabold text-[16px] text-indigo-950 leading-snug line-clamp-1">
                        {item.productId?.name || item.name}
                      </h4>
                      <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.color || 'Standard'} | {item.storage || '128GB'}
                      </p>
                    </div>
                  </div>

                  {/* Right part: Count controller & removal */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                    <div className="flex flex-col items-end sm:items-start">
                      <span className="text-[16px] font-extrabold text-indigo-950">
                        {formatPrice(item.productId?.price || item.price || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Count toggles */}
                      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full px-1.5 py-1">
                         <button 
                          onClick={() => updateQuantity(item.productId?._id || item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-extrabold text-[14px] text-indigo-950">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId?._id || item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.productId?._id || item.productId)}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-rose-600 text-[13px] font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                      >
                        <DeleteOutlined className="text-base" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
              <Empty description="Giỏ hàng của bạn đang trống!" />
              <Link to="/search" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] px-6 py-3 rounded-xl transition-all duration-200">
                Khám phá sản phẩm
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="w-full lg:w-[380px] shrink-0 bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
          <h3 className="font-extrabold text-[18px] text-indigo-950 tracking-tight">Order Summary</h3>

          <div className="space-y-4 text-[14px] font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-indigo-950">{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-500 font-bold">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="text-emerald-500 font-bold uppercase">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="text-indigo-950">{formatPrice(calculatedTax)}</span>
            </div>
            
            <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
              <span className="text-indigo-950 font-extrabold text-[16px]">Total</span>
              <span className="text-indigo-600 font-extrabold text-[22px] tracking-tight">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          {/* Promo Code box */}
          <div className="space-y-2 pt-2">
            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Promo Code</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code (NEXUS20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isPromoApplied}
                className="bg-slate-50 border-slate-200"
              />
              <Button 
                onClick={handleApplyPromo}
                disabled={isPromoApplied}
                className="bg-indigo-50 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-100 shrink-0"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Check out button */}
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 transition-all duration-200"
          >
            <span>Proceed to Checkout</span>
            <ArrowRightOutlined />
          </button>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-[12px] font-bold text-gray-400 uppercase">
            <LockOutlined className="text-indigo-400" />
            <span>Secure SSL Encryption</span>
          </div>
        </div>
      </div>

      {/* SUGGESTIONS SECTION ("YOU MAY ALSO LIKE") */}
      <section className="space-y-8 pt-8">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight text-left">You may also like</h3>
        
        {isSuggestionsLoading ? (
          <div className="py-12 flex justify-center">
            <Spin tip="Loading suggestions..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((product) => (
              <div key={product._id} className="group bg-white rounded-3xl border border-slate-100 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 text-left relative">
                <div className="w-full aspect-square bg-[#f1f5f9]/50 rounded-2xl flex items-center justify-center p-5 mb-4">
                  <img 
                    src={product.image || (product.images && product.images[0]) || ''} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[15px] text-indigo-950 line-clamp-1">{product.name}</h4>
                  <span className="text-[15px] font-extrabold text-indigo-600">{formatPrice(product.price)}</span>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/products/${product.slug}`}
                    className="w-full inline-block border border-indigo-100 hover:bg-indigo-50 text-indigo-600 font-bold text-[12px] py-2.5 rounded-xl text-center transition-all duration-200"
                  >
                    Quick Add
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
