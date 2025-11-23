
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Music, ArrowRight, MapPin, TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';
import { ProductListCard } from '../components/ProductListCard';
import { BlogCard } from '../components/BlogCard';

export const Home: React.FC = () => {
  const { banners, products, categories, systemSettings, theme, blogPosts, recentlyViewed, currentUser } = useAppStore();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Safety check for arrays
  const safeBanners = banners || [];
  const safeCategories = categories || [];
  const safeProducts = products || [];
  const safeBlogPosts = blogPosts || [];

  // Sort active banners by order
  const activeBanners = safeBanners
    .filter(b => b.active)
    .sort((a, b) => a.order - b.order);
    
  const activeCategories = safeCategories.filter(c => c.active);
  
  // --- SECTIONS LOGIC ---

  // 1. Featured Products (Weekly Highlights) - Filter active & featured
  const featuredProducts = safeProducts
    .filter(p => p.status === 'active' && p.featured)
    .slice(0, 6); // Show top 6 in horizontal list

  // 2. Most Searched Guitars (Simulated by active guitars)
  const guitarProducts = safeProducts
    .filter(p => p.status === 'active' && (p.category === 'Guitarras' || p.category === 'Violões'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // 3. Most Searched Keyboards
  const keyboardProducts = safeProducts
    .filter(p => p.status === 'active' && p.category === 'Teclados e Pianos')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // 4. Recently Viewed (From Store)
  const recentlyViewedProducts = safeProducts
    .filter(p => recentlyViewed.includes(p.id) && p.status === 'active')
    .sort((a, b) => recentlyViewed.indexOf(a.id) - recentlyViewed.indexOf(b.id));

  // 5. Near You (Prioritize City, then State)
  const getNearYouProducts = () => {
    if (!currentUser) return [];
    
    const userCity = currentUser.city;
    const userState = currentUser.state;

    // 1. Exact City Match
    const cityMatches = safeProducts.filter(p => 
      p.status === 'active' && 
      p.locationState === userState && 
      p.locationCity === userCity &&
      p.userId !== currentUser.id
    );

    // 2. State Match (excluding already found in city)
    const stateMatches = safeProducts.filter(p => 
      p.status === 'active' && 
      p.locationState === userState && 
      p.locationCity !== userCity && 
      p.userId !== currentUser.id
    );

    // Combine: City matches first, then fill with state matches
    return [...cityMatches, ...stateMatches].slice(0, 6); 
  };

  const nearYouProducts = getNearYouProducts();

  // Blog Posts Logic
  const recentBlogPosts = [...safeBlogPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

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
    <div className="pb-12 space-y-8">
      
      {/* 1. CATEGORIES BAR (Between Header and Banner) */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 md:top-20 z-40">
         <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-8 py-4 min-w-max">
               {activeCategories.slice(0, 8).map(cat => (
                 <Link 
                   key={cat.id} 
                   to={`/busca?cat=${cat.id}`}
                   className="text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors flex flex-col items-center gap-1 group"
                 >
                   <span className="group-hover:scale-105 transition-transform">{cat.name}</span>
                   <span className="h-0.5 w-0 bg-brand-600 group-hover:w-full transition-all duration-300"></span>
                 </Link>
               ))}
               <Link to="/busca" className="text-sm font-bold text-brand-600 flex items-center gap-1 hover:underline ml-4">
                 Mais categorias <ArrowRight size={14} />
               </Link>
            </div>
         </div>
      </div>

      {/* 2. MAIN BANNER */}
      {activeBanners.length > 0 ? (
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden bg-black group mt-0">
          {activeBanners.map((banner, index) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={window.innerWidth < 768 ? banner.mobileImage : banner.desktopImage} 
                alt={banner.title} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-4xl">
                <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">{banner.title}</h1>
                <p className="text-base md:text-xl text-gray-200 mb-6 max-w-xl drop-shadow-md hidden md:block">{banner.description}</p>
                {banner.buttonText && (
                  <Link 
                    to={banner.buttonLink || '/busca'} 
                    className="bg-brand-50 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-brand-600 transition shadow-lg shadow-brand-500/30 inline-flex items-center gap-2"
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
              <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition z-20 border border-white/30">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition z-20 border border-white/30">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      ) : null}

      {/* 3. WEEKLY HIGHLIGHTS (Horizontal List) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-center gap-3 mb-6 border-l-4 border-brand-600 pl-4">
             <h2 className="text-2xl font-bold text-gray-900">Destaques da Semana</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featuredProducts.map(product => (
              <ProductListCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. MOST SEARCHED GUITARS */}
      {guitarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-gray-900">Mais pesquisados em Guitarras</h2>
             <Link to="/busca?cat=guitarras" className="text-brand-600 font-semibold text-sm hover:underline">Ver tudo</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {guitarProducts.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
          </div>
        </section>
      )}

      {/* 5. MOST SEARCHED KEYBOARDS */}
      {keyboardProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-gray-900">Mais pesquisados em Teclados e Pianos</h2>
             <Link to="/busca?cat=teclados-pianos" className="text-brand-600 font-semibold text-sm hover:underline">Ver tudo</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {keyboardProducts.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
          </div>
        </section>
      )}

      {/* 6. RECENTLY VIEWED */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12 bg-gray-50 py-8 rounded-xl">
           <div className="flex items-center gap-2 mb-6 text-gray-500">
             <Clock size={20} />
             <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Visto Recentemente</h2>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {recentlyViewedProducts.map(product => (
                 <div key={product.id} className="min-w-[260px] max-w-[260px]">
                   <ProductCard product={product} />
                 </div>
              ))}
           </div>
        </section>
      )}

      {/* 7. NEAR YOU (List Style) */}
      {currentUser && nearYouProducts.length > 0 ? (
        <section className="bg-black py-12 mt-12">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div>
                   <div className="flex items-center gap-2 text-brand-400 mb-1">
                      <MapPin size={20} />
                      <span className="font-bold text-sm uppercase tracking-wider">Perto de você</span>
                   </div>
                   <h2 className="text-3xl font-bold text-white">
                     Encontre equipamentos em {currentUser.city} - {currentUser.state}
                   </h2>
                   <p className="text-gray-400 mt-2">Economize no frete e teste antes de comprar.</p>
                 </div>
                 <Link to="/minha-conta/perfil" className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:text-white hover:border-white transition text-sm font-medium">
                    Mudar minha localização
                 </Link>
              </div>
              
              {/* Changed to Grid of ListCards for consistency with "Destaques" layout requested */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {nearYouProducts.map(product => (
                   <ProductListCard key={product.id} product={product} />
                 ))}
              </div>
              
              {nearYouProducts.length < 4 && (
                <div className="mt-8 text-center">
                   <p className="text-gray-500 mb-4">Quer ver mais produtos na sua região?</p>
                   <Link to={`/busca`} className="text-brand-400 hover:text-brand-300 font-bold">Explorar todo o Brasil</Link>
                </div>
              )}
           </div>
        </section>
      ) : currentUser ? (
         // Logged in but no products found nearby
         <div className="max-w-7xl mx-auto px-4 mt-12">
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
               <MapPin size={40} className="text-gray-600 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">Ainda não há anúncios em {currentUser.city}</h3>
               <p className="text-gray-400">Seja o primeiro a vender na sua região!</p>
               <Link to="/anunciar" className="inline-block mt-4 bg-brand-600 text-white px-6 py-2 rounded-lg font-bold">Anunciar Agora</Link>
            </div>
         </div>
      ) : null}

      {/* 8. CTA - SELL YOUR GEAR (Dynamic from Settings) */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
         <div className="bg-gradient-to-r from-brand-800 to-brand-900 rounded-2xl overflow-hidden relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl group">
            <div className="relative z-10 max-w-xl">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                 {systemSettings.sellCtaTitle || 'Venda para milhões de músicos'}
               </h2>
               <p className="text-brand-100 text-lg mb-8 leading-relaxed">
                 {systemSettings.sellCtaText || 'Junte-se à maior comunidade de equipamentos musicais. Baixas taxas, pagamento rápido e segurança garantida.'}
               </p>
               <div className="flex gap-4">
                  <Link 
                    to={currentUser ? '/anunciar' : '/cadastro'} 
                    className="bg-white text-brand-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-50 transition shadow-lg"
                  >
                     {systemSettings.sellCtaButtonText || 'Começar a vender agora'}
                  </Link>
               </div>
            </div>
            
            {/* Background Image if set */}
            {systemSettings.sellCtaImage && (
               <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition duration-1000">
                  <img src={systemSettings.sellCtaImage} className="w-full h-full object-cover mix-blend-overlay" alt="Background" />
               </div>
            )}
            
            {/* Decorative graphic fallback */}
            {!systemSettings.sellCtaImage && (
              <div className="hidden md:block absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.2C93.5,8.9,82.2,22.1,71.6,33.6C61,45.1,51.1,54.9,39.8,62.6C28.5,70.3,15.8,75.9,1.7,73C-12.4,70.1,-26.7,58.7,-39.2,48.9C-51.7,39.1,-62.4,30.9,-68.7,20.4C-75,9.9,-76.9,-2.9,-73.5,-14.6C-70.1,-26.3,-61.4,-36.9,-51.1,-45.3C-40.8,-53.7,-28.9,-59.9,-16.7,-63.5C-4.5,-67.1,8,-68.1,20.5,-76.4Z" transform="translate(100 100)" />
                 </svg>
              </div>
            )}
         </div>
      </section>

      {/* 9. BLOG SECTION */}
      {recentBlogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-brand-600 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h2 className="text-2xl font-bold text-gray-900">Blog & Notícias</h2>
             </div>
             <Link to="/blog" className="text-brand-600 font-bold flex items-center gap-1 hover:underline" style={{ color: theme.primaryColor }}>
                Ver todos <ArrowRight size={16} />
             </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentBlogPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
           </div>
        </section>
      )}
    </div>
  );
};
