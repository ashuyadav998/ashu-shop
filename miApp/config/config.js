import { Platform } from 'react-native';

// ⚠️ CAMBIA ESTO POR TU URL DE NETLIFY
const PRODUCTION_API = 'https://https://ashu-shop.vercel.app/';


export const API_URL = __DEV__ 
`${PRODUCTION_API}/api/auth`;       // Producción

console.log('🚀 Conectando a:', API_URL);