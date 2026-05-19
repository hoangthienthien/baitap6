import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard';

const ProductHorizontalSection = ({ title, icon, products, bgGradient = 'from-white to-gray-50', accentColor = 'indigo' }) => {
    if (!products || products.length === 0) return null;

    const colorMap = {
        indigo: {
            badge: 'from-indigo-500 to-purple-600',
            dot: 'bg-indigo-500',
            line: 'from-indigo-200',
            counter: 'text-indigo-600 bg-indigo-50',
        },
        amber: {
            badge: 'from-amber-500 to-orange-600',
            dot: 'bg-amber-500',
            line: 'from-amber-200',
            counter: 'text-amber-600 bg-amber-50',
        },
        emerald: {
            badge: 'from-emerald-500 to-teal-600',
            dot: 'bg-emerald-500',
            line: 'from-emerald-200',
            counter: 'text-emerald-600 bg-emerald-50',
        },
        red: {
            badge: 'from-red-500 to-pink-600',
            dot: 'bg-red-500',
            line: 'from-red-200',
            counter: 'text-red-600 bg-red-50',
        }
    };

    const colors = colorMap[accentColor] || colorMap.indigo;

    return (
        <section className={`py-10 bg-gradient-to-br ${bgGradient}`}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    {icon && <span className="text-2xl">{icon}</span>}
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.counter}`}>
                        {products.length} sản phẩm
                    </span>
                    <div className={`flex-1 h-px bg-gradient-to-r ${colors.line} to-transparent ml-4`}></div>
                </div>

                {/* Horizontal Swiper */}
                <div className="product-horizontal-swiper">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 16 },
                            640: { slidesPerView: 2.5, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                            1280: { slidesPerView: 5, spaceBetween: 24 },
                        }}
                        className="pb-12"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product._id}>
                                <div className="relative">
                                    {/* Ranking badge for top 3 */}
                                    {index < 3 && (
                                        <div className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                            'bg-gradient-to-br from-amber-600 to-amber-700'
                                        }`}>
                                            #{index + 1}
                                        </div>
                                    )}
                                    <ProductCard product={product} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ProductHorizontalSection;
