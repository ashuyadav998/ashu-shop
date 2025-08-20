import React from 'react';
import ProductList from '../components/ProductList';

import { useState } from 'react';



export function logout() {
  localStorage.removeItem('token');
  // Puedes limpiar otros datos si los guardas (usuario, carrito, etc.)
  window.location.href = '/login'; // Redirige al login
}

function HomePage() {
  const [searchTerm, 
    setSearchTerm
  ] = useState("");
  return (
    <>
      
      {/* Main Content */}
      <div className="container mt-5">
        <h1 className="mb-4">Bienvenido a Mi Tienda</h1>
        <p className="lead">Explora nuestros productos destacados:</p>

        <ProductList searchTerm={searchTerm} />
       
      </div>
     
    </>
  );
}

export default HomePage;
