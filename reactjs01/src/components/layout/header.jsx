import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { CartContext } from '../context/cart.context';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  SearchOutlined, 
  LogoutOutlined, 
  ShoppingOutlined 
} from '@ant-design/icons';
import { Dropdown, Badge } from 'antd';

export const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { totalQuantity } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?name=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/user" className="font-medium text-gray-700">Tài khoản</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: <Link to="/orders" className="font-medium text-gray-700">Đơn hàng</Link>,
      icon: <ShoppingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <span className="font-medium text-red-600">Đăng xuất</span>,
      icon: <LogoutOutlined className="text-red-600" />,
      onClick: () => {
        logout();
        navigate('/');
      }
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-2xl font-light tracking-tight text-indigo-900">
            Tech<span className="font-extrabold text-indigo-600">Nexus</span>
          </span>
        </Link>

        {/* Central Categories Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link 
            to="/search?category=Smartphones" 
            className="text-[15px] font-semibold text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Smartphones
          </Link>
          <Link 
            to="/search?category=Accessories" 
            className="text-[15px] font-semibold text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Accessories
          </Link>
          <Link 
            to="/search?category=Tablets" 
            className="text-[15px] font-semibold text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Tablets
          </Link>
          <Link 
            to="/search?promotion=true" 
            className="text-[15px] font-semibold text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Offers
          </Link>
        </nav>

        {/* Search, Cart & Account controls */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Interactive Search Field */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 lg:w-64">
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
            />
            <button 
              type="submit" 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <SearchOutlined className="text-base" />
            </button>
          </form>

          {/* Shopping Cart Dynamic Counter */}
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200">
            <Badge count={totalQuantity} size="small" color="#4f46e5" offset={[4, -4]}>
              <ShoppingCartOutlined className="text-2xl" />
            </Badge>
          </Link>

          {/* User Account Controls */}
          {isAuthenticated ? (
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight" 
              arrow={{ pointAtCenter: true }}
              trigger={['click']}
            >
              <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                  {user?.name}
                </span>
              </button>
            </Dropdown>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200"
              title="Đăng nhập"
            >
              <UserOutlined className="text-2xl" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
