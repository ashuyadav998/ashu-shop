import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, qty })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
        return { success: true, message: 'Producto añadido al carrito' };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error('❌ Error añadiendo al carrito:', error);
      return { success: false, message: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, qty) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qty })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('❌ Error actualizando cantidad:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('❌ Error eliminando del carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('❌ Error vaciando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    if (cart && cart.items && Array.isArray(cart.items)) {
      return cart.items.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);
    }
    if (Array.isArray(cart)) {
      return cart.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);
    }
    return 0;
  };

  const getCartTotal = () => {
    if (cart && typeof cart.totalPrice === 'number') {
      return cart.totalPrice;
    }
    
    if (cart && cart.items && Array.isArray(cart.items)) {
      return cart.items.reduce((sum, item) => {
        const price = Number(item.price || item.product?.price || 0);
        const quantity = Number(item.qty || item.quantity || 0);
        return sum + (price * quantity);
      }, 0);
    }
    
    if (Array.isArray(cart)) {
      return cart.reduce((sum, item) => {
        const price = Number(item.price || item.product?.price || 0);
        const quantity = Number(item.qty || item.quantity || 0);
        return sum + (price * quantity);
      }, 0);
    }
    
    return 0;
  };

  return (
    <CartContext.Provider 
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCart,
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};