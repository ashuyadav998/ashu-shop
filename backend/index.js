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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔹 CORS
const allowedOrigins = [
  'https://makhana-shop.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('CORS: Origin no permitido'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 🔹 Middlewares
app.use(express.json());

// 🔹 Conectar DB
connectDB().catch(err => console.error('❌ DB connection error:', err));

// 🔹 Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, 'src/public')));

// 🔹 Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes); // ✅ Aquí se manejan todos los pedidos

// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.send({ activeStatus: true, error: false });
});

// 🔹 Manejo de errores centralizado
app.use(errorHandler);

// 🔹 Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
