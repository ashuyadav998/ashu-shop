import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from '../components/ProductList';
import LoginForm from '../pages/Login';
import RegisterForm from '../pages/Register';
import HomePage from '../pages/Home';

import Cart from '../components/Cart';
import ProductDetail from '../components/ProductDetail';
import { useState } from 'react';
import ProfilePage from '../pages/Profile';
import OrdersPage from '../pages/OrdersPage';



function AppRoutes() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      {/* <Route path="/profile" element={<Perfil />} /> */}
        <Route path="/" element={<ProductList searchTerm={searchTerm} />} />
        <Route path="/profile" element={<ProfilePage />} />
<Route path="/orders" element={<OrdersPage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      {/* Agrega más rutas según tus componentes */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/search" element={<ProductList searchTerm={searchTerm} />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
      
      {/* Puedes agregar más rutas aquí */}
    </Routes>
  );
}

export default AppRoutes;
