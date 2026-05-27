const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    productName: { type: String, required: true },
    productImage: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, default: '' },
        district: { type: String, default: '' },
        ward: { type: String, default: '' }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'E_WALLET'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['new', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'],
        default: 'new'
    },
    statusHistory: [statusHistorySchema],
    cancelReason: { type: String, default: '' },
    totalAmount: { type: Number, required: true },
    autoConfirmAt: { type: Date }
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);
module.exports = Order;
