import React from 'react';

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto border-top">
      <div className="container p-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span className="text-muted">&copy; {new Date().getFullYear()} MAKHANA-SHOP. Todos los derechos reservados.</span>
        <div>
          <a href="https://facebook.com" className="text-muted me-3" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" className="text-muted me-3" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://github.com" className="text-muted me-3" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="mailto:info@ecomweb.com" className="text-muted">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;