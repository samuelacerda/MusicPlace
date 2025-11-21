
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Heart, MessageSquare, Bell, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AccountLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, currentUser } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
       navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
     return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <User size={20} />, label: 'Meu Perfil', path: '/minha-conta/perfil' },
    { icon: <ShoppingBag size={20} />, label: 'Meus Anúncios', path: '/minha-conta/anuncios' },
    { icon: <Heart size={20} />, label: 'Favoritos', path: '/minha-conta/favoritos' },
    { icon: <MessageSquare size={20} />, label: 'Mensagens', path: '/minha-conta/mensagens' },
    { icon: <Bell size={20} />, label: 'Notificações', path: '/minha-conta/notificacoes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-brand-50">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                         {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-[140px]">{currentUser.name}</p>
                        <p className="text-xs text-brand-700 font-medium capitalize">{currentUser.accountType}</p>
                      </div>
                   </div>
                </div>
                <nav className="p-2">
                   {menuItems.map((item) => (
                     <Link 
                       key={item.path}
                       to={item.path}
                       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium mb-1 ${
                         location.pathname === item.path 
                           ? 'bg-brand-50 text-brand-700' 
                           : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                       }`}
                     >
                       {item.icon}
                       {item.label}
                       {location.pathname === item.path && <ChevronRight size={16} className="ml-auto" />}
                     </Link>
                   ))}
                   <button 
                     onClick={handleLogout}
                     className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
                   >
                     <LogOut size={20} />
                     Sair da Conta
                   </button>
                </nav>
             </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] p-8">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
