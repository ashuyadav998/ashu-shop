import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:5000/api/orders/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'No se pudieron obtener los pedidos.');
        }

        const data = await response.json();
        setOrders(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
              <small className={`badge ${order.status === 'Enviado' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.status}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;