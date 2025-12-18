import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Rutas
import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import ordersRoutes from './src/routes/orders.js';
import cartRoutes from './src/routes/cartRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://ashu-shop.netlify.app',
  'https://ashu-dashboard.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin origin (apps móviles, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error MongoDB:', err));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
}
