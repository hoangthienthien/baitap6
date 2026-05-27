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
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-gray-500 text-lg">Sản phẩm không tồn tại</p>
                <Link to="/" className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">Về trang chủ</Link>
            </div>
        );
    }

    const discount = calcDiscount(product.originalPrice, product.price);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    {product.category && (
                        <>
                            <Link to={`/search?category=${product.category.slug}`} className="hover:text-indigo-600 transition-colors">{product.category.name}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
                </nav>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Swiper */}
                        <div className="p-6 lg:p-8 bg-gray-50">
                            {/* Main swiper */}
                            <Swiper
                                modules={[Navigation, Pagination, Thumbs]}
                                navigation
                                pagination={{ clickable: true }}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                className="rounded-2xl overflow-hidden mb-4 aspect-square"
                            >
                                {product.images.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    modules={[FreeMode, Thumbs]}
                                    freeMode
                                    watchSlidesProgress
                                    slidesPerView={4}
                                    spaceBetween={12}
                                    className="mt-3"
                                >
                                    {product.images.map((img, idx) => (
                                        <SwiperSlide key={idx} className="cursor-pointer">
                                            <div className="rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-400 transition-colors aspect-square">
                                                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-6 lg:p-8 flex flex-col">
                            {/* Category badge */}
                            {product.category && (
                                <Link to={`/search?category=${product.category.slug}`} className="inline-flex w-fit items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 hover:bg-indigo-100 transition-colors">
                                    {product.category.name}
                                </Link>
                            )}

                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            {/* Rating + Sold */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} className={`w-5 h-5 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                                </div>
                                <span className="text-sm text-gray-400">|</span>
                                <span className="text-sm text-gray-500">{product.reviewCount} đánh giá</span>
                                <span className="text-sm text-gray-400">|</span>
                                <span className="text-sm text-gray-500">Đã bán {product.sold}</span>
                            </div>

                            {/* Price */}
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 mb-6">
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-extrabold text-red-500">{formatPrice(product.price)}</span>
                                    {discount > 0 && (
                                        <>
                                            <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                            <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">-{discount}%</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-sm text-gray-500">Tình trạng:</span>
                                {product.stock > 0 ? (
                                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                        Còn hàng ({product.stock} sản phẩm)
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">Hết hàng</span>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm text-gray-500">Số lượng:</span>
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-medium"
                                    >−</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 1;
                                            setQuantity(Math.min(product.stock, Math.max(1, val)));
                                        }}
                                        className="w-16 h-10 text-center border-x border-gray-200 outline-none text-sm font-medium"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-medium"
                                    >+</button>
                                </div>
                            </div>

                            {/* Specs */}
                            {product.specs && Object.keys(product.specs).length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông số kỹ thuật</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(product.specs).map(([key, val]) => (
                                            <div key={key} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                                                <span className="text-xs text-gray-500 capitalize">{key}</span>
                                                <span className="text-xs font-medium text-gray-700">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mô tả</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* CTA buttons */}
                            <div className="flex gap-3 mt-auto pt-4">
                                <button
                                    disabled={product.stock === 0}
                                    onClick={async () => {
                                        if (!auth.isAuthenticated) { navigate('/login'); return; }
                                        const res = await addToCart(product._id, quantity);
                                        if (res?.EC === 0) {
                                            navigate('/checkout');
                                        } else {
                                            notification.error({ message: res?.EM || 'Lỗi thêm giỏ hàng' });
                                        }
                                    }}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Mua ngay
                                </button>
                                <button
                                    disabled={product.stock === 0}
                                    onClick={async () => {
                                        if (!auth.isAuthenticated) { navigate('/login'); return; }
                                        const res = await addToCart(product._id, quantity);
                                        if (res?.EC === 0) {
                                            notification.success({ message: `Đã thêm "${product.name}" vào giỏ hàng` });
                                        } else {
                                            notification.error({ message: res?.EM || 'Lỗi thêm giỏ hàng' });
                                        }
                                    }}
                                    className="px-6 py-3.5 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    🛒 Thêm giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                {similar.length > 0 && (
                    <section className="mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Sản phẩm tương tự</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent ml-4"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {similar.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
