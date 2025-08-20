import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Order from "../models/order.js";

// Middleware para verificar token
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: "Usuario no encontrado" });
    next();
  } catch (err) {
    console.error("❌ Error en verifyToken:", err);
    return res.status(403).json({ error: "Token inválido" });
  }
};

// Crear un nuevo pedido
export const createOrder = async (req, res) => {
  try {
    const order = new Order({
      user: req.user._id,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Error al crear pedido:", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los pedidos
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error al obtener pedidos!" });
  }
};
