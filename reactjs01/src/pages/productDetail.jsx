import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlugAPI, addToCartAPI } from '../util/api';
import { CartContext } from '../components/context/cart.context';
import { formatPrice } from '../util/helpers';
import { StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Spin, Table, Button, message } from 'antd';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // States
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await getProductBySlugAPI(slug);
        if (res && res.product) {
          setProduct(res.product);
          // Set initial defaults
          const p = res.product;
          setActiveImage(p.image || (p.images && p.images[0]) || '');
          setSelectedColor(p.colors?.[0] || 'Standard');
          setSelectedStorage(p.storage?.[0] || '128GB');
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-40 flex items-center justify-center">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm!</h2>
        <Link to="/search" className="inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl">
          Quay lại trang sản phẩm
        </Link>
      </div>
    );
  }

  // Calculate pricing based on selected storage
  let calculatedPrice = product.price;
  if (selectedStorage === '256GB') {
    calculatedPrice += 100;
  } else if (selectedStorage === '512GB') {
    calculatedPrice += 250;
  }

  const originalPrice = product.originalPrice ? product.originalPrice + (calculatedPrice - product.price) : 0;
  const saveAmount = originalPrice - calculatedPrice;

  // Visual images list
  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image || 'https://via.placeholder.com/600?text=Device'];

  const colorMap = {
    'Black': '#1e293b',
    'Gray': '#64748b',
    'Titanium Gray': '#475569',
    'Silver': '#cbd5e1',
    'White': '#f8fafc',
    'Purple': '#581c87',
    'Royal Purple': '#3b0764',
    'Emerald': '#047857',
    'Green': '#15803d',
    'Standard': '#2563eb'
  };

  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Titanium Gray', 'Silver', 'Purple', 'Green'];
  const storages = product.storage && product.storage.length > 0 ? product.storage : ['128GB', '256GB', '512GB'];

  const specData = [
    { key: '1', name: 'Display', value: product.specs?.display || '6.8" Dynamic AMOLED 2X, 120Hz, HDR10+, 2500 nits' },
    { key: '2', name: 'Processor', value: product.specs?.processor || 'Snapdragon 8 Gen 4 (4nm) Octa-core' },
    { key: '3', name: 'Rear Camera', value: product.specs?.camera || '200MP Main + 50MP Periscope + 12MP Ultrawide' },
    { key: '4', name: 'Battery', value: product.specs?.battery || '5500 mAh, 100W Wired Charging, 50W Wireless' },
    { key: '5', name: 'Water Resistance', value: product.specs?.waterResistance || 'IP68 dust/water resistant (up to 1.5m for 30 min)' }
  ];

  const mockReviews = [
    { name: 'Julian Smith', days: '2 days ago', rating: 5, comment: 'The camera quality is absolutely insane. Coming from the previous generation, the low-light performance on this Ultra model is a massive step up.' },
    { name: 'Maria Lopez', days: '1 week ago', rating: 5, comment: 'Incredible battery life. I\'m getting a full two days with moderate usage. The 100W charging is a game changer for quick top-ups.' },
    { name: 'David Kim', days: '2 weeks ago', rating: 4, comment: 'The display is the best I\'ve ever seen on a phone. The brightness is blinding even in direct sunlight. Well worth the price tag.' }
  ];

  const handleAddToCart = () => {
    addToCart(product, 1, selectedStorage, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedStorage, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-[14px] text-slate-400 font-semibold flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>&gt;</span>
        <Link to="/search?category=Smartphones" className="hover:text-indigo-600 transition-colors">Smartphones</Link>
        <span>&gt;</span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      {/* Main Content Columns */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Column (Main Image & Thumbnails) */}
        <div className="w-full lg:w-[500px] shrink-0 space-y-5">
          {/* Main Large Image Block */}
          <div className="w-full aspect-[5/4] bg-white border border-slate-100 rounded-3xl flex items-center justify-center p-8 overflow-hidden">
            <img 
              src={activeImage} 
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3.5 overflow-x-auto pb-2">
            {imagesList.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 bg-white border rounded-2xl p-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  activeImage === img 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                    : 'border-slate-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (Product Sales info) */}
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-700 rounded-full">
              New Release
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-950 tracking-tight leading-snug">
              {product.name}
            </h1>
            
            {/* Reviews rating info */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarFilled key={i} className="text-amber-400 text-base" />
              ))}
              <span className="text-[13px] font-semibold text-slate-400 ml-1">(128 Reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="border-y border-slate-100 py-5 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-indigo-900 tracking-tight">
                {formatPrice(calculatedPrice)}
              </span>
              {originalPrice > calculatedPrice && (
                <span className="text-[18px] text-slate-400 line-through font-semibold">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {saveAmount > 0 && (
              <span className="inline-block text-[12px] font-extrabold bg-rose-50 text-rose-600 px-3 py-1 rounded-lg">
                Save {formatPrice(saveAmount)} today with launch offer
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Color</span>
            <div className="flex gap-3">
              {colors.map((color) => {
                const hexColor = colorMap[color] || '#cbd5e1';
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      selectedColor === color 
                        ? 'border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-500/10' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: hexColor }}
                  />
                );
              })}
            </div>
          </div>

          {/* Storage Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Storage</span>
              <span className="text-[12px] text-indigo-600 font-bold hover:underline cursor-pointer">Size Guide</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {storages.map((storage) => {
                let addText = 'Standard';
                if (storage === '256GB') addText = '+$100';
                if (storage === '512GB') addText = '+$250';
                
                return (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                      selectedStorage === storage
                        ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950 font-bold'
                        : 'border-slate-200 hover:border-gray-300 text-slate-500'
                    }`}
                  >
                    <span className="text-sm tracking-tight">{storage}</span>
                    <span className="text-[11px] opacity-75 font-semibold mt-1">{addText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buy/Add Action Box */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-[14px] py-4 rounded-2xl text-center shadow-lg shadow-indigo-600/10 transition-all duration-200 cursor-pointer"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold text-[14px] py-4 rounded-2xl text-center shadow-lg shadow-emerald-500/10 transition-all duration-200 cursor-pointer"
            >
              Add to Cart
            </button>

            {/* Favorite button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="w-14 h-14 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              {isLiked ? (
                <HeartFilled className="text-rose-500 text-xl" />
              ) : (
                <HeartOutlined className="text-slate-400 hover:text-rose-500 text-xl" />
              )}
            </button>
          </div>

          {/* Delivery & Warranty info */}
          <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-5 space-y-3.5 text-[13px] text-slate-600">
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <div>
                <p className="font-extrabold text-indigo-950">Free Express Delivery</p>
                <p className="text-slate-500 text-[12px] mt-0.5">Order in 4h 21m for tomorrow delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="font-extrabold text-indigo-950">2-Year Warranty</p>
                <p className="text-slate-500 text-[12px] mt-0.5">Comprehensive coverage including accidents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNICAL SPECIFICATIONS */}
      <section className="space-y-6 pt-10">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pb-3 border-b border-gray-100 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-32 after:h-0.5 after:bg-indigo-600">
          Technical Specifications
        </h2>
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
          <table className="w-full text-[14px]">
            <tbody>
              {specData.map((spec, i) => (
                <tr key={spec.key} className={i % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}>
                  <td className="w-1/3 py-5 px-6 font-extrabold text-indigo-950 border-r border-slate-100/50">
                    {spec.name}
                  </td>
                  <td className="py-5 px-6 font-semibold text-slate-500 leading-relaxed">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Reviews</h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">What our early adopters are saying.</p>
          </div>
          <button 
            onClick={() => message.info('Tính năng đang được phát triển!')}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[13px] px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockReviews.map((review, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                    {review.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[14px] text-indigo-950">{review.name}</h4>
                    <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Verified Purchaser</span>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-slate-400">{review.days}</span>
              </div>

              {/* Review Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarFilled 
                    key={i} 
                    className={`text-[12px] ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>

              <p className="text-slate-500 text-[13px] leading-relaxed font-semibold">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
