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

export {
    createUserApi, loginApi, getUserApi,
    getProductsApi, getProductBySlugApi, getSimilarProductsApi,
    getCategoriesApi, getPromotionProductsApi,
    getNewProductsApi, getBestSellerProductsApi, getMostViewedProductsApi
};
