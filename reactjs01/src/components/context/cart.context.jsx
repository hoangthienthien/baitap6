import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './auth.context';
import { getCartAPI, addToCartAPI, updateCartItemAPI, removeCartItemAPI, clearCartAPI } from '../../util/api';
import { message } from 'antd';

export const CartContext = createContext({
  cartItems: [],
  isLoading: false,
  totalQuantity: 0,
  totalPrice: 0,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  fetchCart: () => {}
});

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await getCartAPI();
      if (res && res.data && res.data.items) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1, storage = '128GB', color = 'Standard') => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return false;
    }
    try {
      const res = await addToCartAPI(
        product._id,
        quantity,
        product.name,
        product.price,
        product.image || (product.images && product.images[0]) || '',
        storage,
        color
      );
      if (res && res.EC === 0) {
        message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
        await fetchCart();
        return true;
      } else {
        message.error(res?.EM || 'Lỗi thêm sản phẩm vào giỏ hàng');
        return false;
      }
    } catch (err) {
      message.error(err.message || 'Lỗi thêm sản phẩm vào giỏ hàng');
      return false;
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      return removeFromCart(productId);
    }
    try {
      const res = await updateCartItemAPI(productId, newQty);
      if (res && res.EC === 0) {
        await fetchCart();
      } else {
        message.error(res?.EM || 'Lỗi cập nhật số lượng sản phẩm');
      }
    } catch (err) {
      message.error('Lỗi cập nhật số lượng sản phẩm');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await removeCartItemAPI(productId);
      if (res && res.EC === 0) {
        message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
        await fetchCart();
      } else {
        message.error(res?.EM || 'Lỗi xóa sản phẩm');
      }
    } catch (err) {
      message.error('Lỗi xóa sản phẩm');
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      totalQuantity,
      totalPrice,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
