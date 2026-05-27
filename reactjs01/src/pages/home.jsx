import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPromotionProductsAPI } from '../util/api';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons';
import { Spin, message } from 'antd';

export const Home = () => {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const res = await getPromotionProductsAPI();
        if (res && res.products) {
          setDeals(res.products.slice(0, 4));
        } else if (res && Array.isArray(res)) {
          setDeals(res.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load deals:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDeals();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      message.error('Vui lòng nhập email!');
      return;
    }
    message.success('Đăng ký thành công! Cảm ơn bạn đã quan tâm.');
    setEmail('');
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-indigo-100/40 py-16 md:py-24 px-6 border-b border-indigo-100/20">
        {/* Decorative Aura Background Glow */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-sky-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute top-[30%] right-[25%] w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10 text-left">
          {/* Left Column */}
          <div className="space-y-6 max-w-lg">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 rounded-full">
              New Release
            </span>
            <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight leading-[1.1]">
              Pro Beyond. <br />
              <span className="font-extrabold text-indigo-600 drop-shadow-sm">iPhone 15 Pro</span>
            </h1>
            <p className="text-slate-500 text-[15px] md:text-[16px] leading-relaxed">
              Experience the power of Titanium. The most advanced camera system and the all-new A17 Pro chip for next-level gaming performance.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/products/iphone-15-pro"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-[14px] px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200"
              >
                Pre-order Now
              </Link>
              <Link 
                to="/products/iphone-15-pro" 
                className="bg-white hover:bg-slate-50 active:scale-98 text-indigo-600 border border-indigo-100 font-bold text-[14px] px-8 py-3.5 rounded-xl transition-all duration-200"
              >
                Watch Film
              </Link>
            </div>
          </div>

          {/* Right Column (Floating Phone with Aura) */}
          <div className="flex justify-center md:justify-end relative">
            {/* Round Aura Shadow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
            <img 
              src="https://res.cloudinary.com/df9jgqlyb/image/upload/v1700000000/technexus/iphone15pro_hero.png" 
              onError={(e) => {
                e.target.onerror = null;
                // fallback to another premium image or stock
                e.target.src = 'https://res.cloudinary.com/df9jgqlyb/image/upload/v1716805284/Nexus_X1_Ultra_Blue.png';
              }}
              alt="iPhone 15 Pro"
              className="max-h-[420px] object-contain drop-shadow-[0_25px_35px_rgba(79,70,229,0.15)] animate-pulse"
              style={{ animationDuration: '6s' }}
            />
          </div>
        </div>
      </section>

      {/* 2. BRANDS LOGOS ROW */}
      <section className="bg-white border-b border-gray-100 py-8 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between md:justify-around gap-8 text-gray-400 font-extrabold text-[16px] tracking-widest uppercase">
          {['Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Sony'].map((brand) => (
            <Link 
              key={brand} 
              to={`/search?brand=${brand}`} 
              className="hover:text-indigo-600 transition-colors duration-200 shrink-0"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. HOT DEALS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-left">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Hot Deals</h2>
            <p className="text-slate-400 text-[14px] mt-1 font-medium">Limited time offers on top-selling devices.</p>
          </div>
          <Link 
            to="/search?promotion=true" 
            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold text-[14px] transition-colors"
          >
            <span>View All</span>
            <ArrowRightOutlined className="text-xs" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Spin size="large" tip="Loading deals..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.length > 0 ? (
              deals.map((product) => (
                <ProductCard key={product._id} product={product} variant="deals" />
              ))
            ) : (
              // Empty fallback
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 animate-pulse rounded-3xl aspect-[3/4]" />
              ))
            )}
          </div>
        )}
      </section>

      {/* 4. NEW ARRIVALS (Asymmetrical Widget Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">New Arrivals</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Large Banner (Galaxy S24 Ultra - Dark Abstract) */}
          <div className="lg:col-span-2 bg-[#020617] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[360px] md:min-h-[440px]">
            {/* Background design */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-cyan-500/20 to-transparent pointer-events-none z-0" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

            <div className="space-y-4 max-w-sm relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                Future in Hand
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Galaxy S24 Ultra</h3>
              <p className="text-slate-400 text-[14px] leading-relaxed">
                Integrated S-Pen, 200MP camera system, and the most powerful processor ever in a Galaxy.
              </p>
            </div>

            <div className="relative z-10 pt-8">
              <Link 
                to="/products/galaxy-s24-ultra" 
                className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] px-6 py-3 rounded-full transition-all duration-200"
              >
                Shop Now
              </Link>
            </div>

            {/* Visual representation of Galaxy */}
            <img 
              src="https://res.cloudinary.com/df9jgqlyb/image/upload/v1716805284/Nexus_X1_Ultra_Blue.png"
              alt="Galaxy S24 Ultra"
              className="absolute right-6 md:right-12 bottom-6 max-h-[75%] object-contain drop-shadow-[0_15px_25px_rgba(6,182,212,0.15)] hidden sm:block pointer-events-none"
            />
          </div>

          {/* Right Column: Stacked Widgets */}
          <div className="flex flex-col gap-6">
            {/* Widget 1: Watch Series 9 (Light Pink/Grey) */}
            <div className="bg-[#f1f5f9] rounded-3xl p-6 flex flex-col justify-between flex-1 min-h-[190px] relative overflow-hidden group">
              <div className="space-y-2 max-w-[60%]">
                <h4 className="font-extrabold text-[18px] text-slate-900 leading-snug">Watch Series 9</h4>
                <p className="text-slate-500 text-[12px] leading-relaxed">Smarter. Brighter. Mightier.</p>
                <Link to="/search?category=Accessories" className="inline-block pt-1 text-[13px] font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                  Learn More
                </Link>
              </div>
              <img 
                src="https://res.cloudinary.com/df9jgqlyb/image/upload/v1700000000/technexus/watch9.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://res.cloudinary.com/df9jgqlyb/image/upload/v1716805284/Nexus_X1_Ultra_Blue.png';
                }}
                alt="Watch 9"
                className="absolute right-4 bottom-4 max-h-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Widget 2: AirPods Pro (Soft Blueish Lam) */}
            <div className="bg-[#eff6ff] rounded-3xl p-6 flex flex-col justify-between flex-1 min-h-[190px] relative overflow-hidden group">
              <div className="space-y-2 max-w-[60%]">
                <h4 className="font-extrabold text-[18px] text-slate-900 leading-snug">AirPods Pro</h4>
                <p className="text-slate-500 text-[12px] leading-relaxed">Active Noise Cancellation.</p>
                <Link to="/search?category=Accessories" className="inline-block pt-1 text-[13px] font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                  Learn More
                </Link>
              </div>
              <img 
                src="https://res.cloudinary.com/df9jgqlyb/image/upload/v1700000000/technexus/airpods.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://res.cloudinary.com/df9jgqlyb/image/upload/v1716805284/Nexus_X1_Ultra_Blue.png';
                }}
                alt="AirPods Pro"
                className="absolute right-4 bottom-4 max-h-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROMO BANNERS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Premium Audio (Light blue shade) */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 flex items-center justify-between gap-6 min-h-[220px] border border-blue-100/50 group overflow-hidden relative">
            <div className="space-y-4 max-w-[55%]">
              <h3 className="text-[20px] font-extrabold text-indigo-950">Premium Audio</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Lose yourself in the music with our curated headphone collection.
              </p>
              <Link 
                to="/search?category=Accessories" 
                className="inline-block bg-slate-900 hover:bg-slate-950 text-white font-bold text-[12px] px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                Explore Audio
              </Link>
            </div>
            <img 
              src="https://res.cloudinary.com/df9jgqlyb/image/upload/v1700000000/technexus/headphones.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://res.cloudinary.com/df9jgqlyb/image/upload/v1716805284/Nexus_X1_Ultra_Blue.png';
              }}
              alt="Headphones"
              className="max-h-[160px] object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Card 2: Fast Charging (Light indigo shade) */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-3xl p-8 flex items-center justify-between gap-6 min-h-[220px] border border-indigo-100/30 group overflow-hidden relative">
            <div className="space-y-4 max-w-[55%]">
              <h3 className="text-[20px] font-extrabold text-indigo-950">Fast Charging</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                GaN Technology for the fastest charge your device can handle.
              </p>
              <Link 
                to="/search?category=Accessories" 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                Shop Power
              </Link>
            </div>
            <img 
              src="https://res.cloudinary.com/df9jgqlyb/image/upload/v1700000000/technexus/charger.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://res.cloudinary.com/df9jgqlyb/image/upload/v1716805284/Nexus_X1_Ultra_Blue.png';
              }}
              alt="Charger"
              className="max-h-[160px] object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER ("STAY IN THE LOOP") */}
      <section className="bg-[#1e293b] text-white py-16 px-6 relative overflow-hidden">
        {/* Subtle grid pattern background or dot overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="max-w-xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Stay in the Loop</h2>
          <p className="text-slate-400 text-[14px] md:text-[15px] leading-relaxed">
            Get exclusive first access to new releases and member-only pricing delivered to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-[14px] px-8 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10 transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
