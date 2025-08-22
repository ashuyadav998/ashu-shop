import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Navbar({ onSearch }) {
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowPopup(false);
    navigate('/');
  };

  // Cierra el popup si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ background: 'linear-gradient(90deg, #fff, #f8f9fa)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Makhana-Shop</Link>

        {/* Botón hamburguesa responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex mx-lg-auto my-2 my-lg-0" style={{ maxWidth: 400, width: '100%' }}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar"
              onChange={e => onSearch(e.target.value)}
              style={{ borderRadius: '20px' }}
            />
          </form>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-2">
            <li className="nav-item position-relative">
              <Link to="/cart" className="btn btn-warning position-relative" title="Carrito" style={{ borderRadius: '50%' }}>
                <i className="fas fa-shopping-cart"></i>
                {totalItems > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.7rem' }}>
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>

            {localStorage.getItem('token') ? (
              <li className="nav-item" ref={popupRef} style={{ position: 'relative' }}>
                <button
                  className="btn btn-outline-secondary rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                  onClick={() => setShowPopup(!showPopup)}
                >
                  <i className="fas fa-user"></i>
                </button>

                {showPopup && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '1rem',
                    width: '200px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <p className="fw-bold mb-2">Hola, {user?.name || 'Usuario'}</p>
                    <Link 
                      to="/orders" 
                      className="btn btn-light text-start" 
                      onClick={() => setShowPopup(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <Link 
                      to="/profile" 
                      className="btn btn-light text-start" 
                      onClick={() => setShowPopup(false)}
                    >
                      Configuración
                    </Link>
                    <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" state={{ backgroundLocation: location }} className="btn btn-primary rounded-pill">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" state={{ backgroundLocation: location }} className="btn btn-outline-primary rounded-pill">Registro</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;