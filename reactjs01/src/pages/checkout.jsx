import React, { useContext, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { createOrderAPI } from '../util/api';
import { formatPrice } from '../util/helpers';
import { Form, Input, Radio, message, Spin } from 'antd';
import { CreditCardOutlined, HomeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read discount from Cart state
  const discount = location.state?.discount || 0;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice - discount + tax;

  const handlePlaceOrder = async (values) => {
    if (cartItems.length === 0) {
      message.error('Giỏ hàng của bạn đang trống!');
      return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        paymentMethod: values.paymentMethod,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
          storage: item.storage,
          color: item.color
        })),
        totalPrice: grandTotal
      };

      const res = await createOrderAPI(orderData);
      if (res) {
        message.success('Đặt hàng thành công! Đơn hàng đang được xử lý.');
        await clearCart();
        navigate('/orders');
      }
    } catch (err) {
      message.error(err.message || 'Lỗi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không có sản phẩm nào để thanh toán!</h2>
        <Link to="/search" className="inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Secure Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Billing Details Form */}
        <div className="flex-1 w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="font-extrabold text-[18px] text-indigo-950 flex items-center gap-2">
            <HomeOutlined />
            <span>Delivery Information</span>
          </h3>

          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlaceOrder}
            initialValues={{ paymentMethod: 'COD' }}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Full Name</span>}
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên nhận hàng!' }]}
            >
              <Input placeholder="John Doe" className="bg-slate-50 border-slate-200" />
            </Form.Item>

            <Form.Item
              label={<span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Phone Number</span>}
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="0901234567" className="bg-slate-50 border-slate-200" />
            </Form.Item>

            <Form.Item
              label={<span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Delivery Address</span>}
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng!' }]}
            >
              <Input.TextArea placeholder="123 Street, District 1, HCMC" rows={3} className="bg-slate-50 border-slate-200" />
            </Form.Item>

            <Form.Item
              label={<span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Payment Method</span>}
              name="paymentMethod"
            >
              <Radio.Group className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Radio.Button 
                  value="COD" 
                  className="h-16 flex items-center justify-center rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:text-indigo-600 text-center"
                >
                  COD (Cash on Delivery)
                </Radio.Button>
                <Radio.Button 
                  value="E-Wallet" 
                  className="h-16 flex items-center justify-center rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:text-indigo-600 text-center"
                >
                  E-Wallet (Momo / VNPay)
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item className="pt-4 mb-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 transition-all duration-200"
              >
                {isSubmitting ? (
                  <Spin size="small" className="text-white" />
                ) : (
                  <>
                    <CreditCardOutlined />
                    <span>Place Order ({formatPrice(grandTotal)})</span>
                  </>
                )}
              </button>
            </Form.Item>
          </Form>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="w-full lg:w-[380px] shrink-0 bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
          <h3 className="font-extrabold text-[18px] text-indigo-950">Review Items</h3>

          {/* List of items */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 text-[13px]">
                  <h4 className="font-extrabold text-indigo-950 truncate">{item.name}</h4>
                  <p className="text-slate-400 font-bold">{item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="text-[13px] font-extrabold text-indigo-950">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3.5 text-[13px] font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="text-indigo-950">{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-500 font-bold">
                <span>Discount Applied</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-emerald-500 font-bold uppercase">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (8%)</span>
              <span className="text-indigo-950">{formatPrice(tax)}</span>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline text-indigo-950">
              <span className="font-extrabold text-[15px]">Grand Total</span>
              <span className="text-indigo-600 font-extrabold text-[20px]">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 uppercase pt-2">
            <SafetyCertificateOutlined className="text-indigo-500 text-sm" />
            <span>SSL Certified 256-bit Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
