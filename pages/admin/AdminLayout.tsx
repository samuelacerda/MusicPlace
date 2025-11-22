
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, LogOut, Music, AlertOctagon, Image, Layers, Tag, Ticket, CreditCard, Settings, Palette, FileText, Megaphone, ArrowLeftCircle, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, currentUser } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Prevent navigation in useEffect, but handled inside component is safer for initial check
    if (!currentUser || currentUser.role !== 'admin') {
       // We'll handle redirect in the render or use a route guard, 
       // but here we can just perform the check.
    }
  }, [currentUser]);

  // Route Guard
  if (!currentUser || currentUser.role !== 'admin') {
     setTimeout(() => navigate('/login'), 0);
     return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col fixed h-full z-50 overflow-y-auto custom-scrollbar">
         <div className="p-6 flex items-center gap-2 border-b border-gray-800">
             <div className="bg-brand-500 p-1.5 rounded-lg">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Music<span className="text-brand-500">Admin</span>
              </span>
         </div>

         <nav className="flex-1 p-4 space-y-1 pb-20">
            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-2">Geral</div>
            <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin')}`}>
               <LayoutDashboard size={20} />
               <span>Dashboard</span>
            </Link>
            
            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-4">Aparência</div>
            <Link to="/admin/theme" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/theme')}`}>
               <Palette size={20} />
               <span>Personalizar</span>
            </Link>
            <Link to="/admin/banners" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/banners')}`}>
               <Image size={20} />
               <span>Banners</span>
            </Link>

            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-4">Catálogo</div>
            <Link to="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/categories')}`}>
               <Layers size={20} />
               <span>Categorias</span>
            </Link>
            <Link to="/admin/brands" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/brands')}`}>
               <Tag size={20} />
               <span>Marcas</span>
            </Link>
            <Link to="/admin/listings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/listings')}`}>
               <ShoppingBag size={20} />
               <span>Anúncios</span>
            </Link>

            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-4">Conteúdo</div>
            <Link to="/admin/blog" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/blog')}`}>
               <BookOpen size={20} />
               <span>Blog / Notícias</span>
            </Link>
            <Link to="/admin/content" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/content')}`}>
               <FileText size={20} />
               <span>Páginas Legais</span>
            </Link>

            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-4">Comercial</div>
            <Link to="/admin/plans" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/plans')}`}>
               <CreditCard size={20} />
               <span>Planos</span>
            </Link>
            <Link to="/admin/coupons" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/coupons')}`}>
               <Ticket size={20} />
               <span>Cupons</span>
            </Link>
            <Link to="/admin/marketing" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/marketing')}`}>
               <Megaphone size={20} />
               <span>Marketing</span>
            </Link>

            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-4">Usuários</div>
            <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/users')}`}>
               <Users size={20} />
               <span>Gerenciar Usuários</span>
            </Link>
             <Link to="/admin/reports" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/reports')}`}>
               <AlertOctagon size={20} />
               <span>Denúncias</span>
            </Link>

            <div className="text-xs font-bold text-gray-600 uppercase px-4 mb-2 mt-4">Sistema</div>
            <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/settings')}`}>
               <Settings size={20} />
               <span>Configurações</span>
            </Link>

            <div className="pt-8">
               <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-brand-400 hover:bg-gray-900 hover:text-brand-300 font-bold border border-gray-800 bg-gray-900/50">
                  <ArrowLeftCircle size={20} />
                  <span>Voltar para o App</span>
               </Link>
            </div>
         </nav>

         <div className="p-4 border-t border-gray-800 bg-black">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition w-full">
               <LogOut size={20} />
               <span>Sair da Conta</span>
            </button>
         </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
