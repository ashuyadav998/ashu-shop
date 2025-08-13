import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import productRoutes from './src/routes/productRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import { resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({
  origin: 'https://makhana-shop.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar DB
connectDB();

// Servir imágenes
app.use('/images', express.static(resolve(__dirname, 'public')));

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.get('/',(req,res)=>{
  res.send({
    activeStatus:true,
    error:false,
  })
})
// Manejo de errores
app.use(errorHandler);

app.get('/',(req,res)=>{
  res.send({
    activeStatus:true,
    error:false,
  })
})

// Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
