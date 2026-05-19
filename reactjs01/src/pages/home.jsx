import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPromotionProductsApi, getNewProductsApi, getBestSellerProductsApi, getCategoriesApi, getMostViewedProductsApi } from '../util/api';
import ProductSection from '../components/product/ProductSection';
import ProductHorizontalSection from '../components/product/ProductHorizontalSection';

const HomePage = () => {
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
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90 text-sm mb-6">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Flash Sale đang diễn ra
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                            Điện thoại <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">chính hãng</span>
                            <br />giá tốt nhất
                        </h1>
                        <p className="text-white/80 text-lg mb-8 max-w-lg">
                            Khám phá bộ sưu tập smartphone mới nhất từ Apple, Samsung, Xiaomi với nhiều ưu đãi hấp dẫn.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/search" className="px-8 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all">
                                Mua ngay
                            </Link>
                            <Link to="/search?isPromotion=true" className="px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all">
                                Xem khuyến mãi 🔥
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-10 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categories.map(cat => (
                                <Link
                                    key={cat._id}
                                    to={`/search?category=${cat.slug}`}
                                    className="group flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center overflow-hidden transition-colors">
                                        <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-lg" />
                                    </div>
                                    <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{cat.name}</span>
                                    <span className="text-xs text-gray-400">{cat.description}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Khuyến mãi */}
            <ProductSection title="🔥 Khuyến mãi hot" icon="" products={promoProducts} bgGradient="from-red-50 to-orange-50" />

            {/* Top 10 Bán chạy nhất - Horizontal Swiper */}
            <ProductHorizontalSection
                title="🏆 Top 10 Bán chạy nhất"
                icon=""
                products={bestSellers}
                bgGradient="from-amber-50 to-yellow-50"
                accentColor="amber"
            />

            {/* Top Sản phẩm xem nhiều nhất - Horizontal Swiper */}
            <ProductHorizontalSection
                title="👁️ Sản phẩm xem nhiều nhất"
                icon=""
                products={mostViewed}
                bgGradient="from-emerald-50 to-teal-50"
                accentColor="emerald"
            />

            {/* Mới nhất */}
            <ProductSection title="✨ Sản phẩm mới" icon="" products={newProducts} bgGradient="from-indigo-50 to-blue-50" />

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">TechShop</h3>
                            <p className="text-sm text-gray-400">Cửa hàng điện thoại chính hãng uy tín hàng đầu Việt Nam.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Liên kết</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Trang chủ</Link></li>
                                <li><Link to="/search" className="hover:text-indigo-400 transition-colors">Sản phẩm</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Liên hệ</h3>
                            <p className="text-sm text-gray-400">Email: info@techshop.vn</p>
                            <p className="text-sm text-gray-400">Hotline: 1900.1234</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                        © 2026 TechShop. Bài tập CCPMMOI.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
