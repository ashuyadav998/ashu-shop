import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from '../components/ProductList';
import LoginForm from '../pages/Login';
import RegisterForm from '../pages/Register';
import HomePage from '../pages/Home';
import Perfil from '../pages/Setting';
import Cart from '../components/Cart';
import ProductDetail from '../components/ProductDetail';
import { useState } from 'react';



function AppRoutes() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      {/* <Route path="/profile" element={<Perfil />} /> */}
        <Route path="/" element={<ProductList searchTerm={searchTerm} />} />

      <Route path="/register" element={<RegisterForm />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      {/* Agrega más rutas según tus componentes */}
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default AppRoutes;
