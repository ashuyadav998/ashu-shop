import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';

function Navbar({ onSearch }) {

  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = storedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    // Detectar cambios desde otros componentes
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');  

  sessionStorage.setItem('user', JSON.stringify(storedUser));
    if (storedUser) {
      setShowDropdown(false);     
  }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Makhana-Shop</Link>
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
          <form
            className="d-flex mx-lg-auto my-2 my-lg-0"
            style={{ maxWidth: 400, width: '100%' }}
            onSubmit={e => { e.preventDefault(); }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar"
              onChange={e => onSearch(e.target.value)}
            />
          </form>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-2">
            <li className="nav-item position-relative">
              <Link to="/cart" className="btn btn-outline-primary" title="Carrito">
                <i className="fas fa-shopping-cart"></i>
                {totalItems > 0 && (
                  <span
                    className="badge bg-danger position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>

            {localStorage.getItem('token') ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px', padding: 0 }}
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded={showDropdown}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <i className="fas fa-user"></i>
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end${showDropdown ? ' show' : ''}`}
                  aria-labelledby="profileDropdown"
                  style={{ minWidth: '180px' }}
                >
                  <li>
                    <span className="dropdown-item-text fw-bold">
                      {user?.name || 'Usuario'}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-primary" title="Login">
                    <i className="fas fa-sign-in-alt"></i>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-outline-primary" title="Registro">
                    <i className="fas fa-user-plus"></i>
                  </Link>
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
