import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: (next[idx].quantity || 0) + qty };
        return next;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const increase = (id) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: (p.quantity || 0) + 1 } : p));
  };

  const decrease = (id) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) } : p));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((s, p) => s + (p.quantity || 0), 0);
  const totalPrice = cart.reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      cart, setCart, addToCart, removeFromCart, increase, decrease, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}
