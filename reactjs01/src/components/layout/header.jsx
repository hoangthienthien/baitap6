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
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
                        <span className="text-white font-bold text-sm">TS</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">TechShop</span>
                </Link>

                {/* Nav links (desktop) */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        Trang chủ
                    </Link>
                    <Link to="/search" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        Sản phẩm
                    </Link>
                    {auth.isAuthenticated && (
                        <>
                            <Link to="/orders" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                Đơn hàng
                            </Link>
                            <Link to="/user" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                Quản lý Users
                            </Link>
                        </>
                    )}
                </nav>

                {/* Search bar */}
                <div className="hidden lg:flex flex-1 max-w-md mx-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent focus:border-indigo-300 focus:bg-white rounded-xl text-sm outline-none transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    navigate(`/search?search=${encodeURIComponent(e.target.value.trim())}`);
                                }
                            }}
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Auth section + Cart */}
                <div className="flex items-center gap-3">
                    {/* Cart Icon */}
                    {auth.isAuthenticated && (
                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {auth.isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                            >
                                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{auth.user.name?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-32 truncate">{auth.user.name || auth.user.email}</span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-800">{auth.user.name}</p>
                                            <p className="text-xs text-gray-400">{auth.user.email}</p>
                                        </div>
                                        <Link to="/orders" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            Đơn hàng của tôi
                                        </Link>
                                        <Link to="/cart" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                            Giỏ hàng
                                            {cartCount > 0 && <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Đăng xuất
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                                Đăng ký
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-500 hover:text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> :
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 rounded-lg">Trang chủ</Link>
                    <Link to="/search" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 rounded-lg">Sản phẩm</Link>
                    {auth.isAuthenticated && (
                        <>
                            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 rounded-lg flex items-center justify-between">
                                <span>🛒 Giỏ hàng</span>
                                {cartCount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                            </Link>
                            <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 rounded-lg">📋 Đơn hàng</Link>
                            <Link to="/user" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 rounded-lg">Quản lý Users</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
