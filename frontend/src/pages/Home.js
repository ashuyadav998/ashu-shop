import React, { useState } from 'react';
import ProductList from '../components/ProductList';

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Banner principal */}
      <div 
        className="banner d-flex flex-column justify-content-center align-items-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1598514982292-cda6451c872d?auto=format&fit=crop&w=1950&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '350px',
          position: 'relative'
        }}
      >
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '15px' }}>
          <h1 className="display-4 fw-bold" style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            Bienvenido a Makhana-Shop
          </h1>
          <p className="lead" style={{ color: '#f0f0f0' }}>
            Descubre nuestros productos destacados y ofertas exclusivas
          </p>
          <a href="#productos" className="btn btn-warning btn-lg mt-3">
            Ver Productos
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5" id="productos" style={{ backgroundColor: '#f9f9f9', borderRadius: '15px', padding: '30px' }}>
        <h2 className="mb-4" style={{ color: '#333' }}>Nuestros Productos</h2>
        <ProductList searchTerm={searchTerm} />
      </div>
    </>
  );
}

export default HomePage;
