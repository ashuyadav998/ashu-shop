import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Simulated local data instead of a backend call
  const localOrders = [
    {
      _id: '65f3f0d4b9a1e0a2c8a7c6d5',
      total: 75.50,
      createdAt: '2025-03-14T10:30:00Z',
      items: [
        { productName: 'Gaming Mouse', quantity: 1, price: 45.00 },
        { productName: 'Keyboard Mat', quantity: 2, price: 15.25 },
      ],
    },
    {
      _id: '65f3f1e5c8b2f1b3d9a8c7e6',
      total: 120.00,
      createdAt: '2025-03-10T14:00:00Z',
      items: [
        { productName: 'Mechanical Keyboard', quantity: 1, price: 120.00 },
      ],
    },
  ];

  useEffect(() => {
    // Simulate a successful API call with a short delay
    const simulateFetch = () => {
      setLoading(true);
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Use the local data instead of fetching from the server
        setOrders(localOrders);
        setError(null);
        setLoading(false);
      }, 500); // 500ms delay to simulate network latency
    };

    simulateFetch();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-5">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center mt-5">No tienes pedidos aún. ¡Explora nuestra tienda!</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mis Pedidos</h2>
      <div className="list-group">
        {orders.map(order => (
          <div key={order._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Pedido ID: {order._id}</h5>
              <small className="text-muted">Fecha: {new Date(order.createdAt).toLocaleDateString()}</small>
              <p className="mb-1">Total: ${order.total.toFixed(2)}</p>
            </div>
            {/* You can add more details here, like a link to a detailed order page */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;