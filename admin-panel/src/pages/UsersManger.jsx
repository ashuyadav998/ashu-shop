import React, { useState, useEffect } from 'react';
import { Search, Shield, User, Trash2, Edit, Mail, Calendar } from 'lucide-react';
import { getAllUsers, updateUserRole, deleteUser } from '../services/adminApi';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtrar por rol
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`¿Cambiar el rol de este usuario a "${newRole}"?`)) return;

    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
      alert('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando rol:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) return;

    try {
      await deleteUser(userId);
      await loadUsers();
      alert('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Usuarios</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <User size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Administradores</p>
              <p className="text-3xl font-bold mt-2">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Usuarios Regulares</p>
              <p className="text-3xl font-bold mt-2">
                {users.filter(u => u.role !== 'admin').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <User size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
          </select>
        </div>
      </div>

      {/* Users Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{filteredUsers.length}</span> de {users.length} usuarios
        </p>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron usuarios
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              {/* User Avatar & Info */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                  {getUserInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate flex items-center mt-1">
                    <Mail size={14} className="mr-1" />
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <Calendar size={12} className="mr-1" />
                    Registrado: {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div className="mb-4">
                <select 
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-2 cursor-pointer transition-colors ${
                    user.role === 'admin' 
                      ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100' 
                      : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <option value="user">👤 Usuario</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDeleteUser(user._id, user.name)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-1 font-medium"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>

              {/* User Stats */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>ID: {user._id.slice(-6)}</span>
                  <span className={`px-2 py-1 rounded ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Advertencia:</strong> Eliminar usuarios es una acción permanente. Asegúrate de que realmente quieres eliminar un usuario antes de confirmar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;