const Cart = require('../models/cart');
const Product = require('../models/product');

// Lấy giỏ hàng của user
const getCartService = async (userId) => {
    try {
        let cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'name slug price originalPrice images stock'
        });
        if (!cart) {
            cart = { items: [] };
        }
        return { EC: 0, data: cart };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy giỏ hàng' };
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCartService = async (userId, productId, quantity = 1) => {
    try {
        // Kiểm tra sản phẩm tồn tại và còn hàng
        const product = await Product.findById(productId);
        if (!product) return { EC: 1, EM: 'Sản phẩm không tồn tại' };
        if (product.stock < 1) return { EC: 1, EM: 'Sản phẩm đã hết hàng' };

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingIndex > -1) {
            // Đã có → tăng số lượng
            const newQty = cart.items[existingIndex].quantity + quantity;
            if (newQty > product.stock) {
                return { EC: 1, EM: `Chỉ còn ${product.stock} sản phẩm trong kho` };
            }
            cart.items[existingIndex].quantity = newQty;
        } else {
            // Chưa có → thêm mới
            if (quantity > product.stock) {
                return { EC: 1, EM: `Chỉ còn ${product.stock} sản phẩm trong kho` };
            }
            cart.items.push({ productId, quantity });
        }

        await cart.save();

        // Populate lại để trả về
        await cart.populate({
            path: 'items.productId',
            select: 'name slug price originalPrice images stock'
        });

        return { EC: 0, EM: 'Đã thêm vào giỏ hàng', data: cart };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi thêm vào giỏ hàng' };
    }
};

// Cập nhật số lượng sản phẩm trong giỏ
const updateCartItemService = async (userId, productId, quantity) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return { EC: 1, EM: 'Giỏ hàng trống' };

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return { EC: 1, EM: 'Sản phẩm không có trong giỏ hàng' };

        // Kiểm tra stock
        const product = await Product.findById(productId);
        if (!product) return { EC: 1, EM: 'Sản phẩm không tồn tại' };
        if (quantity > product.stock) {
            return { EC: 1, EM: `Chỉ còn ${product.stock} sản phẩm trong kho` };
        }

        if (quantity <= 0) {
            // Xóa item khỏi giỏ
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: 'name slug price originalPrice images stock'
        });

        return { EC: 0, EM: 'Đã cập nhật giỏ hàng', data: cart };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi cập nhật giỏ hàng' };
    }
};

// Xóa 1 sản phẩm khỏi giỏ
const removeCartItemService = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return { EC: 1, EM: 'Giỏ hàng trống' };

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: 'name slug price originalPrice images stock'
        });

        return { EC: 0, EM: 'Đã xóa sản phẩm khỏi giỏ hàng', data: cart };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi xóa sản phẩm' };
    }
};

// Xóa toàn bộ giỏ hàng
const clearCartService = async (userId) => {
    try {
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        return { EC: 0, EM: 'Đã xóa toàn bộ giỏ hàng' };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi xóa giỏ hàng' };
    }
};

module.exports = {
    getCartService, addToCartService, updateCartItemService,
    removeCartItemService, clearCartService
};
