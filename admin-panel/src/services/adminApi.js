import axios from 'axios';

const API_URL = 'https://ashu-shop.vercel.app/api';

// Obtener token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== ESTADÍSTICAS ====================
export const getAdminStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

// ==================== PEDIDOS ====================
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/orders`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/orders/${orderId}`,
      { status },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/orders/${orderId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error eliminando pedido:', error);
    throw error;
  }
};

// ==================== USUARIOS ====================
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/users/${userId}`,
      { role },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error actualizando rol:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

// ==================== PRODUCTOS ====================
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/products`,
      productData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/products/${productId}`,
      productData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/products/${productId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
};

// ==================== AUTENTICACIÓN ====================
export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};