import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPromotionProductsApi, getNewProductsApi, getBestSellerProductsApi, getCategoriesApi, getMostViewedProductsApi } from '../util/api';
import ProductCard from '../components/product/ProductCard';
import ProductHorizontalSection from '../components/product/ProductHorizontalSection';

const HomePage = () => {
    const navigate = useNavigate();
    const [promoProducts, setPromoProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [promo, newest, best, cats, viewed] = await Promise.all([
                getPromotionProductsApi(8),
                getNewProductsApi(8),
                getBestSellerProductsApi(10),
                getCategoriesApi(),
                getMostViewedProductsApi(10)
            ]);
            if (promo?.EC === 0) setPromoProducts(promo.data);
            if (newest?.EC === 0) setNewProducts(newest.data);
            if (best?.EC === 0) setBestSellers(best.data);
            if (cats?.EC === 0) setCategories(cats.data);
            if (viewed?.EC === 0) setMostViewed(viewed.data);
            setLoading(false);
        };
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-xs font-semibold">Đang tải TechNexus...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Hero Banner Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50/30 pt-16 pb-20 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                            <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold bg-blue-100/80 text-blue-700 uppercase tracking-widest">
                                New Release
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                                Pro Beyond. <br />
                                <span className="text-blue-600">iPhone 15 Pro</span>
                            </h1>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Experience the power of Titanium. The most advanced camera system and the all-new A17 Pro chip for next-level gaming performance.
                            </p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link 
                                    to="/product/iphone-16-pro-max-256gb" 
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all"
                                >
                                    Pre-order Now
                                </Link>
                                <Link 
                                    to="/search" 
                                    className="px-6 py-3 bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 border border-slate-200 text-xs font-bold rounded-lg shadow-xs hover:shadow-sm transition-all"
                                >
                                    Watch Film
                                </Link>
                            </div>
                        </div>
                        {/* Hero Image with Circular glow */}
                        <div className="lg:col-span-6 flex justify-center relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[440px] md:h-[440px] glow-aura-blue rounded-full -z-10 animate-pulse"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600" 
                                alt="iPhone 15 Pro Premium" 
                                className="w-72 md:w-96 drop-shadow-[0_20px_50px_rgba(37,99,235,0.15)] hover:scale-[1.02] transition-transform duration-700 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands row */}
            <section className="bg-white border-y border-slate-100 py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8 opacity-75">
                        {['Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Sony'].map((brand) => (
                            <span 
                                key={brand} 
                                className="text-slate-400 hover:text-slate-800 text-sm md:text-base font-bold tracking-widest uppercase cursor-pointer transition-colors mx-auto md:mx-0"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hot Deals Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hot Deals</h2>
                            <p className="text-slate-400 text-xs mt-1">Limited time offers on top-selling devices.</p>
                        </div>
                        <Link to="/search?isPromotion=true" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors">
                            View All <span className="group-hover:translate-x-1 transition-transform">-&gt;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {promoProducts.slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} variant="home" />
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals Section (2 Column Custom Layout) */}
            <section className="py-16 bg-[#f8fafc]">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-8">New Arrivals</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column wide banner */}
                        <div className="lg:col-span-2 rounded-2xl overflow-hidden relative min-h-[380px] flex flex-col justify-end p-8 md:p-10 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 group">
                            {/* Galaxy background image */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000')] bg-cover bg-center opacity-15 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
                            
                            <div className="relative z-10 space-y-4 max-w-sm">
                                <span className="inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#10b981]/25 text-[#10b981] uppercase tracking-wider">
                                    Future is Here
                                </span>
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">Galaxy S25 Ultra</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Trang bị vi xử lý Snapdragon 8 Elite, bộ 4 camera Leica 200MP đột phá và bút S Pen đẳng cấp.
                                </p>
                                <Link 
                                    to="/product/samsung-galaxy-s25-ultra-256gb" 
                                    className="inline-flex px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all w-fit"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>

                        {/* Right column stacked layout */}
                        <div className="grid grid-rows-2 gap-6">
                            {/* Watch Card */}
                            <div className="rounded-2xl p-6 bg-[#d9d5d2]/40 relative overflow-hidden flex flex-col justify-between group">
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 glow-aura-green rounded-full -z-10"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400" 
                                    alt="Watch Series 9" 
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-28 md:w-32 group-hover:scale-105 transition-transform duration-500 object-contain"
                                />
                                <div className="space-y-2 relative z-10 max-w-[150px]">
                                    <h4 className="text-sm font-bold text-slate-800">Watch Series 9</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">Smarter. Brighter. Mightier.</p>
                                </div>
                                <Link 
                                    to="/search" 
                                    className="text-[10px] font-bold text-slate-800 hover:text-blue-600 transition-colors mt-auto relative z-10"
                                >
                                    Learn More &gt;
                                </Link>
                            </div>

                            {/* AirPods Card */}
                            <div className="rounded-2xl p-6 bg-[#dce6eb] relative overflow-hidden flex flex-col justify-between group">
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 glow-aura-blue rounded-full -z-10"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=400" 
                                    alt="AirPods Pro 2" 
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-28 md:w-32 group-hover:scale-105 transition-transform duration-500 object-contain"
                                />
                                <div className="space-y-2 relative z-10 max-w-[150px]">
                                    <h4 className="text-sm font-bold text-slate-800">AirPods Pro</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">Active Noise Cancellation.</p>
                                </div>
                                <Link 
                                    to="/product/airpods-pro-2-usb-c" 
                                    className="text-[10px] font-bold text-slate-800 hover:text-blue-600 transition-colors mt-auto relative z-10"
                                >
                                    Learn More &gt;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Horizontal Sections (Best Sellers & Most Viewed) */}
            <ProductHorizontalSection
                title="🏆 Top Bán chạy nhất"
                products={bestSellers}
                bgGradient="from-white to-slate-50"
                accentColor="amber"
            />

            <ProductHorizontalSection
                title="👁️ Sản phẩm xem nhiều nhất"
                products={mostViewed}
                bgGradient="from-slate-50 to-white"
                accentColor="indigo"
            />

            {/* Premium Audio & Fast Charging Promo cards */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Premium Audio */}
                        <div className="rounded-2xl p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 flex items-center justify-between overflow-hidden relative group min-h-[220px]">
                            <div className="space-y-4 max-w-[200px] z-10">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Premium Audio</h3>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                    Lose yourself in the music with our curated headphone collection.
                                </p>
                                <button 
                                    onClick={() => navigate('/search')}
                                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-premium cursor-pointer"
                                >
                                    Explore Audio
                                </button>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" 
                                alt="Headphones Collection" 
                                className="w-36 md:w-44 group-hover:scale-105 transition-transform duration-500 object-contain shrink-0"
                            />
                        </div>

                        {/* Fast Charging */}
                        <div className="rounded-2xl p-8 bg-gradient-to-br from-slate-100/80 to-slate-50 flex items-center justify-between overflow-hidden relative group min-h-[220px]">
                            <div className="space-y-4 max-w-[200px] z-10">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Fast Charging</h3>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                    GaN Technology for the fastest charge your device can handle.
                                </p>
                                <button 
                                    onClick={() => navigate('/search')}
                                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-premium cursor-pointer"
                                >
                                    Shop Power
                                </button>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500" 
                                alt="Charging Hub" 
                                className="w-36 md:w-44 group-hover:scale-105 transition-transform duration-500 object-contain shrink-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stay in the Loop (Newsletter) */}
            <section className="bg-slate-900 text-slate-100 py-16">
                <div className="max-w-xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-extrabold tracking-tight">Stay in the Loop</h2>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm mx-auto">
                        Get exclusive first access to new releases and member-only pricing delivered to your inbox.
                    </p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="flex-1 px-4 py-2.5 bg-slate-800 text-white text-xs rounded-lg outline-none border border-slate-700 focus:border-blue-500 transition-colors"
                        />
                        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-premium cursor-pointer">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <span className="text-lg font-bold text-white tracking-tight">
                                Tech<span className="text-blue-500">Nexus</span>
                            </span>
                            <p className="text-[11px] leading-relaxed text-slate-500">
                                Redefining mobile excellence through precision engineering and minimalist design.
                            </p>
                        </div>
                        {/* Shop Column */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
                            <ul className="space-y-2 text-[11px]">
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Smartphones</Link></li>
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Laptops</Link></li>
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Accessories</Link></li>
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Gift Cards</Link></li>
                            </ul>
                        </div>
                        {/* Support Column */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support</h4>
                            <ul className="space-y-2 text-[11px]">
                                <li><Link to="/orders" className="hover:text-blue-500 transition-colors">Track Order</Link></li>
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Returns & Exchanges</Link></li>
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/search" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        {/* Contact Us Column */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact Us</h4>
                            <p className="text-[11px] flex items-center gap-2">
                                ✉️ hello@technexus.com
                            </p>
                            <p className="text-[11px] flex items-center gap-2">
                                📞 1-800-TECH-NEXUS
                            </p>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
                        <p>© 2026 TechNexus Mobile. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
