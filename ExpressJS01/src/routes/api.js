const express = require('express');
const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const { getProducts, getProductBySlug, getSimilarProducts, getCategories, getPromotionProducts, getNewProducts, getBestSellerProducts, getMostViewedProducts } = require('../controllers/productController');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { createOrder, getOrders, getOrderDetail, confirmOrder, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Auth routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Product routes (public)
routerAPI.get("/products", getProducts);
routerAPI.get("/products/:slug", getProductBySlug);
routerAPI.get("/similar-products", getSimilarProducts);
routerAPI.get("/categories", getCategories);
routerAPI.get("/promotion-products", getPromotionProducts);
routerAPI.get("/new-products", getNewProducts);
routerAPI.get("/bestseller-products", getBestSellerProducts);
routerAPI.get("/most-viewed-products", getMostViewedProducts);

// Cart routes (cần auth - đã xử lý trong middleware)
routerAPI.get("/cart", getCart);
routerAPI.post("/cart/add", addToCart);
routerAPI.put("/cart/update", updateCartItem);
routerAPI.delete("/cart/remove/:productId", removeCartItem);
routerAPI.delete("/cart/clear", clearCart);

// Order routes (cần auth)
routerAPI.post("/orders", createOrder);
routerAPI.get("/orders", getOrders);
routerAPI.get("/orders/:orderId", getOrderDetail);
routerAPI.put("/orders/:orderId/cancel", cancelOrder);
routerAPI.put("/orders/:orderId/confirm", confirmOrder);
routerAPI.put("/orders/:orderId/status", updateOrderStatus);

module.exports = routerAPI;
