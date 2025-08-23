import express from 'express';
import { registerUser, loginUser, deleteUser, changePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/me', authMiddleware, deleteUser);
// Cambiar contraseña (sin cerrar sesión)
router.put('/change-password', authMiddleware, changePassword);


export default router;