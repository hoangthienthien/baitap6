import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { CartContext } from '../context/cart.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear("access_token");
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
        setDropdownOpen(false);
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100/80 shadow-sm transition-premium">
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <span className="text-xl font-bold tracking-tight text-blue-600 transition-colors">
                        Tech<span className="font-extrabold text-blue-900 group-hover:text-blue-700">Nexus</span>
                    </span>
                </Link>

                {/* Nav links (desktop) */}
                <nav className="hidden md:flex items-center gap-1.5 mx-auto">
                    <Link to="/search" className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-blue-600 rounded-lg transition-premium">
                        Smartphones
                    </Link>
                    <Link to="/search?category=phu-kien" className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-blue-600 rounded-lg transition-premium">
                        Accessories
                    </Link>
                    <Link to="/search" className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-blue-600 rounded-lg transition-premium">
                        Tablets
                    </Link>
                    <Link to="/search?isPromotion=true" className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-blue-600 rounded-lg transition-premium">
                        Offers
                    </Link>
                    {auth.isAuthenticated && (
                        <>
                            <Link to="/orders" className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-blue-600 rounded-lg transition-premium">
                                Đơn hàng
                            </Link>
                            <Link to="/user" className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-blue-600 rounded-lg transition-premium">
                                Users
                            </Link>
                        </>
                    )}
                </nav>

                {/* Search bar + Icons */}
                <div className="flex items-center gap-4 shrink-0">
                    {/* Search input (desktop) */}
                    <div className="hidden lg:block relative w-60">
                        <input
                            type="text"
                            placeholder="Search devices..."
                            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white rounded-lg text-xs outline-none transition-premium"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    navigate(`/search?search=${encodeURIComponent(e.target.value.trim())}`);
                                }
                            }}
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Cart Icon */}
                    {auth.isAuthenticated && (
                        <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-premium">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Auth Section */}
                    {auth.isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-full transition-premium"
                            >
                                <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold transition-premium">
                                    {auth.user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </button>
                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs font-semibold text-slate-800">{auth.user.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{auth.user.email}</p>
                                        </div>
                                        <Link to="/orders" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-premium flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            Đơn hàng của tôi
                                        </Link>
                                        <Link to="/cart" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-premium flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                            Giỏ hàng
                                            {cartCount > 0 && <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-premium flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Đăng xuất
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-100 hover:shadow-md transition-all">
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> :
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1.5 animate-fadeIn">
                    <Link to="/search" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Smartphones</Link>
                    <Link to="/search?category=phu-kien" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Accessories</Link>
                    <Link to="/search" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Tablets</Link>
                    <Link to="/search?isPromotion=true" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Offers</Link>
                    {auth.isAuthenticated && (
                        <>
                            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center justify-between">
                                <span>🛒 Giỏ hàng</span>
                                {cartCount > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                            </Link>
                            <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg">📋 Đơn hàng</Link>
                            <Link to="/user" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Users</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
