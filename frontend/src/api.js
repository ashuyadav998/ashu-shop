import axios from 'axios';

const API_BASE = 'https://ashu-shop.vercel.app/api';


// Productos
export const getProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

// Registro de usuario
export const register = async (userData) => {
  const res = await axios.post(`${API_BASE}/register`, userData);
  return res.data;
};

// Login de usuario
export const login = async (userData) => {
  const res = await axios.post(`${API_BASE}/login`, userData);
  return res.data;
};
