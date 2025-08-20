import React, { useEffect, useState, useContext } from "react";
import { getProducts } from "../api";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../api"; // Asegúrate de tener esta función para obtener la URL de la imagen
function ProductList({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );


  return (
    <div className="container mt-4">
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={getImageUrl(product.image)}
                    className="card-img-top"
                    alt={product.name || "Producto"}
                    style={{ objectFit: "cover", height: "200px", cursor: 'pointer' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                  </div>
                </Link>
                <div className="card-body d-flex flex-column">
                  <h3 className="card-text">${product.price.toFixed(2)}</h3>
                  <p className="card-text">{product.description}</p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => addToCart(product)}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <p className="text-muted">No se encontraron productos 😢</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
