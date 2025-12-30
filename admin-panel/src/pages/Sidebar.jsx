import { Home, ShoppingCart, Users, Settings, LogOut, StoreIcon } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    
    { id: 'products', label: 'Productos', icon: StoreIcon},
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white`}>
      <nav className="p-4 space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-4 py-3 rounded-lg ${
              activeTab === item.id ? 'bg-slate-700' : 'hover:bg-slate-700/50'
            }`}
          >
            <item.icon size={20} />
            {sidebarOpen && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button onClick={onLogout} className="p-4 flex items-center">
        <LogOut size={20} />
        {sidebarOpen && <span className="ml-3">Salir</span>}
      </button>
    </div>
  );
};

export default Sidebar;
