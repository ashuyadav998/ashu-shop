import products from '../models/products.js';

export const getProducts = (req, res) => {
  res.json(products);
};