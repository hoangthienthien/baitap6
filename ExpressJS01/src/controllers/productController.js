const {
    getProductsService, getProductBySlugService, getSimilarProductsService,
    getCategoriesService, getPromotionProductsService,
    getNewProductsService, getBestSellerProductsService
} = require('../services/productService');

const getProducts = async (req, res) => {
    const data = await getProductsService(req.query);
    return res.status(200).json(data);
};

const getProductBySlug = async (req, res) => {
    const data = await getProductBySlugService(req.params.slug);
    return res.status(200).json(data);
};

const getSimilarProducts = async (req, res) => {
    const { productId, categoryId } = req.query;
    const data = await getSimilarProductsService(productId, categoryId, req.query.limit);
    return res.status(200).json(data);
};

const getCategories = async (req, res) => {
    const data = await getCategoriesService();
    return res.status(200).json(data);
};

const getPromotionProducts = async (req, res) => {
    const data = await getPromotionProductsService(req.query.limit);
    return res.status(200).json(data);
};

const getNewProducts = async (req, res) => {
    const data = await getNewProductsService(req.query.limit);
    return res.status(200).json(data);
};

const getBestSellerProducts = async (req, res) => {
    const data = await getBestSellerProductsService(req.query.limit);
    return res.status(200).json(data);
};

module.exports = {
    getProducts, getProductBySlug, getSimilarProducts,
    getCategories, getPromotionProducts,
    getNewProducts, getBestSellerProducts
};
