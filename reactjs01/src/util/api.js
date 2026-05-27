import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

// Product APIs
const getProductsApi = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return axios.get(`/v1/api/products?${query}`);
}

const getProductBySlugApi = (slug) => {
    return axios.get(`/v1/api/products/${slug}`);
}

const getSimilarProductsApi = (productId, categoryId, limit = 4) => {
    return axios.get(`/v1/api/similar-products?productId=${productId}&categoryId=${categoryId}&limit=${limit}`);
}

const getCategoriesApi = () => {
    return axios.get('/v1/api/categories');
}

const getPromotionProductsApi = (limit = 8) => {
    return axios.get(`/v1/api/promotion-products?limit=${limit}`);
}

const getNewProductsApi = (limit = 8) => {
    return axios.get(`/v1/api/new-products?limit=${limit}`);
}

const getBestSellerProductsApi = (limit = 8) => {
    return axios.get(`/v1/api/bestseller-products?limit=${limit}`);
}

const getMostViewedProductsApi = (limit = 10) => {
    return axios.get(`/v1/api/most-viewed-products?limit=${limit}`);
}

// Cart APIs
const getCartApi = () => {
    return axios.get('/v1/api/cart');
}

const addToCartApi = (productId, quantity = 1) => {
    return axios.post('/v1/api/cart/add', { productId, quantity });
}

const updateCartItemApi = (productId, quantity) => {
    return axios.put('/v1/api/cart/update', { productId, quantity });
}

const removeCartItemApi = (productId) => {
    return axios.delete(`/v1/api/cart/remove/${productId}`);
}

const clearCartApi = () => {
    return axios.delete('/v1/api/cart/clear');
}

// Order APIs
const createOrderApi = (orderData) => {
    return axios.post('/v1/api/orders', orderData);
}

const getOrdersApi = (status = '') => {
    const query = status ? `?status=${status}` : '';
    return axios.get(`/v1/api/orders${query}`);
}

const getOrderDetailApi = (orderId) => {
    return axios.get(`/v1/api/orders/${orderId}`);
}

const cancelOrderApi = (orderId, reason = '') => {
    return axios.put(`/v1/api/orders/${orderId}/cancel`, { reason });
}

export {
    createUserApi, loginApi, getUserApi,
    getProductsApi, getProductBySlugApi, getSimilarProductsApi,
    getCategoriesApi, getPromotionProductsApi,
    getNewProductsApi, getBestSellerProductsApi, getMostViewedProductsApi,
    getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi,
    createOrderApi, getOrdersApi, getOrderDetailApi, cancelOrderApi
};
