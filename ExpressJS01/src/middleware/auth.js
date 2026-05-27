require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    // Exact match whitelist
    const white_lists = ["/", "/register", "/login", "/forgot-password", "/reset-password"];
    // Prefix match whitelist (public product/category APIs)
    const public_prefixes = ["/products", "/categories", "/promotion-products", "/new-products", "/bestseller-products", "/similar-products", "/most-viewed-products"];

    const path = req.originalUrl.replace('/v1/api', '').split('?')[0]; // bỏ query string

    if (white_lists.includes(path) || public_prefixes.some(prefix => path.startsWith(prefix))) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    _id: decoded._id,
                    email: decoded.email,
                    name: decoded.name,
                    createdBy: "hoidanit"
                };
                next();
            } catch (error) {
                return res.status(401).json({ message: "Token bị hết hạn/hoặc không hợp lệ" });
            }
        } else {
            return res.status(401).json({ message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn" });
        }
    }
}
module.exports = auth;

