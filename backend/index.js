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

// 🔹 CORS: permitir varios orígenes
const allowedOrigins = [
  'https://makhana-shop.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback){
    // permitir solicitudes sin origen (como Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🔹 Conectar DB
connectDB().catch(err => console.error('DB connection error:', err));

// 🔹 Servir imágenes
app.use('/images', express.static(path.join(__dirname, 'src/public')));

// 🔹 Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.send({ activeStatus: true, error: false });
});

// 🔹 Middleware para capturar cualquier error y enviar CORS
app.use((err, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

// 🔹 Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
