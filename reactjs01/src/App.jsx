import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './components/context/auth.context';
import { CartProvider } from './components/context/cart.context';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { Home } from './pages/home';
import { SearchPage } from './pages/search';
import { CartPage } from './pages/cart';
import { ProductDetailPage } from './pages/productDetail';
import { CheckoutPage } from './pages/checkout';
import { OrdersPage } from './pages/orders';
import { OrderDetailPage } from './pages/orderDetail';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ForgotPasswordPage } from './pages/forgotPassword';
import { UserProfilePage } from './pages/user';
import './App.css';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailPage />} />
              <Route path="user" element={<UserProfilePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
