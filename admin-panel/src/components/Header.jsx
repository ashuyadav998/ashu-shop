import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = ({ activeTab }) => {
  const getTitleAndDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard', description: 'Visión general de tu tienda' };
      case 'orders':
        return { title: 'Gestión de Pedidos', description: 'Administra todos los pedidos' };
      case 'products':
        return { title: 'Gestión de Productos', description: 'Administra tu catálogo' };
      case 'users':
        return { title: 'Gestión de Usuarios', description: 'Administra usuarios y roles' };
      case 'settings':
        return { title: 'Configuración', description: 'Ajustes del sistema' };
      default:
        return { title: 'Dashboard', description: 'Bienvenido de nuevo' };
    }
  };

  const { title, description } = getTitleAndDescription();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              A
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;