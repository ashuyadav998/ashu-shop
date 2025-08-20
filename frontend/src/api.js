import axios from 'axios';

//  const API_BASE = 'http://localhost:5000/api';
const API_BASE='https://ashu-shop.vercel.app/api'


// Productos
export const getProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

// Registro de usuario
export const register = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/register`, userData);
  return res.data;
};

// Login de usuario
export const login = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/login`, userData);
  return res.data;
};

// src/utils/getImageUrl.js
const API_URL = "https://ashu-shop.vercel.app"; // tu backend en producción
// const API_URL = "http://localhost:5000"; // ⚡ alterna si desarrollas en local

export function getImageUrl(imagePath) {
  if (!imagePath) return ""; 

  // Si ya es una URL completa (empieza con http)
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Si es una ruta relativa de tu backend
  return `${API_URL}${imagePath}`;
}