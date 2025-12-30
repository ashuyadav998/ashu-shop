import { useState, useEffect } from 'react';
import { getAdminStats, getAllOrders, getAllUsers, getAllProducts } from '../services/adminApi';

/**
 * Hook personalizado para gestionar datos del dashboard de admin
 */
export const useAdminData = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los datos
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, ordersData, usersData, productsData] = await Promise.all([
        getAdminStats(),
        getAllOrders(),
        getAllUsers(),
        getAllProducts()
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error cargando datos del admin:', err);
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar solo estadísticas
  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Cargar solo pedidos
  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  // Cargar solo usuarios
  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  // Cargar solo productos
  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  // Refrescar datos cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    orders,
    users,
    products,
    loading,
    error,
    refresh: loadAllData,
    loadStats,
    loadOrders,
    loadUsers,
    loadProducts
  };
};