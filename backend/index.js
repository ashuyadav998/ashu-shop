import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';
import connectDB from './src/config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔹 Detectar entorno y configurar CORS
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://makhana-shop.netlify.app']
    : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🔹 Conectar DB
connectDB();

// 🔹 Servir imágenes
app.use('/images', express.static(path.join(__dirname, 'src/public')));

// 🔹 Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.send({ activeStatus: true, error: false });
});

// 🔹 Manejo de errores
app.use(errorHandler);

// 🔹 Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
