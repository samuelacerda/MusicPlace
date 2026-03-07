
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Music, PlusCircle, User, Menu, X, LogOut, LayoutDashboard, Heart, Bell, ChevronRight, Shield, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { searchQuery, setSearchQuery, currentUser, logout, categories, theme } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show active categories in menu (for mobile and footer)
  const activeCategories = categories.filter(c => c.active);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen flex flex-col transition-colors duration-300 font-sans" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* HEADER */}
      {theme.header.visible && (
        <header 
          className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'shadow-md backdrop-blur-md bg-white/90 border-gray-200/50' : 'shadow-sm border-gray-100'}`}
          style={{ 
             backgroundColor: scrolled ? `${theme.header.backgroundColor}E6` : theme.header.backgroundColor, // E6 = 90% opacity hex
             color: theme.header.textColor 
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-20 transition-all">
              
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0 hover:scale-105 transition-transform duration-200">
                {theme.header.logoUrl ? (
                  <img src={theme.header.logoUrl} alt="Logo" className="h-8 lg:h-10 object-contain" />
                ) : (
                  <>
                    <div className="p-2 rounded-xl transition-colors shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter" style={{ color: theme.header.textColor }}>
                      Music<span style={{ color: theme.primaryColor }}>Place</span>
                    </span>
                  </>
                )}
              </Link>

              {/* Desktop Search - Modernized */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative items-center group">
                <div className="relative w-full transition-transform duration-200 group-focus-within:scale-[1.02]">
                  <input
                    type="text"
                    placeholder="O que você procura hoje?"
                    className="w-full pl-11 pr-4 py-3 rounded-full text-gray-900 bg-gray-100/50 focus:bg-white border border-transparent focus:border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 shadow-sm transition-all text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
              </form>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-5">
                
                {/* Favorites */}
                <Link 
                  to={currentUser ? "/minha-conta/favoritos" : "/login"} 
                  className="relative group p-2 rounded-full hover:bg-gray-100/80 transition-all"
                  style={{ color: theme.header.linksColor }}
                  title="Meus Favoritos"
                >
                  <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </Link>

                {/* Notifications */}
                <Link 
                  to={currentUser ? "/minha-conta/notificacoes" : "/login"} 
                  className="relative group p-2 rounded-full hover:bg-gray-100/80 transition-all"
                  style={{ color: theme.header.linksColor }}
                  title="Notificações"
                >
                  <Bell className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {currentUser && (
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500 animate-pulse"></span>
                  )}
                </Link>
                
                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                {currentUser ? (
                  <div className="flex items-center gap-3">
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 font-bold text-xs transition-colors">
                        <LayoutDashboard size={14} />
                        Admin
                      </Link>
                    )}
                    
                    {/* User Profile */}
                    <div className="flex items-center gap-3 group cursor-pointer relative">
                        <Link to="/minha-conta/perfil" className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-offset-2 ring-transparent group-hover:ring-gray-200 transition-all" style={{ backgroundColor: theme.primaryColor }}>
                              {currentUser.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold leading-none" style={{ color: theme.header.textColor }}>
                                {currentUser.name.split(' ')[0]}
                             </span>
                             <span className="text-[10px] text-gray-500 font-medium">Minha Conta</span>
                          </div>
                        </Link>
                    </div>

                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Sair">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 font-bold text-sm transition-all hover:opacity-80 px-2" style={{ color: theme.header.linksColor }}>
                    <User className="h-5 w-5" />
                    <span>Entrar</span>
                  </Link>
                )}

                <Link 
                  to="/anunciar" 
                  className="flex items-center gap-2 text-white px-6 py-3 rounded-full hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-sm shadow-md ml-2"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>VENDER</span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                style={{ color: theme.header.linksColor }}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 px-4 max-h-[85vh] overflow-y-auto shadow-xl animate-fadeIn absolute w-full bg-white z-50" style={{ backgroundColor: theme.header.backgroundColor }}>
              <form onSubmit={handleSearch} className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 bg-gray-100 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              </form>
              <nav className="flex flex-col gap-2">
                
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 mb-2 px-2">
                      <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                        <Link to="/minha-conta/perfil" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                            <User size={20} className="text-brand-500" /> Meu Perfil
                        </Link>
                        <Link to="/minha-conta/anuncios" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                            <ShoppingBag size={20} className="text-brand-500" /> Meus Anúncios
                        </Link>
                        <Link to="/minha-conta/favoritos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                            <Heart size={20} className="text-brand-500" /> Meus Favoritos
                        </Link>
                        {currentUser.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 text-yellow-700 font-medium">
                                <LayoutDashboard size={20} /> Painel Admin
                            </Link>
                        )}
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 font-medium text-left">
                            <LogOut size={20} /> Sair da Conta
                        </button>
                    </div>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-brand-600 text-white text-center py-3 rounded-xl font-bold mb-4 shadow-lg">
                    Entrar ou Cadastrar
                  </Link>
                )}

                <div className="space-y-1 border-t border-gray-100 pt-4">
                  <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navegar</p>
                  <Link to="/anunciar" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                    <PlusCircle size={20} className="text-brand-500" /> Vender Equipamento
                  </Link>
                  <Link to="/servicos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                    <User size={20} className="text-brand-500" /> Profissionais e Serviços
                  </Link>
                  <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                    <LayoutDashboard size={20} className="text-brand-500" /> Blog e Notícias
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categorias</p>
                   {activeCategories.slice(0, 6).map(cat => (
                     <Link key={cat.id} to={`/busca?cat=${cat.id}`} onClick={() => setIsMenuOpen(false)} className="block p-2 text-sm text-gray-600 hover:text-brand-600">
                       {cat.name}
                     </Link>
                   ))}
                </div>
              </nav>
            </div>
          )}
        </header>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: theme.footer.backgroundColor, color: theme.footer.textColor }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-brand-500 p-1.5 rounded-lg">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Music<span className="text-brand-500">Place</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                O marketplace definitivo para músicos. Compra, venda e troca de instrumentos com segurança e inteligência.
              </p>
              <div className="flex gap-4">
                 {theme.footer.socialLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-brand-500 transition text-white" title={link.label}>
                       {/* Simple dynamic icon logic or just text */}
                       <span className="text-xs font-bold">{link.icon.substring(0, 2)}</span>
                    </a>
                 ))}
              </div>
            </div>

            {/* Links 1 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Categorias</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {activeCategories.slice(0, 5).map(cat => (
                  <li key={cat.id}><Link to={`/busca?cat=${cat.id}`} className="hover:text-brand-400 transition">{cat.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Ajuda & Suporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/blog" className="hover:text-brand-400 transition">Blog & Dicas</Link></li>
                <li><Link to="/servicos" className="hover:text-brand-400 transition">Encontrar Profissionais</Link></li>
                <li><Link to="#" className="hover:text-brand-400 transition">Central de Ajuda</Link></li>
                <li><Link to="#" className="hover:text-brand-400 transition">Termos de Uso</Link></li>
                <li><Link to="#" className="hover:text-brand-400 transition">Política de Privacidade</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Fique por dentro</h3>
              <p className="text-gray-400 text-sm mb-4">Receba as melhores ofertas e novidades do mundo da música.</p>
              <form className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button type="button" className="bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition text-sm">
                  Inscrever-se
                </button>
              </form>
            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <p className="text-gray-500 text-sm">
                {theme.footer.copyrightText || `© ${new Date().getFullYear()} MusicPlace. Todos os direitos reservados.`}
                </p>
                <Link to="/admin-setup" className="text-[10px] text-gray-700 hover:text-gray-500 flex items-center gap-1">
                    <Shield size={10} /> Acesso Admin
                </Link>
            </div>
            <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition duration-500">
               {/* Payment Icons Mock */}
               <div className="h-6 w-10 bg-white/20 rounded"></div>
               <div className="h-6 w-10 bg-white/20 rounded"></div>
               <div className="h-6 w-10 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
