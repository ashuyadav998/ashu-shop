import { Platform } from 'react-native';

const PRODUCTION_API = 'https://ashu-shop.vercel.app';

export const AUTH_URL = `${PRODUCTION_API}/api/auth`;
export const API_URL = `${PRODUCTION_API}/api`;

console.log('🚀 API Auth:', AUTH_URL);
console.log('🚀 API Base:', API_URL);