import { createContext, useState, useContext, useCallback } from 'react';
import { getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi } from '../../util/api';
import { AuthContext } from './auth.context';

export const CartContext = createContext({
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
    cartLoading: false,
});

export const CartWrapper = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => {
        const price = item.productId?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    const fetchCart = useCallback(async () => {
        setCartLoading(true);
        try {
            const res = await getCartApi();
            if (res?.EC === 0 && res.data?.items) {
                setCartItems(res.data.items);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            console.log('Fetch cart error:', err);
        }
        setCartLoading(false);
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        const res = await addToCartApi(productId, quantity);
        if (res?.EC === 0 && res.data?.items) {
            setCartItems(res.data.items);
        }
        return res;
    };

    const updateQuantity = async (productId, quantity) => {
        const res = await updateCartItemApi(productId, quantity);
        if (res?.EC === 0 && res.data?.items) {
            setCartItems(res.data.items);
        }
        return res;
    };

    const removeItem = async (productId) => {
        const res = await removeCartItemApi(productId);
        if (res?.EC === 0 && res.data?.items) {
            setCartItems(res.data.items);
        }
        return res;
    };

    const clearCart = async () => {
        const res = await clearCartApi();
        if (res?.EC === 0) {
            setCartItems([]);
        }
        return res;
    };

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal, cartLoading,
            fetchCart, addToCart, updateQuantity, removeItem, clearCart, setCartItems
        }}>
            {props.children}
        </CartContext.Provider>
    );
};
