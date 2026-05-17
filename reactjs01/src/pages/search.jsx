import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductsApi, getCategoriesApi } from '../util/api';
import ProductCard from '../components/product/ProductCard';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);

    // Filter state
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [isPromotion, setIsPromotion] = useState(searchParams.get('isPromotion') || '');
    const [isBestSeller, setIsBestSeller] = useState(searchParams.get('isBestSeller') || '');

    useEffect(() => {
        getCategoriesApi().then(res => {
            if (res?.EC === 0) setCategories(res.data);
        });
    }, []);

    useEffect(() => {
        // Sync from URL params
        setSearch(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setSort(searchParams.get('sort') || 'newest');
        setIsPromotion(searchParams.get('isPromotion') || '');
        setIsBestSeller(searchParams.get('isBestSeller') || '');
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async (page = searchParams.get('page') || 1) => {
        setLoading(true);
        const params = {};
        const s = searchParams.get('search'); if (s) params.search = s;
        const c = searchParams.get('category'); if (c) params.category = c;
        const mn = searchParams.get('minPrice'); if (mn) params.minPrice = mn;
        const mx = searchParams.get('maxPrice'); if (mx) params.maxPrice = mx;
        const st = searchParams.get('sort'); if (st) params.sort = st;
        const ip = searchParams.get('isPromotion'); if (ip) params.isPromotion = ip;
        const ib = searchParams.get('isBestSeller'); if (ib) params.isBestSeller = ib;
        params.page = page;
        params.limit = 12;

        const res = await getProductsApi(params);
        if (res?.EC === 0) {
            setProducts(res.data);
            setPagination(res.pagination);
        }
        setLoading(false);
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search.trim()) params.set('search', search.trim());
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort && sort !== 'newest') params.set('sort', sort);
        if (isPromotion) params.set('isPromotion', isPromotion);
        if (isBestSeller) params.set('isBestSeller', isBestSeller);
        setSearchParams(params);
        setFilterOpen(false);
    };

    const clearFilters = () => {
        setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice('');
        setSort('newest'); setIsPromotion(''); setIsBestSeller('');
        setSearchParams({});
    };

    const priceRanges = [
        { label: 'Dưới 5 triệu', min: '', max: '5000000' },
        { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
        { label: '10 - 20 triệu', min: '10000000', max: '20000000' },
        { label: '20 - 30 triệu', min: '20000000', max: '30000000' },
        { label: 'Trên 30 triệu', min: '30000000', max: '' },
    ];

    const activeFiltersCount = [category, minPrice, maxPrice, isPromotion, isBestSeller].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {searchParams.get('search') ? `Kết quả tìm kiếm: "${searchParams.get('search')}"` : 'Tất cả sản phẩm'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{pagination.total} sản phẩm được tìm thấy</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={e => { setSort(e.target.value); const p = new URLSearchParams(searchParams); p.set('sort', e.target.value); setSearchParams(p); }}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 cursor-pointer"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá thấp → cao</option>
                            <option value="price_desc">Giá cao → thấp</option>
                            <option value="best_seller">Bán chạy nhất</option>
                            <option value="rating">Đánh giá cao</option>
                        </select>
                        {/* Filter toggle */}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${filterOpen || activeFiltersCount > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </button>
                    </div>
                </div>

                {/* Search + Filters panel */}
                {filterOpen && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                                <input
                                    type="text" value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                    placeholder="Nhập tên sản phẩm..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300"
                                />
                            </div>
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                                <select value={category} onChange={e => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 cursor-pointer">
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                                </select>
                            </div>
                            {/* Price range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
                                <div className="flex gap-2">
                                    <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Từ"
                                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300" />
                                    <span className="self-center text-gray-400">-</span>
                                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Đến"
                                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300" />
                                </div>
                            </div>
                            {/* Quick price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn nhanh</label>
                                <div className="flex flex-wrap gap-2">
                                    {priceRanges.map((r, i) => (
                                        <button key={i}
                                            onClick={() => { setMinPrice(r.min); setMaxPrice(r.max); }}
                                            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${minPrice === r.min && maxPrice === r.max ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-200'}`}
                                        >{r.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Flags */}
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isPromotion === 'true'}
                                    onChange={e => setIsPromotion(e.target.checked ? 'true' : '')}
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300" />
                                <span className="text-sm text-gray-600">🔥 Khuyến mãi</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isBestSeller === 'true'}
                                    onChange={e => setIsBestSeller(e.target.checked ? 'true' : '')}
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300" />
                                <span className="text-sm text-gray-600">🏆 Bán chạy</span>
                            </label>
                            <div className="ml-auto flex gap-2">
                                <button onClick={clearFilters} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    Xóa bộ lọc
                                </button>
                                <button onClick={applyFilters} className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all">
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="text-6xl">🔍</div>
                        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                        <button onClick={clearFilters} className="px-6 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-medium transition-colors">
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map(product => <ProductCard key={product._id} product={product} />)}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-10">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', page); setSearchParams(p); }}
                                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === pagination.page
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200'
                                            }`}
                                    >{page}</button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
