import { Platform } from 'react-native';

// ⚠️ CAMBIA ESTO POR TU URL DE NETLIFY
const PRODUCTION_API = 'https://https://ashu-shop.vercel.app/';

const LOCAL_IP = '192.168.1.148';

export const API_URL = __DEV__ 
  ? `http://${LOCAL_IP}:5000/api/auth`  // Desarrollo local
  : `${PRODUCTION_API}/api/auth`;       // Producción

console.log('🚀 Conectando a:', API_URL);