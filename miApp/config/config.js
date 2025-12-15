// config.js
import { Platform } from 'react-native';

// ⚠️ IMPORTANTE: Cambia esta IP por la tuya
// Para obtenerla: ipconfig (Windows) o ifconfig (Mac/Linux)
const LOCAL_IP = '192.168.1.150'; // ⬅️ CAMBIA ESTO

export const API_URL = __DEV__ 
  ? `http://${LOCAL_IP}:5000/api/auth`  // Desarrollo (dispositivo físico)
  : 'https://tu-backend-produccion.com/api/auth'; // Producción

console.log('🚀 Conectando a:', API_URL);