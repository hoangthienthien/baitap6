const {
    createOrderService, getOrdersService, getOrderDetailService,
    confirmOrderService, updateOrderStatusService, cancelOrderService
} = require('../services/orderService');

const createOrder = async (req, res) => {
    const data = await createOrderService(req.user._id, req.body);
    return res.status(200).json(data);
};

const getOrders = async (req, res) => {
    const { status } = req.query;
    const data = await getOrdersService(req.user._id, status);
    return res.status(200).json(data);
};

const getOrderDetail = async (req, res) => {
    const data = await getOrderDetailService(req.user._id, req.params.orderId);
    return res.status(200).json(data);
};

const confirmOrder = async (req, res) => {
    const data = await confirmOrderService(req.params.orderId);
    return res.status(200).json(data);
};

const updateOrderStatus = async (req, res) => {
    const { status, note } = req.body;
    const data = await updateOrderStatusService(req.params.orderId, status, note);
    return res.status(200).json(data);
};

const cancelOrder = async (req, res) => {
    const { reason } = req.body;
    const data = await cancelOrderService(req.user._id, req.params.orderId, reason);
    return res.status(200).json(data);
};

module.exports = { createOrder, getOrders, getOrderDetail, confirmOrder, updateOrderStatus, cancelOrder };
