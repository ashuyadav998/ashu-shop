import Cart from '../models/Cart.js';
import Product from '../models/products.js';

// Obtener carrito del usuario
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('❌ Error obteniendo carrito:', error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Añadir producto al carrito
export const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    
    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      // Crear carrito nuevo
      cart = new Cart({
        user: req.user._id,
        items: [{
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: qty
        }]
      });
    } else {
      // Verificar si el producto ya está en el carrito
      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );
      
      if (itemIndex > -1) {
        // Actualizar cantidad
        cart.items[itemIndex].qty += qty;
      } else {
        // Añadir nuevo producto
        cart.items.push({
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: qty
        });
      }
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('❌ Error añadiendo al carrito:', error);
    res.status(500).json({ message: 'Error al añadir producto al carrito' });
  }
};

// Actualizar cantidad de un producto
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;
    
    if (qty < 1) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    
    cart.items[itemIndex].qty = qty;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('❌ Error actualizando carrito:', error);
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('❌ Error eliminando del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
};

// Vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('❌ Error vaciando carrito:', error);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};