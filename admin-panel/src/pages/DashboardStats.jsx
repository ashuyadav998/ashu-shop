import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { getAdminStats, getAllOrders } from '../services/adminApi';

const DashboardStats = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        getAdminStats(),
        getAllOrders()
      ]);
      
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5)); // Solo los 5 más recientes
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  const statsCards = [
    { 
      title: 'Total Usuarios', 
      value: stats.totalUsers, 
      change: '+12.5%', 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Pedidos Totales', 
      value: stats.totalOrders, 
      change: '+8.2%', 
      icon: ShoppingCart, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Pedidos Pendientes', 
      value: stats.pendingOrders, 
      change: '-3.1%', 
      icon: Package, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Ingresos Totales', 
      value: `€${stats.totalRevenue?.toFixed(2) || '0.00'}`, 
      change: '+23.4%', 
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Pedidos Recientes</h3>
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Ver todos →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay pedidos recientes</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order._id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => setActiveTab('orders')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                    {order.orderItems?.length || 0}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Pedido #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{order.user?.name || 'Cliente'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="font-bold text-gray-800">€{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveTab('orders')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <ShoppingCart size={32} className="mb-3" />
          <h4 className="font-bold text-lg">Gestionar Pedidos</h4>
          <p className="text-sm text-blue-100 mt-1">Ver y actualizar pedidos</p>
        </button>

        <button 
          onClick={() => setActiveTab('products')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Package size={32} className="mb-3" />
          <h4 className="font-bold text-lg">Gestionar Productos</h4>
          <p className="text-sm text-purple-100 mt-1">Añadir o editar productos</p>
        </button>

        <button 
          onClick={() => setActiveTab('users')}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Users size={32} className="mb-3" />
          <h4 className="font-bold text-lg">Gestionar Usuarios</h4>
          <p className="text-sm text-green-100 mt-1">Ver y administrar usuarios</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardStats;