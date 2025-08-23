import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchOrders = async () => {
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("📦 Respuesta backend:", data); // 👈 para depuración

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pedidos');
      }

      // 👇 siempre tomamos data.orders
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [navigate]);


  if (loading) return <div className="text-center mt-5">Cargando pedidos...</div>;
  if (error) return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-5">
        No tienes pedidos aún. ¡Explora nuestra tienda!
        <p></p>
        <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
          Ir a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mis Pedidos</h2>
      <div className="list-group">
        {orders.map(order => (
  <div key={order._id} className="list-group-item list-group-item-action">
    <h5 className="mb-1">Pedido ID: {order._id}</h5>
    <small className="text-muted">
      Fecha: {new Date(order.createdAt).toLocaleDateString()}
    </small>
    <p className="mb-1">Total: ${order.totalPrice.toFixed(2)}</p>

    {order.orderItems && order.orderItems.length > 0 && (
      <ul>
        {order.orderItems.map((item, index) => (
          <li key={index}>
            {item.qty} x {item.name} (${item.price.toFixed(2)})
          </li>
        ))}
      </ul>
    )}
  </div>
))}

      </div>
    </div>
  );
}

export default OrdersPage;
