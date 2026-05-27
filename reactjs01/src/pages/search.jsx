import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductsAPI } from '../util/api';
import { ProductCard } from '../components/product/ProductCard';
import { formatPrice } from '../util/helpers';
import { Spin, Slider, Radio, Checkbox, Select, Pagination, Empty } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States for data
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // States for query filters
  const [activePage, setActivePage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  // URL query params
  const categoryParam = searchParams.get('category') || '';
  const searchNameParam = searchParams.get('name') || '';
  const promotionParam = searchParams.get('promotion') || '';

  // Initial Sync from URL or reset on category change
  useEffect(() => {
    setActivePage(1);
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setSelectedRam(null);
    setSelectedStorage(null);
    setSelectedCamera([]);
  }, [categoryParam, searchNameParam, promotionParam]);

  // Load products when filters or page changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const query = {
          page: activePage,
          limit: 8,
          category: categoryParam,
          name: searchNameParam,
          promotion: promotionParam,
          sort: sortBy,
        };

        if (selectedBrands.length > 0) {
          query.brand = selectedBrands.join(',');
        }
        if (priceRange[0] > 0) {
          query.minPrice = priceRange[0];
        }
        if (priceRange[1] < 2000) {
          query.maxPrice = priceRange[1];
        }
        if (selectedRam) {
          query.ram = selectedRam;
        }
        if (selectedStorage) {
          query.storage = selectedStorage;
        }
        if (selectedCamera.length > 0) {
          query.camera = selectedCamera.join(',');
        }

        const res = await getProductsAPI(query);
        if (res && res.data) {
          setProducts(res.data);
          setTotalProducts(res.pagination?.total || res.data.length);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activePage, selectedBrands, priceRange, selectedRam, selectedStorage, selectedCamera, sortBy, categoryParam, searchNameParam, promotionParam]);

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
    setActivePage(1);
  };

  const handleCameraChange = (checkedValues) => {
    setSelectedCamera(checkedValues);
    setActivePage(1);
  };

  const handlePriceChange = (val) => {
    setPriceRange(val);
    setActivePage(1);
  };

  const toggleRam = (ram) => {
    setSelectedRam(prev => prev === ram ? null : ram);
    setActivePage(1);
  };

  const handleStorageChange = (e) => {
    setSelectedStorage(e.target.value);
    setActivePage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: SIDEBAR FILTER */}
        <aside className="w-full lg:w-64 bg-white border border-gray-100 rounded-3xl p-6 shrink-0 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-extrabold text-[16px] text-indigo-950 flex items-center gap-2">
              <FilterOutlined />
              <span>Filters</span>
            </h3>
            <button 
              onClick={() => {
                setSelectedBrands([]);
                setPriceRange([0, 2000]);
                setSelectedRam(null);
                setSelectedStorage(null);
                setSelectedCamera([]);
              }}
              className="text-[12px] font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* 1. Brand selection */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[14px] text-gray-800 tracking-wide uppercase">Brand</h4>
            <Checkbox.Group 
              value={selectedBrands} 
              onChange={handleBrandChange}
              className="flex flex-col gap-2.5 w-full"
            >
              <Checkbox value="Nexus" className="text-sm font-semibold text-gray-600">Nexus Pro</Checkbox>
              <Checkbox value="Zenith" className="text-sm font-semibold text-gray-600">Zenith Edge</Checkbox>
              <Checkbox value="Aether" className="text-sm font-semibold text-gray-600">Aether Phonics</Checkbox>
              <Checkbox value="Quantum" className="text-sm font-semibold text-gray-600">Quantum Mobile</Checkbox>
            </Checkbox.Group>
          </div>

          {/* 2. Price Range slider */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[14px] text-gray-800 tracking-wide uppercase">Price Range</h4>
            <Slider 
              range 
              min={0} 
              max={2000} 
              value={priceRange} 
              onChange={handlePriceChange}
              tooltip={{ formatter: (v) => formatPrice(v) }}
              trackStyle={[{ backgroundColor: '#4f46e5' }]}
              handleStyle={[{ borderColor: '#4f46e5', backgroundColor: '#fff' }]}
            />
            <div className="flex items-center justify-between text-[13px] text-gray-400 font-bold">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          {/* 3. RAM Selection badges */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[14px] text-gray-800 tracking-wide uppercase">RAM</h4>
            <div className="flex flex-wrap gap-2">
              {['8GB', '12GB', '16GB'].map((ram) => (
                <button
                  key={ram}
                  onClick={() => toggleRam(ram)}
                  className={`px-4 py-2 text-[12px] font-bold rounded-xl cursor-pointer border transition-all duration-200 ${
                    selectedRam === ram 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600 ring-2 ring-indigo-500/10'
                      : 'bg-slate-50 border-slate-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Storage selection radios */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[14px] text-gray-800 tracking-wide uppercase">Storage</h4>
            <Radio.Group 
              value={selectedStorage} 
              onChange={handleStorageChange} 
              className="flex flex-col gap-2.5 w-full"
            >
              <Radio value="128GB" className="text-sm font-semibold text-gray-600">128 GB</Radio>
              <Radio value="256GB" className="text-sm font-semibold text-gray-600">256 GB</Radio>
              <Radio value="512GB" className="text-sm font-semibold text-gray-600">512 GB</Radio>
            </Radio.Group>
          </div>

          {/* 5. Camera Selection */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[14px] text-gray-800 tracking-wide uppercase">Camera</h4>
            <Checkbox.Group 
              value={selectedCamera} 
              onChange={handleCameraChange}
              className="flex flex-col gap-2.5 w-full"
            >
              <Checkbox value="48MP" className="text-sm font-semibold text-gray-600">48 MP</Checkbox>
              <Checkbox value="64MP" className="text-sm font-semibold text-gray-600">64 MP</Checkbox>
              <Checkbox value="108MP" className="text-sm font-semibold text-gray-600">108 MP</Checkbox>
            </Checkbox.Group>
          </div>
        </aside>

        {/* RIGHT COLUMN: GRID OF PRODUCTS */}
        <main className="flex-1 w-full space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
                {categoryParam || searchNameParam || promotionParam ? (
                  categoryParam ? categoryParam : (searchNameParam ? `Tìm kiếm: "${searchNameParam}"` : 'Clearance Offers')
                ) : (
                  'All Devices'
                )}
              </h2>
              <p className="text-slate-400 text-sm mt-1 font-medium">{totalProducts} devices found</p>
            </div>

            {/* Sorting controller */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-400 text-[13px] font-bold uppercase tracking-wider">Sort by:</span>
              <Select
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                className="w-44 text-[13px] font-bold"
                bordered={false}
                suffixIcon={<DownOutlined className="text-gray-400 text-[11px]" />}
                options={[
                  { value: 'popularity', label: 'Popularity' },
                  { value: 'priceAsc', label: 'Price: Low to High' },
                  { value: 'priceDesc', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest Arrivals' }
                ]}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-32 flex items-center justify-center">
              <Spin size="large" tip="Discovering devices..." />
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-12">
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} variant="search" />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center pt-4">
                <Pagination
                  current={activePage}
                  pageSize={8}
                  total={totalProducts}
                  onChange={(page) => setActivePage(page)}
                  showSizeChanger={false}
                  className="premium-pagination"
                />
              </div>
            </div>
          ) : (
            <div className="py-24 bg-white rounded-3xl border border-gray-100 flex items-center justify-center">
              <Empty description="Không tìm thấy thiết bị nào khớp với bộ lọc của bạn." />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
