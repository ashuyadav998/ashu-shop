import React, { use, useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
  const { cart, increase, decrease, removeFromCart, totalPrice, clearCart } = useContext(CartContext);

  const [step, setStep] = useState(1); // 1: carrito, 2: datos, 3: pago, 4: confirmación
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    tarjeta: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmOrder = () => {
    setStep(4);
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  

  const token = localStorage.getItem('token');
  const location = useLocation();


  const handleProceedToPayment = () => {
    if (token) {
      setStep(2);
    } else {
      // Redirige a la página de login
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🛒 Tu Carrito de Compras</h2>

      {step === 1 && (
        <>
          {cart.length === 0 ? (
            <div className="alert alert-info text-center">
              Tu carrito está vacío. ¡Agrega algunos productos!
            </div>
          ) : (
            <>
              <table className="table table-bordered align-middle text-center shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr key={product.id}>
                      <td className="text-start">
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            marginRight: "10px",
                            borderRadius: "5px",
                          }}
                        />
                        {product.name}
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center">
                          <button
                            className="btn btn-sm btn-secondary me-2"
                            onClick={() => decrease(product.id)}
                          >
                            ➖
                          </button>
                          <span className="fw-bold">{product.quantity}</span>
                          <button
                            className="btn btn-sm btn-secondary ms-2"
                            onClick={() => increase(product.id)}
                          >
                            ➕
                          </button>
                          <td>

                          </td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFromCart(product.id)}
                          >
                            ❌
                          </button>
                        </div>
                      </td>
                      <td>${(product.price * product.quantity).toFixed(2)}</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end mt-4">
                <h4>
                  Total: <span className="text-success">${totalPrice.toFixed(2)}</span>
                </h4>
                <button
      className="btn btn-success mt-2"
      onClick={handleProceedToPayment}
    >
      💳 Proceder al Pago
    </button>
              </div>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <div className="card shadow p-4">
          <h4>📋 Datos de Envío</h4>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            className="form-control my-2"
            value={formData.nombre}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="form-control my-2"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección de entrega"
            className="form-control my-2"
            value={formData.direccion}
            onChange={handleInputChange}
          />
          <div className="text-end">
            <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>
              ⬅ Volver
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              Siguiente ➡
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card shadow p-4">
          <h4>💳 Método de Pago</h4>
          <input
            type="text"
            name="tarjeta"
            placeholder="Número de tarjeta (ficticio)"
            className="form-control my-2"
            value={formData.tarjeta}
            onChange={handleInputChange}
          />
          <div className="text-end">
            <button className="btn btn-secondary me-2" onClick={() => setStep(2)}>
              ⬅ Volver
            </button>
            <button className="btn btn-success" onClick={handleConfirmOrder}>
              Confirmar Pedido ✅
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="alert alert-success text-center p-4 shadow">
          <h3>🎉 ¡Gracias por tu compra!</h3>
          <p>Tu pedido ha sido procesado y pronto lo recibirás en tu dirección.</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
