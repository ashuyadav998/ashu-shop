import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardStats from './DashboardStats';
import OrdersManager from './OrdersManager';
import ProductsManager from './ProductsManager';
import UsersManager from './UsersManger';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats setActiveTab={setActiveTab} />;
      case 'orders':
        return <OrdersManager />;
      case 'products':
        return <ProductsManager />;
      case 'users':
        return <UsersManager />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Configuración</h3>
            <p className="text-gray-600">Panel de configuración (próximamente)</p>
          </div>
        );
      default:
        return <DashboardStats setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header activeTab={activeTab} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;