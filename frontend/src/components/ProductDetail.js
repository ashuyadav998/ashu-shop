import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts, getImageUrl } from '../api';
import { CartContext } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [randomProducts, setRandomProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProducts().then(products => {
      const found = products.find(p => String(p.id) === id);
      setProduct(found);

      // Productos aleatorios excluyendo el actual
      const otherProducts = products.filter(p => String(p.id) !== id);
      // Mezclamos aleatoriamente
      const shuffled = otherProducts.sort(() => 0.5 - Math.random());
      // Tomamos los primeros 4
      setRandomProducts(shuffled.slice(0, 4));
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

          {/* Stock disponible */}
          <p className="mb-2">
            <strong>Stock disponible:</strong> {product.stock}
          </p>

          {/* Botón de añadir al carrito */}
          <button
            className="btn btn-lg btn-primary mt-2"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <i className="fas fa-cart-plus me-2"></i> Añadir al carrito
          </button>
        </div>
      </div>

      {/* Productos aleatorios */}
      <div className="mt-5">
        <h3>También te puede interesar</h3>
        <div className="row">
          {randomProducts.map(p => (
            <div className="col-md-3 mb-3" key={p.id}>
              <div className="card h-100 shadow-sm">
                <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={getImageUrl(p.image)}
                    alt={p.name}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "150px" }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{p.name}</h6>
                    <p className="card-text text-primary">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
                <div className="card-body">
                  <button
                    className="btn btn-sm btn-primary w-100"
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
