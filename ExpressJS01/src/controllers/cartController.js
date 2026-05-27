const {
    getCartService, addToCartService, updateCartItemService,
    removeCartItemService, clearCartService
} = require('../services/cartService');

const getCart = async (req, res) => {
    const data = await getCartService(req.user._id);
    return res.status(200).json(data);
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const data = await addToCartService(req.user._id, productId, quantity || 1);
    return res.status(200).json(data);
};

const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const data = await updateCartItemService(req.user._id, productId, quantity);
    return res.status(200).json(data);
};

const removeCartItem = async (req, res) => {
    const { productId } = req.params;
    const data = await removeCartItemService(req.user._id, productId);
    return res.status(200).json(data);
};

const clearCart = async (req, res) => {
    const data = await clearCartService(req.user._id);
    return res.status(200).json(data);
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
