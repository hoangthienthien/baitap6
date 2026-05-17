const express = require('express');
const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const { getProducts, getProductBySlug, getSimilarProducts, getCategories, getPromotionProducts, getNewProducts, getBestSellerProducts } = require('../controllers/productController');
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

module.exports = routerAPI;
