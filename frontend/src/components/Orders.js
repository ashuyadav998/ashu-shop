import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("token"); // o ID real

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, [userId]);

  return (
    <div className="container mt-4">
      <h2>📦 Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul className="list-group">
          {orders.map(order => (
            <li key={order._id} className="list-group-item">
              <p><strong>Fecha:</strong> {new Date(order.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              <p><strong>Productos:</strong></p>
              <ul>
                {order.productos.map(p => (
                  <li key={p.productId}>{p.nombre} x {p.cantidad}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;
