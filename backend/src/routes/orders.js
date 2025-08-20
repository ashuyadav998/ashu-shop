import express from "express";
import { createOrder, getOrders, verifyToken } from "../controllers/orderController.js";

const router = express.Router();

// 🔹 Ruta para crear un pedido (requiere usuario autenticado)
router.post("/", verifyToken, createOrder);

// 🔹 Ruta para obtener todos los pedidos (puedes limitar solo a admin si quieres)
router.get("/", verifyToken, getOrders);

export default router;
