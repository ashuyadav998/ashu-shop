import React, { useEffect, useState, useContext } from "react";
import { getProducts, getImageUrl } from "../api";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductList({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15; // Mostrar 16 productos por página

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // Paginación: productos visibles
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <Link
                  to={`/product/${product.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={getImageUrl(product.image)}
                    className="card-img-top"
                    alt={product.name || "Producto"}
                    style={{ objectFit: "cover", height: "200px", cursor: "pointer" }}
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

      {/* Botones de paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center my-4 gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="align-self-center">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
