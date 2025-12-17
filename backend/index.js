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
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import mongoSanitize from 'express-mongo-sanitize';
import DOMPurify from 'isomorphic-dompurify';

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Usa en las rutas:
// router.post('/login', validateLogin, loginUser);
// const sanitizedInput = DOMPurify.sanitize(userInput);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔹 CORS - UNA SOLA VEZ (quita las dos configuraciones duplicadas)
app.use(cors({
  origin: ['https://ashu-shop.netlify.app','https://ashu-dashboard.netlify.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 🔹 Middlewares
app.use(express.json());
app.use(mongoSanitize());

// 🔹 Conectar DB
connectDB().catch(err => console.error('❌ DB connection error:', err));

// 🔹 Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, 'src/public')));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP
  message: 'Demasiadas peticiones, intenta de nuevo más tarde'
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limit para login (más estricto)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Solo 5 intentos de login cada 15 minutos
  message: 'Demasiados intentos de login, intenta más tarde',
  skipSuccessfulRequests: true
});


// 🔹 Rutas API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // ⬅️ CAMBIÉ /api a /api/auth
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/admin', adminRoutes)
app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', loginLimiter);



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
});