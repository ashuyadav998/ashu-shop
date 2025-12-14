import Order from "../models/order.js";

// Crear un nuevo pedido
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No hay productos en el pedido" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders }); // 👈 devolvemos objeto con la key "orders"
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err);
    res.status(500).json({ message: "Error al obtener pedidos!" });
  }
};