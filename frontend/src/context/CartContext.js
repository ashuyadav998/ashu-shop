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

  // ⬇️ CARGAR CARRITO AL INICIAR Y CUANDO EL TOKEN CAMBIE
  useEffect(() => {
    loadCart();
    
    // Recargar carrito cada 30 segundos para mantener sincronizado
    const interval = setInterval(() => {
      loadCart();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No hay token, carrito vacío');
        setCart({ items: [], totalPrice: 0 });
        return;
      }

      console.log('🔄 Cargando carrito desde el servidor...');
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Carrito cargado:', data);
        setCart(data);
      } else if (response.status === 401) {
        // Token expirado, limpiar
        console.log('🚪 Token expirado');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setCart({ items: [], totalPrice: 0 });
      } else {
        console.log('⚠️ Error cargando carrito:', response.status);
      }
    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return { 
          success: false, 
          message: 'Debes iniciar sesión para añadir productos' 
        };
      }

      console.log('➕ Añadiendo al carrito:', { productId, qty });
      
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
        console.log('✅ Producto añadido:', data);
        setCart(data);
        return { success: true, message: 'Producto añadido al carrito' };
      } else {
        const error = await response.json();
        console.log('❌ Error añadiendo:', error);
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
      
      if (!token) return;

      console.log('🔄 Actualizando cantidad:', { productId, qty });
      
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
        console.log('✅ Cantidad actualizada:', data);
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
      
      if (!token) return;

      console.log('🗑️ Eliminando del carrito:', productId);
      
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Producto eliminado:', data);
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
      
      if (!token) return;

      console.log('🗑️ Vaciando carrito...');
      
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Carrito vaciado:', data);
        setCart(data);
      }
    } catch (error) {
      console.error('❌ Error vaciando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ FUNCIÓN PARA SINCRONIZAR MANUALMENTE
  const syncCart = async () => {
    console.log('🔄 Sincronizando carrito manualmente...');
    await loadCart();
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
        syncCart, // ⬅️ Nueva función para sincronizar manualmente
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};