import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error al cargar pedidos:", err));
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>📦 Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul className="list-group">
          {orders.map(order => (
            <li key={order._id} className="list-group-item">
              <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
              <p><strong>Productos:</strong></p>
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.product}>
                    {item.name} x {item.qty}
                  </li>
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
