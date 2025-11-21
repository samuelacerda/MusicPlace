
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Music, PlusCircle, User, Menu, X, LogOut, LayoutDashboard, Heart, Bell } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, currentUser, logout, categories, theme } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show active categories in menu (for mobile and footer)
  const activeCategories = categories.filter(c => c.active);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/busca') {
      navigate('/busca');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* HEADER */}
      {theme.header.visible && (
        <header 
          className="sticky top-0 z-50 border-b border-gray-800/10 shadow-sm transition-colors duration-300"
          style={{ backgroundColor: theme.header.backgroundColor, color: theme.header.textColor }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                {theme.header.logoUrl ? (
                  <img src={theme.header.logoUrl} alt="Logo" className="h-8 object-contain" />
                ) : (
                  <>
                    <div className="p-2 rounded-lg transition-colors" style={{ backgroundColor: theme.primaryColor }}>
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight" style={{ color: theme.header.textColor }}>
                      Music<span style={{ color: theme.primaryColor }}>Place</span>
                    </span>
                  </>
                )}
              </Link>

              {/* Desktop Search - Reduced size & Vertically Centered */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-6 relative items-center">
                <input
                  type="text"
                  placeholder="O que você procura? (ex: Fender Stratocaster)"
                  className="w-full pl-10 pr-4 py-3 rounded-full text-gray-900 bg-white/90 focus:outline-none focus:ring-2 border-none shadow-inner text-sm"
                  style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </form>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-6">
                
                {/* Favorites */}
                <Link 
                  to={currentUser ? "/minha-conta/favoritos" : "/login"} 
                  className="relative hover:opacity-80 transition-opacity p-1"
                  style={{ color: theme.header.linksColor }}
                  title="Meus Favoritos"
                >
                  <Heart className="h-6 w-6" />
                </Link>

                {/* Notifications */}
                <Link 
                  to={currentUser ? "/minha-conta/notificacoes" : "/login"} 
                  className="relative hover:opacity-80 transition-opacity p-1"
                  style={{ color: theme.header.linksColor }}
                  title="Notificações"
                >
                  <Bell className="h-6 w-6" />
                  {currentUser && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                  )}
                </Link>
                
                {currentUser ? (
                  <div className="flex items-center gap-4 ml-2">
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-bold transition-colors">
                        <LayoutDashboard size={18} />
                        Admin
                      </Link>
                    )}
                    
                    {/* User Dropdown / Link */}
                    <Link to="/minha-conta/perfil" className="flex items-center gap-2 hover:opacity-80 transition" style={{ color: theme.header.linksColor }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: theme.primaryColor }}>
                          {currentUser.name.charAt(0)}
                      </div>
                      <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                    </Link>

                    <button onClick={handleLogout} className="hover:opacity-80" style={{ color: theme.header.linksColor }} title="Sair">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-1 font-medium transition-colors hover:opacity-80 ml-2" style={{ color: theme.header.linksColor }}>
                    <User className="h-5 w-5" />
                    <span>Entrar</span>
                  </Link>
                )}

                <Link 
                  to="/anunciar" 
                  className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-colors font-bold shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>VENDER EQUIPAMENTO</span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
                style={{ color: theme.header.linksColor }}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4 px-4 max-h-[80vh] overflow-y-auto" style={{ backgroundColor: theme.header.backgroundColor }}>
              <form onSubmit={handleSearch} className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </form>
              <nav className="flex flex-col gap-4">
                
                {/* Added Favorites/Notifications to Mobile Menu as well for consistency */}
                <div className="flex items-center gap-4 mb-2">
                   <Link to={currentUser ? "/minha-conta/favoritos" : "/login"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.header.linksColor }}>
                      <Heart size={18} /> Favoritos
                   </Link>
                   <Link to={currentUser ? "/minha-conta/notificacoes" : "/login"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.header.linksColor }}>
                      <Bell size={18} /> Notificações
                   </Link>
                </div>

                <div className="border-b border-gray-700/30 pb-4 mb-2">
                  <h3 className="text-xs font-bold uppercase mb-3 opacity-60" style={{ color: theme.header.textColor }}>Categorias</h3>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {activeCategories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/busca?cat=${cat.id}`} 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm hover:opacity-80"
                        style={{ color: theme.header.linksColor }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {currentUser ? (
                  <>
                    {currentUser.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-yellow-400 hover:text-yellow-300 font-bold">Painel Admin</Link>
                    )}
                    <Link to="/minha-conta/perfil" onClick={() => setIsMenuOpen(false)} style={{ color: theme.header.linksColor }}>Minha Conta</Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-400 hover:text-red-300 text-left">Sair</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="font-medium" style={{ color: theme.header.linksColor }}>Entrar / Cadastrar</Link>
                )}
                
                <Link to="/anunciar" onClick={() => setIsMenuOpen(false)} className="text-white text-center py-3 rounded-lg font-bold mt-2" style={{ backgroundColor: theme.primaryColor }}>
                  VENDER EQUIPAMENTO
                </Link>
              </nav>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-gray-800/20 transition-colors duration-300" style={{ backgroundColor: theme.footer.backgroundColor, color: theme.footer.textColor }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: theme.primaryColor }}>
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: theme.footer.textColor }}>Music<span style={{ color: theme.primaryColor }}>Place</span></span>
            </div>
            <p className="text-sm opacity-80">
              O ponto de encontro de compradores e vendedores de todo o Brasil. Compre, venda e conecte-se com segurança.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4" style={{ color: theme.footer.textColor }}>Categorias</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {activeCategories.slice(0, 5).map(cat => (
                <li key={cat.id}><Link to={`/busca?cat=${cat.id}`} className="hover:opacity-100 hover:underline">{cat.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: theme.footer.textColor }}>Ajuda</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 hover:underline">Central de Ajuda</a></li>
              <li><a href="#" className="hover:opacity-100 hover:underline">Segurança</a></li>
              <li><a href="#" className="hover:opacity-100 hover:underline">Termos de Uso</a></li>
              <li><a href="#" className="hover:opacity-100 hover:underline">Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: theme.footer.textColor }}>Siga-nos</h3>
            <div className="flex gap-4">
              {theme.footer.socialLinks.map((link, idx) => {
                const IconComponent = (LucideIcons[link.icon as keyof typeof LucideIcons] || LucideIcons.Link) as React.ElementType;
                return (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition hover:-translate-y-1"
                    style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
                    title={link.label}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-700/20 text-center text-sm opacity-60">
          {theme.footer.copyrightText}
        </div>
      </footer>
    </div>
  );
};
