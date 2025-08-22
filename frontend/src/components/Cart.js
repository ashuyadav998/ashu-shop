import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getImageUrl } from "../api";



function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, increase, decrease, removeFromCart, totalPrice, clearCart } = useContext(CartContext);

  const [step, setStep] = useState(1); // 1: carrito, 2: datos, 3: pago, 4: confirmación
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    instrucciones: "",
    tarjeta: "",
    expiracion: "",
    cvc: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToPayment = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setStep(2);
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

const handleConfirmOrder = async () => {
  try {
    const token = localStorage.getItem("token");

    // ✅ Verificamos que haya token
    if (!token) {
      alert("Debes iniciar sesión para realizar un pedido.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalPrice,
      shipping: formData,
    };

    const res = await fetch("http://localhost:5000/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // ⚠ important
  },
  body: JSON.stringify(orderData),
});

    if (res.status === 401) {
      // Token inválido o expirado
      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      localStorage.removeItem("token");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!res.ok) {
      throw new Error("Error al crear el pedido");
    }

    const data = await res.json();
    console.log("✅ Pedido guardado:", data);

    setStep(4);
    setTimeout(() => clearCart(), 2000);

  } catch (err) {
    console.error("❌ Error:", err);
    alert("Hubo un problema al procesar tu pedido.");
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
              <p></p>
              <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
                Ir a la Tienda
              </button>
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
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px", borderRadius: "5px" }}
                        />
                        {product.name}
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center">
                          <button className="btn btn-sm btn-secondary me-2" onClick={() => decrease(product.id)}>➖</button>
                          <span className="fw-bold">{product.quantity}</span>
                          <button className="btn btn-sm btn-secondary ms-2" onClick={() => increase(product.id)}>➕</button>
                          <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFromCart(product.id)}>❌</button>
                        </div>
                      </td>
                      <td>${(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end mt-4">
                <h4>Total: <span className="text-success">${totalPrice.toFixed(2)}</span></h4>
                <button className="btn btn-success mt-2" onClick={handleProceedToPayment}>💳 Proceder al Pago</button>
              </div>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <div className="card shadow p-4">
          <h4 className="mb-3">📋 Datos de Envío</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" name="nombre" placeholder="Tu nombre" className="form-control" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Apellido</label>
              <input type="text" name="apellido" placeholder="Tu apellido" className="form-control" value={formData.apellido} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" name="email" placeholder="correo@ejemplo.com" className="form-control" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input type="tel" name="telefono" placeholder="Ej: +34 600 123 456" className="form-control" value={formData.telefono} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input type="text" name="direccion" placeholder="Calle, número, piso, etc." className="form-control" value={formData.direccion} onChange={handleInputChange} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Ciudad</label>
              <input type="text" name="ciudad" placeholder="Ciudad" className="form-control" value={formData.ciudad} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Código Postal</label>
              <input type="text" name="codigoPostal" placeholder="Ej: 28001" className="form-control" value={formData.codigoPostal} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Instrucciones adicionales (opcional)</label>
            <textarea name="instrucciones" placeholder="Por ejemplo: dejar en conserjería, llamar al llegar, etc." className="form-control" value={formData.instrucciones} onChange={handleInputChange} rows={2} />
          </div>
          <div className="text-end">
            <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>⬅ Volver</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Siguiente ➡</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card shadow p-4">
          <h4 className="mb-3">💳 Método de Pago</h4>
          <div className="mb-3">
            <label className="form-label">Número de tarjeta</label>
            <input type="text" name="tarjeta" placeholder="1234 5678 9012 3456" className="form-control" value={formData.tarjeta} onChange={handleInputChange} maxLength={19} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de expiración</label>
              <input type="text" name="expiracion" placeholder="MM/AA" className="form-control" value={formData.expiracion} onChange={handleInputChange} maxLength={5} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">CVC / CVV</label>
              <input type="text" name="cvc" placeholder="123" className="form-control" value={formData.cvc} onChange={handleInputChange} maxLength={4} required />
            </div>
          </div>
          <div className="text-end">
            <button className="btn btn-secondary me-2" onClick={() => setStep(2)}>⬅ Volver</button>
            <button className="btn btn-success" onClick={handleConfirmOrder}>Confirmar Pedido ✅</button>
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
