import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.getCart();
      setItems(data);
    } catch {
      setItems([]);
    }
  }, []);

  async function addItem(productId, quantity = 1) {
    await api.addToCart(productId, quantity);
    await refreshCart();
  }

  async function removeItem(cartItemId) {
    await api.removeFromCart(cartItemId);
    await refreshCart();
  }

  async function placeOrder(shippingDetails) {
    const result = await api.checkout(shippingDetails);
    setItems([]);
    return result;
  }

  return (
    <CartContext.Provider value={{ items, refreshCart, addItem, removeItem, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
