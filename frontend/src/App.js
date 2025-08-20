import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/routes";
import { CartProvider } from "./context/CartContext";  // <-- Import CartProvider, not CartContext
import { useState } from "react";
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    
    <CartProvider>
      <Router>
        {/* Navbar fijo */}
        <Navbar onSearch={setSearchTerm} />
      

        {/* Contenido con espacio para el navbar */}
        <div style={{ minHeight: "calc(100vh - 165px)" }}>
          <AppRoutes />
        </div>

        {/* Footer fijo al final */}
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
