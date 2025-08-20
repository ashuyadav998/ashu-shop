import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../api';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../api'; // Asegúrate de tener esta función para obtener la URL de la imagen

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProducts().then(products => {
      const found = products.find(p => String(p.id) === id);
      setProduct(found);
    });
  }, [id]);

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row g-5 align-items-center">
        {/* Imagen del producto */}
        <div className="col-md-6 text-center">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Información del producto */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <h3 className="text-primary mb-3">${product.price.toFixed(2)}</h3>
          <p className="text-muted">{product.description}</p>

          {/* Botón de añadir al carrito */}
          <button
            className="btn btn-lg btn-primary mt-4"
            onClick={() => addToCart(product)}
          >
            <i className="fas fa-cart-plus me-2"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
