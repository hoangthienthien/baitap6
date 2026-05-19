const Product = require('../models/product');
const Category = require('../models/category');

// Lấy tất cả sản phẩm (có phân trang + lọc)
const getProductsService = async (query) => {
    try {
        const { page = 1, limit = 12, category, minPrice, maxPrice, sort, search, isPromotion, isNew, isBestSeller } = query;
        const filter = {};

        // Lọc theo danh mục
        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) filter.category = cat._id;
        }

        // Lọc theo giá
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Lọc theo flags
        if (isPromotion === 'true') filter.isPromotion = true;
        if (isNew === 'true') filter.isNew = true;
        if (isBestSeller === 'true') filter.isBestSeller = true;

        // Tìm kiếm theo tên
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Sắp xếp
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'best_seller') sortOption = { sold: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        return {
            EC: 0,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy danh sách sản phẩm' };
    }
};

// Lấy sản phẩm theo slug
const getProductBySlugService = async (slug) => {
    try {
        const product = await Product.findOne({ slug }).populate('category', 'name slug');
        if (!product) return { EC: 1, EM: 'Sản phẩm không tồn tại' };
        return { EC: 0, data: product };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy sản phẩm' };
    }
};

// Lấy sản phẩm tương tự (cùng danh mục)
const getSimilarProductsService = async (productId, categoryId, limit = 4) => {
    try {
        const products = await Product.find({
            category: categoryId,
            _id: { $ne: productId }
        }).populate('category', 'name slug').limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy sản phẩm tương tự' };
    }
};

// Lấy danh sách danh mục
const getCategoriesService = async () => {
    try {
        const categories = await Category.find({});
        return { EC: 0, data: categories };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy danh mục' };
    }
};

// Lấy sản phẩm khuyến mãi
const getPromotionProductsService = async (limit = 8) => {
    try {
        const products = await Product.find({ isPromotion: true })
            .populate('category', 'name slug').limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi' };
    }
};

// Lấy sản phẩm mới nhất
const getNewProductsService = async (limit = 8) => {
    try {
        const products = await Product.find({ isNew: true })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 }).limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi' };
    }
};

// Lấy sản phẩm bán chạy
const getBestSellerProductsService = async (limit = 8) => {
    try {
        const products = await Product.find({ isBestSeller: true })
            .populate('category', 'name slug')
            .sort({ sold: -1 }).limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi' };
    }
};

// Lấy sản phẩm xem nhiều nhất
const getMostViewedProductsService = async (limit = 10) => {
    try {
        const products = await Product.find({})
            .populate('category', 'name slug')
            .sort({ viewCount: -1 }).limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi' };
    }
};

module.exports = {
    getProductsService, getProductBySlugService, getSimilarProductsService,
    getCategoriesService, getPromotionProductsService,
    getNewProductsService, getBestSellerProductsService,
    getMostViewedProductsService
};
