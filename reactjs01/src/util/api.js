import axios from './axios.customize';

// Authentication APIs
export const registerUserAPI = (name, email, password) => {
  return axios.post('/v1/api/register', { name, email, password });
};

export const loginUserAPI = (email, password) => {
  return axios.post('/v1/api/login', { email, password });
};

export const forgotPasswordAPI = (email) => {
  return axios.post('/v1/api/forgot-password', { email });
};

export const resetPasswordAPI = (email, otp, newPassword) => {
  return axios.post('/v1/api/reset-password', { email, otp, newPassword });
};

export const getUserAPI = () => {
  return axios.get('/v1/api/user');
};

export const getAccountAPI = () => {
  return axios.get('/v1/api/account');
};

// Product APIs
export const getProductsAPI = (params) => {
  return axios.get('/v1/api/products', { params });
};

export const getProductBySlugAPI = (slug) => {
  return axios.get(`/v1/api/products/${slug}`);
};

export const getSimilarProductsAPI = (params) => {
  return axios.get('/v1/api/similar-products', { params });
};

export const getCategoriesAPI = () => {
  return axios.get('/v1/api/categories');
};

export const getPromotionProductsAPI = () => {
  return axios.get('/v1/api/promotion-products');
};

export const getNewProductsAPI = () => {
  return axios.get('/v1/api/new-products');
};

export const getBestSellerProductsAPI = () => {
  return axios.get('/v1/api/bestseller-products');
};

export const getMostViewedProductsAPI = () => {
  return axios.get('/v1/api/most-viewed-products');
};

// Cart APIs
export const getCartAPI = () => {
  return axios.get('/v1/api/cart');
};

export const addToCartAPI = (productId, quantity, name, price, image, storage, color) => {
  return axios.post('/v1/api/cart/add', { productId, quantity, name, price, image, storage, color });
};

export const updateCartItemAPI = (productId, quantity) => {
  return axios.put('/v1/api/cart/update', { productId, quantity });
};

export const removeCartItemAPI = (productId) => {
  return axios.delete(`/v1/api/cart/remove/${productId}`);
};

export const clearCartAPI = () => {
  return axios.delete('/v1/api/cart/clear');
};

// Order APIs
export const createOrderAPI = (orderData) => {
  return axios.post('/v1/api/orders', orderData);
};

export const getOrdersAPI = (status) => {
  return axios.get('/v1/api/orders', { params: { status } });
};

export const getOrderDetailAPI = (orderId) => {
  return axios.get(`/v1/api/orders/${orderId}`);
};

export const cancelOrderAPI = (orderId) => {
  return axios.put(`/v1/api/orders/${orderId}/cancel`);
};

export const confirmOrderAPI = (orderId) => {
  return axios.put(`/v1/api/orders/${orderId}/confirm`);
};

export const updateOrderStatusAPI = (orderId, status) => {
  return axios.put(`/v1/api/orders/${orderId}/status`, { status });
};
