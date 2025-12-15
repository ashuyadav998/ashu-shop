import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import ordersRoutes from './src/routes/orders.js';
import errorHandler from './src/middlewares/errorHandler.js';
import connectDB from './src/config/db.js';
import cartRoutes from './src/routes/cartRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔹 CORS - UNA SOLA VEZ (quita las dos configuraciones duplicadas)
app.use(cors({
  origin: '*', // Acepta de cualquier origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 🔹 Middlewares
app.use(express.json());

// 🔹 Conectar DB
connectDB().catch(err => console.error('❌ DB connection error:', err));

// 🔹 Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, 'src/public')));

// 🔹 Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // ⬅️ CAMBIÉ /api a /api/auth
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/admin', adminRoutes)




// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.send({ activeStatus: true, error: false });
});

// 🔹 Manejo de errores centralizado
app.use(errorHandler);

// 🔹 Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Accesible en:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://10.0.2.2:${PORT} (emulador Android)`);
  console.log(`   - http://192.168.1.148:${PORT} (dispositivo físico)`);
});