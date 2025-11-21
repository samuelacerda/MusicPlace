
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Music } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const { banners, products, categories, systemSettings, theme } = useAppStore();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Safety check for arrays
  const safeBanners = banners || [];
  const safeCategories = categories || [];
  const safeProducts = products || [];

  // Sort active banners by order
  const activeBanners = safeBanners
    .filter(b => b.active)
    .sort((a, b) => a.order - b.order);
    
  const activeCategories = safeCategories.filter(c => c.active);
  
  // Filter out expired ads
  const featuredProducts = safeProducts.filter(p => p.status === 'active' && p.featured).slice(0, 4);
  const recentProducts = safeProducts.filter(p => p.status === 'active').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  // Banner Rotation
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
    }, (systemSettings.bannerRotationInterval || 5) * 1000);
    return () => clearInterval(interval);
  }, [activeBanners.length, systemSettings.bannerRotationInterval]);

  const nextBanner = () => {
    setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  return (
    <div className="pb-12 space-y-12">
      
      {/* HERO SECTION */}
      {activeBanners.length > 0 ? (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-black group">
          {activeBanners.map((banner, index) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={window.innerWidth < 768 ? banner.mobileImage : banner.desktopImage} 
                alt={banner.title} 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{banner.title}</h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl drop-shadow-md">{banner.description}</p>
                {banner.buttonText && (
                  <Link 
                    to={banner.buttonLink || '/busca'} 
                    className="bg-brand-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-brand-600 transition shadow-lg shadow-brand-500/30 inline-flex items-center gap-2"
                    style={{ 
                      backgroundColor: theme.primaryColor,
                      borderRadius: '8px'
                    }}
                  >
                    {banner.buttonText} <ChevronRight />
                  </Link>
                )}
              </div>
            </div>
          ))}
          
          {activeBanners.length > 1 && (
            <>
              <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition z-20">
                <ChevronLeft size={32} />
              </button>
              <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition z-20">
                <ChevronRight size={32} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {activeBanners.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBannerIndex ? 'bg-brand-500 w-8' : 'bg-white/50 hover:bg-white'}`}
                    style={{ backgroundColor: idx === currentBannerIndex ? theme.primaryColor : undefined }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-black py-20 px-4 text-center">
           <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo ao MusicPlace</h1>
           <p className="text-gray-400 mb-8">O maior marketplace de instrumentos musicais.</p>
           <Link to="/busca" className="bg-brand-500 text-white px-8 py-3 rounded-full font-bold" style={{ backgroundColor: theme.primaryColor }}>Explorar Ofertas</Link>
        </div>
      )}

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categorias Populares</h2>
          <Link to="/busca" className="text-brand-600 font-bold hover:underline text-sm" style={{ color: theme.primaryColor }}>Ver todas</Link>
        </div>
        
        {/* Updated Layout: Rectangular Cards (Chips) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {activeCategories.slice(0, 12).map(cat => (
            <Link 
              key={cat.id} 
              to={`/busca?cat=${cat.id}`} 
              className="flex flex-row items-center gap-3 group p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-md transition text-left h-16"
              style={{ '--hover-border': theme.primaryColor } as React.CSSProperties}
            >
               {/* Rectangular Icon / Image */}
               {cat.image ? (
                 <img 
                   src={cat.image} 
                   alt={cat.name} 
                   className="w-16 h-10 object-cover rounded-lg shrink-0" 
                 />
               ) : (
                 <div 
                    className="w-16 h-10 bg-gray-50 text-gray-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors" 
                    style={{ '--hover-bg': theme.primaryColor } as React.CSSProperties}
                 >
                   <Music size={20} />
                 </div>
               )}
               
               {/* Text */}
               <span className="font-semibold text-gray-700 group-hover:text-brand-600 text-sm leading-tight line-clamp-2">
                 {cat.name}
               </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-8 w-1 bg-brand-500 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
             <h2 className="text-2xl font-bold text-gray-900">Destaques da Semana</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* MIDDLE BANNER */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-brand-900 rounded-2xl overflow-hidden relative px-6 py-12 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
           <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Quer vender seu equipamento?</h2>
              <p className="text-brand-200 mb-8 text-lg">Anuncie grátis para milhares de músicos em todo o Brasil. Venda rápido e com segurança.</p>
              <Link 
                to="/anunciar" 
                className="bg-white text-brand-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl inline-block"
              >
                Anunciar Agora
              </Link>
           </div>
           <div className="relative z-10">
              <div className="w-64 h-64 bg-brand-500/20 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
           </div>
        </div>
      </div>

      {/* RECENT PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className="h-8 w-1 bg-gray-900 rounded-full"></div>
             <h2 className="text-2xl font-bold text-gray-900">Recém Chegados</h2>
           </div>
           <Link to="/busca?sort=recent" className="text-brand-600 font-bold hover:underline text-sm" style={{ color: theme.primaryColor }}>Ver mais</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
