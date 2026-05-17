import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, icon, products, bgGradient = 'from-white to-gray-50' }) => {
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-10 bg-gradient-to-br ${bgGradient}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    {icon && <span className="text-2xl">{icon}</span>}
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent ml-4"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
