import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined, 
  ShareAltOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

export const Footer = () => {
  return (
    <footer className="bg-[#1e293b] text-slate-300 border-t border-slate-800">
      {/* Top Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand Info */}
        <div className="space-y-4">
          <span className="text-2xl font-light tracking-tight text-white">
            Tech<span className="font-extrabold text-indigo-400">Nexus</span>
          </span>
          <p className="text-slate-400 text-[14px] leading-relaxed">
            Your premier destination for the latest in mobile technology and high-performance devices.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-500 hover:text-white transition-all duration-200">
              <GlobalOutlined />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-500 hover:text-white transition-all duration-200">
              <ShareAltOutlined />
            </a>
          </div>
        </div>

        {/* Column 1: Shop */}
        <div>
          <h4 className="text-white font-bold text-[15px] tracking-wide mb-6 uppercase">Shop</h4>
          <ul className="space-y-3.5 text-[14px]">
            <li>
              <Link to="/search?category=Smartphones" className="hover:text-indigo-400 transition-colors">Smartphones</Link>
            </li>
            <li>
              <Link to="/search?category=Tablets" className="hover:text-indigo-400 transition-colors">Tablets</Link>
            </li>
            <li>
              <Link to="/search?category=Accessories" className="hover:text-indigo-400 transition-colors">Accessories</Link>
            </li>
            <li>
              <Link to="/search?promotion=true" className="hover:text-indigo-400 transition-colors">Clearance</Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Support */}
        <div>
          <h4 className="text-white font-bold text-[15px] tracking-wide mb-6 uppercase">Support</h4>
          <ul className="space-y-3.5 text-[14px]">
            <li>
              <Link to="/orders" className="hover:text-indigo-400 transition-colors">Track Order</Link>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400 transition-colors">Returns & Exchanges</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400 transition-colors">Warranty Info</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div>
          <h4 className="text-white font-bold text-[15px] tracking-wide mb-6 uppercase">Contact Us</h4>
          <ul className="space-y-4 text-[14px]">
            <li className="flex items-center gap-3">
              <MailOutlined className="text-indigo-400 text-base" />
              <a href="mailto:hello@technexus.com" className="hover:text-indigo-400 transition-colors">hello@technexus.com</a>
            </li>
            <li className="flex items-center gap-3">
              <PhoneOutlined className="text-indigo-400 text-base" />
              <a href="tel:1-800-TECH-NEXUS" className="hover:text-indigo-400 transition-colors">1-800-TECH-NEXUS</a>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <SafetyCertificateOutlined className="text-indigo-400 text-base" />
              <span>Secure SSL Checkout</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <p>© {new Date().getFullYear()} TechNexus Mobile. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
