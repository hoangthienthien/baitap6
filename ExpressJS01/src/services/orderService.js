const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

// Map lưu các timeout auto-confirm (key = orderId)
const autoConfirmTimers = new Map();

// Tạo đơn hàng mới
const createOrderService = async (userId, orderData) => {
    try {
        const { shippingAddress, paymentMethod = 'COD' } = orderData;

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
            return { EC: 1, EM: 'Vui lòng điền đầy đủ thông tin giao hàng' };
        }

        // Lấy giỏ hàng
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'name price images stock sold'
        });

        if (!cart || cart.items.length === 0) {
            return { EC: 1, EM: 'Giỏ hàng trống' };
        }

        // Validate stock và tạo order items
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = item.productId;
            if (!product) {
                return { EC: 1, EM: 'Một sản phẩm trong giỏ hàng không còn tồn tại' };
            }
            if (product.stock < item.quantity) {
                return { EC: 1, EM: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho` };
            }

            orderItems.push({
                productId: product._id,
                productName: product.name,
                productImage: product.images?.[0] || '',
                price: product.price,
                quantity: item.quantity
            });
            totalAmount += product.price * item.quantity;
        }

        // Tạo order
        const autoConfirmAt = new Date(Date.now() + 30 * 60 * 1000); // 30 phút sau

        const order = await Order.create({
            userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'E_WALLET' ? 'paid' : 'pending',
            status: 'new',
            statusHistory: [{
                status: 'new',
                timestamp: new Date(),
                note: 'Đơn hàng được tạo'
            }],
            totalAmount,
            autoConfirmAt
        });

        // Trừ stock và tăng sold cho từng sản phẩm
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        // Xóa giỏ hàng
        cart.items = [];
        await cart.save();

        // Schedule auto-confirm sau 30 phút
        const timer = setTimeout(async () => {
            try {
                const orderToConfirm = await Order.findById(order._id);
                if (orderToConfirm && orderToConfirm.status === 'new') {
                    orderToConfirm.status = 'confirmed';
                    orderToConfirm.statusHistory.push({
                        status: 'confirmed',
                        timestamp: new Date(),
                        note: 'Đơn hàng được tự động xác nhận sau 30 phút'
                    });
                    await orderToConfirm.save();
                    console.log(`[Auto-confirm] Đơn hàng ${order._id} đã được tự động xác nhận`);
                }
                autoConfirmTimers.delete(order._id.toString());
            } catch (err) {
                console.log('[Auto-confirm error]', err);
            }
        }, 30 * 60 * 1000); // 30 phút

        autoConfirmTimers.set(order._id.toString(), timer);

        return { EC: 0, EM: 'Đặt hàng thành công', data: order };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi tạo đơn hàng' };
    }
};

// Lấy danh sách đơn hàng của user
const getOrdersService = async (userId, statusFilter) => {
    try {
        const filter = { userId };
        if (statusFilter && statusFilter !== 'all') {
            filter.status = statusFilter;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 });

        return { EC: 0, data: orders };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy danh sách đơn hàng' };
    }
};

// Lấy chi tiết 1 đơn hàng
const getOrderDetailService = async (userId, orderId) => {
    try {
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };
        return { EC: 0, data: order };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi lấy chi tiết đơn hàng' };
    }
};

// Xác nhận đơn hàng (thủ công - shop)
const confirmOrderService = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };
        if (order.status !== 'new') {
            return { EC: 1, EM: 'Đơn hàng không ở trạng thái chờ xác nhận' };
        }

        order.status = 'confirmed';
        order.statusHistory.push({
            status: 'confirmed',
            timestamp: new Date(),
            note: 'Đơn hàng được xác nhận bởi shop'
        });
        await order.save();

        // Hủy timer auto-confirm
        const timer = autoConfirmTimers.get(orderId.toString());
        if (timer) {
            clearTimeout(timer);
            autoConfirmTimers.delete(orderId.toString());
        }

        return { EC: 0, EM: 'Đã xác nhận đơn hàng', data: order };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi xác nhận đơn hàng' };
    }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatusService = async (orderId, newStatus, note = '') => {
    try {
        const order = await Order.findById(orderId);
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };

        // Validate chuyển trạng thái hợp lệ
        const validTransitions = {
            'new': ['confirmed', 'cancelled'],
            'confirmed': ['preparing', 'cancelled'],
            'preparing': ['shipping'],
            'shipping': ['delivered'],
            'delivered': [],
            'cancelled': []
        };

        if (!validTransitions[order.status]?.includes(newStatus)) {
            return { EC: 1, EM: `Không thể chuyển từ "${order.status}" sang "${newStatus}"` };
        }

        order.status = newStatus;
        order.statusHistory.push({
            status: newStatus,
            timestamp: new Date(),
            note: note || `Chuyển sang trạng thái: ${newStatus}`
        });

        if (newStatus === 'delivered') {
            order.paymentStatus = 'paid';
        }

        await order.save();
        return { EC: 0, EM: 'Đã cập nhật trạng thái', data: order };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi cập nhật trạng thái đơn hàng' };
    }
};

// Hủy đơn hàng
const cancelOrderService = async (userId, orderId, reason = '') => {
    try {
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };

        if (order.status === 'new') {
            // Kiểm tra trong 30 phút
            const timeDiff = Date.now() - new Date(order.createdAt).getTime();
            const thirtyMinutes = 30 * 60 * 1000;

            if (timeDiff > thirtyMinutes) {
                return { EC: 1, EM: 'Đã quá 30 phút, không thể hủy đơn hàng' };
            }

            // Hủy trực tiếp
            order.status = 'cancelled';
            order.cancelReason = reason || 'Khách hàng yêu cầu hủy';
            order.statusHistory.push({
                status: 'cancelled',
                timestamp: new Date(),
                note: `Hủy bởi khách hàng: ${reason || 'Không có lý do'}`
            });

            // Hoàn lại stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity, sold: -item.quantity }
                });
            }

            // Hủy timer auto-confirm
            const timer = autoConfirmTimers.get(orderId.toString());
            if (timer) {
                clearTimeout(timer);
                autoConfirmTimers.delete(orderId.toString());
            }

            await order.save();
            return { EC: 0, EM: 'Đã hủy đơn hàng thành công', data: order };

        } else if (order.status === 'preparing') {
            // Gửi yêu cầu hủy cho shop
            order.statusHistory.push({
                status: 'cancel_request',
                timestamp: new Date(),
                note: `Khách hàng yêu cầu hủy: ${reason || 'Không có lý do'}`
            });
            order.cancelReason = reason || 'Khách hàng yêu cầu hủy';
            await order.save();
            return { EC: 0, EM: 'Đã gửi yêu cầu hủy đơn cho shop', data: order };

        } else {
            return { EC: 1, EM: 'Không thể hủy đơn hàng ở trạng thái hiện tại' };
        }
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Lỗi khi hủy đơn hàng' };
    }
};

module.exports = {
    createOrderService, getOrdersService, getOrderDetailService,
    confirmOrderService, updateOrderStatusService, cancelOrderService
};
