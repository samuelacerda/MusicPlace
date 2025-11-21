
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';
import { STATES } from '../constants';
import { Filter, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, searchQuery, categories } = useAppStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Only active categories
  const activeCategories = categories.filter(c => c.active);

  const categoryParam = searchParams.get('cat');
  const sortParam = searchParams.get('sort');

  // Mock Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    // Better category matching (checking both ID and Name)
    const matchCat = categoryParam ? (
      p.category.toLowerCase() === activeCategories.find(c => c.id === categoryParam)?.name.toLowerCase() || 
      p.category.toLowerCase().includes(categoryParam.replace(/-/g, ' ').split(' ')[0].toLowerCase())
    ) : true;
    
    // Check if active status
    const matchStatus = p.status === 'active';

    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {searchQuery ? `Resultados para "${searchQuery}"` : 'Explorar Anúncios'}
        </h1>
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium"
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`
          fixed inset-0 z-40 bg-white p-6 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:block lg:p-0 lg:bg-transparent lg:shadow-none overflow-y-auto
          ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-bold">Filtros</h2>
            <button onClick={() => setMobileFiltersOpen(false)}><X /></button>
          </div>

          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Categorias</h3>
              <div className="space-y-2">
                {activeCategories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSearchParams({ cat: cat.id })}
                    className={`block text-sm text-left w-full py-1 hover:text-brand-600 ${categoryParam === cat.id ? 'text-brand-600 font-bold' : 'text-gray-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Preço</h3>
              <div className="flex gap-2 items-center">
                 <input type="number" placeholder="Mín" className="w-20 p-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-brand-500 focus:outline-none" />
                 <span>-</span>
                 <input type="number" placeholder="Máx" className="w-20 p-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-brand-500 focus:outline-none" />
                 <button className="bg-brand-600 text-white p-2 rounded">→</button>
              </div>
            </div>

            {/* State */}
            <div>
               <h3 className="font-bold text-gray-900 mb-3">Localização</h3>
               <select className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:ring-brand-500 focus:outline-none">
                 <option value="">Todos os Estados</option>
                 {STATES.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>

            {/* Condition */}
            <div>
               <h3 className="font-bold text-gray-900 mb-3">Condição</h3>
               <div className="space-y-2">
                 {['Novo', 'Usado', 'Seminovo'].map(c => (
                   <label key={c} className="flex items-center gap-2 text-sm text-gray-600">
                     <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" />
                     {c}
                   </label>
                 ))}
               </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileFiltersOpen(false)}></div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
           {filteredProducts.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
               <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
               <button onClick={() => setSearchParams({})} className="text-brand-600 font-medium mt-2 hover:underline">
                 Limpar filtros
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
