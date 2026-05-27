import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProductsApi, getCategoriesApi } from '../util/api';
import ProductCard from '../components/product/ProductCard';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);

    // Sidebar filter states
    const [activeBrand, setActiveBrand] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState(Number(searchParams.get('maxPrice')) || 40000000);
    const [selectedRam, setSelectedRam] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedCamera, setSelectedCamera] = useState('');
    const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');

    // Fetch categories/brands on load
    useEffect(() => {
        getCategoriesApi().then(res => {
            if (res?.EC === 0) setCategories(res.data);
        });
    }, []);

    // Sync state from URL search params
    useEffect(() => {
        setActiveBrand(searchParams.get('category') || '');
        setPriceRange(Number(searchParams.get('maxPrice')) || 40000000);
        setSort(searchParams.get('sort') || 'popularity');
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        const params = {
            page: searchParams.get('page') || 1,
            limit: 8, // Set limit to 8 to match the 4x2 grid in the mockup
            category: searchParams.get('category') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            sort: searchParams.get('sort') === 'popularity' ? 'best_seller' : (searchParams.get('sort') || 'newest'),
            search: searchParams.get('search') || '',
            isPromotion: searchParams.get('isPromotion') || '',
            isBestSeller: searchParams.get('isBestSeller') || ''
        };

        const res = await getProductsApi(params);
        if (res?.EC === 0) {
            setProducts(res.data);
            setPagination(res.pagination);
        }
        setLoading(false);
    };

    // Apply URL parameter updates
    const updateUrlParams = (newParams) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        params.delete('page'); // Reset to page 1 on filter change
        setSearchParams(params);
    };

    // Client-side filtering of specs (RAM, Storage, Camera)
    const getFilteredProducts = () => {
        let list = [...products];

        // Filter RAM client-side
        if (selectedRam) {
            list = list.filter(p => p.specs?.ram?.toLowerCase() === selectedRam.toLowerCase());
        }

        // Filter Storage client-side
        if (selectedStorage) {
            list = list.filter(p => p.specs?.storage?.toLowerCase() === selectedStorage.toLowerCase());
        }

        // Filter Camera client-side
        if (selectedCamera) {
            list = list.filter(p => {
                const camSpec = p.specs?.camera || p.specs?.rear || '';
                const pixels = parseInt(camSpec) || 0;
                if (selectedCamera === '48MP+') return pixels >= 48 || camSpec.includes('48MP') || camSpec.includes('200MP');
                if (selectedCamera === '64MP+') return pixels >= 64 || camSpec.includes('64MP') || camSpec.includes('200MP');
                if (selectedCamera === '108MP+') return pixels >= 108 || camSpec.includes('108MP') || camSpec.includes('200MP');
                return true;
            });
        }

        return list;
    };

    const handleBrandToggle = (brandSlug) => {
        const nextBrand = activeBrand === brandSlug ? '' : brandSlug;
        setActiveBrand(nextBrand);
        updateUrlParams({ category: nextBrand });
    };

    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
        // Debounce or apply filter on mouseUp in React range is usually fine directly
        updateUrlParams({ maxPrice: value });
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        updateUrlParams({ sort: newSort });
    };

    const handlePageChange = (pageNum) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNum);
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearAllFilters = () => {
        setActiveBrand('');
        setPriceRange(40000000);
        setSelectedRam('');
        setSelectedStorage('');
        setSelectedCamera('');
        setSort('popularity');
        setSearchParams({});
    };

    const filteredList = getFilteredProducts();

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Main 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Sidebar Filters */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filters</span>
                            <button 
                                onClick={clearAllFilters}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Brands Category Checkboxes */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Brand</h4>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <label key={cat._id} className="flex items-center gap-3.5 cursor-pointer text-xs text-slate-500 font-medium select-none hover:text-slate-800 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={activeBrand === cat.slug}
                                            onChange={() => handleBrandToggle(cat.slug)}
                                            className="w-4 h-4 border-slate-200 text-blue-600 focus:ring-blue-500/20 rounded cursor-pointer transition-colors"
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Price Range</h4>
                            <div className="space-y-2 relative">
                                <input 
                                    type="range"
                                    min="0"
                                    max="40000000"
                                    step="1000000"
                                    value={priceRange}
                                    onChange={(e) => handlePriceRangeChange(Number(e.target.value))}
                                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                                />
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1">
                                    <span>0đ</span>
                                    <span>{priceRange.toLocaleString('vi-VN')}đ</span>
                                    <span>40Mđ</span>
                                </div>
                            </div>
                        </div>

                        {/* RAM Filter Buttons */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">RAM</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {['8GB', '12GB', '16GB'].map((ram) => (
                                    <button
                                        key={ram}
                                        onClick={() => setSelectedRam(selectedRam === ram ? '' : ram)}
                                        className={`py-2 text-[10px] font-bold rounded-lg border transition-premium cursor-pointer ${
                                            selectedRam === ram 
                                                ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm' 
                                                : 'border-slate-200/80 text-slate-500 hover:border-slate-300'
                                        }`}
                                    >
                                        {ram}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Storage Radio Selection */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Storage</h4>
                            <div className="space-y-2">
                                {['128GB', '256GB', '512GB'].map((storage) => (
                                    <label key={storage} className="flex items-center gap-3.5 cursor-pointer text-xs text-slate-500 font-medium select-none hover:text-slate-800 transition-colors">
                                        <input 
                                            type="radio"
                                            name="storage"
                                            checked={selectedStorage === storage}
                                            onChange={() => setSelectedStorage(selectedStorage === storage ? '' : storage)}
                                            onClick={() => setSelectedStorage(selectedStorage === storage ? '' : storage)}
                                            className="w-4 h-4 border-slate-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                        />
                                        <span>{storage}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Camera Checkbox */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Camera</h4>
                            <div className="space-y-2">
                                {['48MP+', '64MP+', '108MP+'].map((cam) => (
                                    <label key={cam} className="flex items-center gap-3.5 cursor-pointer text-xs text-slate-500 font-medium select-none hover:text-slate-800 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={selectedCamera === cam}
                                            onChange={() => setSelectedCamera(selectedCamera === cam ? '' : cam)}
                                            className="w-4 h-4 border-slate-200 text-blue-600 focus:ring-blue-500/20 rounded cursor-pointer"
                                        />
                                        <span>{cam}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Smartphones Grid & Sort */}
                    <div className="lg:col-span-9 space-y-6">
                        
                        {/* Title and Sort Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100/80">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smartphones</h1>
                                {searchParams.get('search') && (
                                    <p className="text-xs text-slate-400 mt-1">Kết quả cho: "{searchParams.get('search')}"</p>
                                )}
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sort by:</label>
                                <select
                                    value={sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="px-3.5 py-2 bg-white border border-slate-200/80 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                                >
                                    <option value="popularity">Popularity</option>
                                    <option value="price_asc">Price Low to High</option>
                                    <option value="price_desc">Price High to Low</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-slate-100">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <p className="text-slate-400 text-xs font-semibold">Loading TechNexus devices...</p>
                                </div>
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 gap-4 text-center">
                                <span className="text-4xl">🔍</span>
                                <p className="text-slate-500 font-bold text-sm">Không tìm thấy sản phẩm nào phù hợp bộ lọc</p>
                                <button 
                                    onClick={clearAllFilters}
                                    className="px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-premium"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredList.map((product, index) => (
                                    <div
                                        key={product._id}
                                        className="animate-fadeIn"
                                        style={{ animationDelay: `${(index % 8) * 40}ms` }}
                                    >
                                        <ProductCard product={product} variant="search" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Component */}
                        {!loading && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 pt-10 border-t border-slate-100/80">
                                {/* Previous Page Button */}
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer text-xs font-bold transition-premium"
                                >
                                    &lt;
                                </button>

                                {/* Page Number Buttons */}
                                {Array.from({ length: pagination.totalPages }, (_, index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-premium cursor-pointer ${
                                                pagination.page === pageNum
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100 border border-blue-600'
                                                    : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {/* Next Page Button */}
                                <button
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer text-xs font-bold transition-premium"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
