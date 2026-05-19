const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    isPromotion: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Tạo text index cho tìm kiếm
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('product', productSchema);
module.exports = Product;
