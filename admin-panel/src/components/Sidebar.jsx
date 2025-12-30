import React from 'react';
import { Home, ShoppingCart, Users, Package, Settings, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col shadow-xl`}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-700">
        {sidebarOpen && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-slate-700 text-white shadow-lg transform scale-105' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
            {activeTab === item.id && sidebarOpen && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        {sidebarOpen && (
          <div className="px-4 py-3 bg-slate-700/50 rounded-lg mb-2">
            <p className="text-xs text-slate-400">Conectado como</p>
            <p className="font-semibold text-sm">Admin</p>
          </div>
        )}
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-900/50 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;