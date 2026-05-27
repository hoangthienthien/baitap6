import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { getProductBySlugApi, getSimilarProductsApi } from '../util/api';
import { formatPrice, calcDiscount } from '../util/helpers';
import ProductCard from '../components/product/ProductCard';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import { notification } from 'antd';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // Interactive variant selections
    const [selectedColor, setSelectedColor] = useState('blue');
    const [selectedStorage, setSelectedStorage] = useState('128GB');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setQuantity(1);
            const res = await getProductBySlugApi(slug);
            if (res?.EC === 0) {
                setProduct(res.data);
                // Lấy sản phẩm tương tự
                const simRes = await getSimilarProductsApi(res.data._id, res.data.category?._id, 4);
                if (simRes?.EC === 0) setSimilar(simRes.data);
            }
            setLoading(false);
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-xs font-semibold">Đang tải chi tiết thiết bị...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-slate-50/20">
                <p className="text-slate-500 font-bold text-sm">Thiết bị không tồn tại</p>
                <Link to="/" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Về trang chủ</Link>
            </div>
        );
    }

    const discount = calcDiscount(product.originalPrice, product.price);

    const handleBuyNow = async () => {
        if (!auth.isAuthenticated) { navigate('/login'); return; }
        const res = await addToCart(product._id, quantity);
        if (res?.EC === 0) {
            navigate('/checkout');
        } else {
            notification.error({ message: res?.EM || 'Lỗi thêm giỏ hàng' });
        }
    };

    const handleAddToCart = async () => {
        if (!auth.isAuthenticated) { navigate('/login'); return; }
        const res = await addToCart(product._id, quantity);
        if (res?.EC === 0) {
            notification.success({ message: `Đã thêm "${product.name}" vào giỏ hàng` });
        } else {
            notification.error({ message: res?.EM || 'Lỗi thêm giỏ hàng' });
        }
    };

    // Spec mapping table variables
    const specsMap = {
        display: product.specs?.screen || '6.7" Super Retina XDR OLED, 120Hz',
        processor: product.specs?.chip || 'Apple A17 Pro (3nm) 6-core',
        camera: product.specs?.camera || product.specs?.rear || '48MP Main + 12MP Telephoto + 12MP Ultra Wide',
        battery: product.specs?.battery || '4422mAh, Fast Charging 25W',
        water: 'IP68 Dust/Water resistant (up to 6m for 30 mins)',
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-6">
            <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
                
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <span>&gt;</span>
                    {product.category && (
                        <>
                            <Link to={`/search?category=${product.category.slug}`} className="hover:text-blue-600 transition-colors">{product.category.name}</Link>
                            <span>&gt;</span>
                        </>
                    )}
                    <span className="text-slate-600 truncate max-w-xs">{product.name}</span>
                </nav>

                {/* Main Product Container */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Left Side: Images & Gallery */}
                        <div className="lg:col-span-6 space-y-4">
                            {/* Primary Image View */}
                            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-8 flex items-center justify-center aspect-square relative">
                                <Swiper
                                    modules={[Navigation, Pagination, Thumbs]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    className="w-full h-full object-contain"
                                >
                                    {product.images.map((img, idx) => (
                                        <SwiperSlide key={idx} className="flex items-center justify-center">
                                            <img src={img} alt={`${product.name} ${idx + 1}`} className="max-h-full max-w-full object-contain mx-auto" />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* Image Thumbnails Row */}
                            {product.images.length > 1 && (
                                <div className="px-2">
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        modules={[FreeMode, Thumbs]}
                                        freeMode
                                        watchSlidesProgress
                                        slidesPerView={4}
                                        spaceBetween={12}
                                    >
                                        {product.images.map((img, idx) => (
                                            <SwiperSlide key={idx} className="cursor-pointer">
                                                <div className="rounded-xl overflow-hidden border-2 border-slate-100 hover:border-blue-500/80 transition-premium aspect-square bg-slate-50 flex items-center justify-center p-1.5">
                                                    <img src={img} alt={`Thumb ${idx + 1}`} className="max-h-full max-w-full object-contain mx-auto" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Sell/Config Options */}
                        <div className="lg:col-span-6 space-y-6">
                            
                            {/* Release Badge & Details */}
                            <div className="space-y-3">
                                <span className="inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#10b981]/15 text-[#10b981] uppercase tracking-wider">
                                    New Release
                                </span>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    {product.name}
                                </h1>
                                
                                {/* Star rating row */}
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span>({product.reviewCount || 128} Reviews)</span>
                                </div>
                            </div>

                            {/* Pricing & Offer details */}
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-extrabold text-blue-600">{formatPrice(product.price)}</span>
                                    {discount > 0 && (
                                        <span className="text-sm font-semibold text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                                    )}
                                </div>
                                {discount > 0 && (
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
                                        Save {formatPrice(product.originalPrice - product.price)} today with launch offer
                                    </p>
                                )}
                            </div>

                            {/* Interactive Color Selector */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color</span>
                                <div className="flex items-center gap-3">
                                    {[
                                        { id: 'blue', class: 'bg-[#1e3a8a]', name: 'Blue' },
                                        { id: 'white', class: 'bg-[#e2e8f0]', name: 'White' },
                                        { id: 'purple', class: 'bg-[#581c87]', name: 'Purple' },
                                        { id: 'green', class: 'bg-[#064e3b]', name: 'Green' }
                                    ].map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColor(color.id)}
                                            title={color.name}
                                            className={`w-6 h-6 rounded-full cursor-pointer transition-premium relative flex items-center justify-center ${color.class} ${
                                                selectedColor === color.id 
                                                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' 
                                                    : 'hover:scale-105'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Storage Selector */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage</span>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: '128GB', label: '128GB', desc: 'Standard' },
                                        { id: '256GB', label: '256GB', desc: '+1.000.000đ' },
                                        { id: '512GB', label: '512GB', desc: '+2.000.000đ' }
                                    ].map((storage) => (
                                        <button
                                            key={storage.id}
                                            onClick={() => setSelectedStorage(storage.id)}
                                            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-premium ${
                                                selectedStorage === storage.id
                                                    ? 'border-blue-600 bg-blue-50/20 shadow-sm'
                                                    : 'border-slate-200/80 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className="text-xs font-bold text-slate-800">{storage.label}</span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{storage.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Stock & Quantity Selection */}
                            <div className="flex items-center justify-between py-2 border-y border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity:</span>
                                    <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-lg overflow-hidden ml-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-bold cursor-pointer"
                                        >−</button>
                                        <span className="w-10 h-8 flex items-center justify-center text-xs font-bold text-slate-700">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-bold cursor-pointer"
                                        >+</button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {product.stock > 0 ? (
                                        <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                            Còn hàng ({product.stock} sp)
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Hết hàng</span>
                                    )}
                                </div>
                            </div>

                            {/* Buy Now & Add to Cart Action Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    disabled={product.stock === 0}
                                    onClick={handleBuyNow}
                                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Buy Now
                                </button>
                                <button
                                    disabled={product.stock === 0}
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            {/* Trust commitment badges */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="rounded-xl p-4 bg-slate-50 border border-slate-100 flex flex-col gap-1 items-center text-center">
                                    <span className="text-lg">🚚</span>
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Free Express Delivery</span>
                                    <span className="text-[9px] text-slate-400 font-medium leading-relaxed">Order in 4h 21m for tomorrow delivery</span>
                                </div>
                                <div className="rounded-xl p-4 bg-slate-50 border border-slate-100 flex flex-col gap-1 items-center text-center">
                                    <span className="text-lg">🛡️</span>
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">2-Year Warranty</span>
                                    <span className="text-[9px] text-slate-400 font-medium leading-relaxed">Comprehensive coverage including accidents</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
                        Technical Specifications
                    </h2>

                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <table className="w-full text-xs font-medium text-slate-500">
                            <tbody>
                                {[
                                    { label: 'Display', value: specsMap.display },
                                    { label: 'Processor', value: specsMap.processor },
                                    { label: 'Rear Camera', value: specsMap.camera },
                                    { label: 'Battery', value: specsMap.battery },
                                    { label: 'Water Resistance', value: specsMap.water }
                                ].map((spec, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                        <td className="w-1/3 py-4 px-6 font-bold text-slate-700 capitalize border-b border-slate-100">{spec.label}</td>
                                        <td className="py-4 px-6 text-slate-600 border-b border-slate-100">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customer Reviews Section */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-8 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Reviews</h2>
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-[10px] font-bold rounded-lg transition-premium cursor-pointer">
                            Write a Review
                        </button>
                    </div>

                    {/* Review Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Julian Smith', time: '2 days ago', rating: 5, comment: 'The camera quality is absolutely insane. Coming from the previous generation, the low-light performance on this Ultra model is a massive step up.' },
                            { name: 'Maria Lopez', time: '1 week ago', rating: 5, comment: 'Incredible battery life. I\'m getting a full two days with moderate usage. The 100W charging is a game changer for quick top-ups.' },
                            { name: 'David Kim', time: '2 weeks ago', rating: 5, comment: 'The display is the best I\'ve ever seen on a phone. The brightness is blinding even in direct sunlight. Well worth the price tag.' }
                        ].map((review, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-100 p-5 space-y-3.5 bg-slate-50/30 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                                {review.name.split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-extrabold text-slate-800">{review.name}</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Verified Purchaser</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-medium">{review.time}</span>
                                    </div>
                                    
                                    <div className="flex">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    
                                    <p className="text-slate-500 text-[11px] leading-relaxed font-medium">"{review.comment}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Products (You may also like) */}
                {similar.length > 0 && (
                    <section className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Sản phẩm tương tự</h2>
                            <Link to="/search" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {similar.map(p => <ProductCard key={p._id} product={p} variant="home" />)}
                        </div>
                    </section>
                )}
                
            </div>
        </div>
    );
};

export default ProductDetailPage;
