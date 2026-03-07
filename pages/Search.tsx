import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';
import { STATES } from '../constants';
import { Filter, X, ArrowLeft, Search as SearchIcon, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { Condition } from '../types';

type SortOption = 'recent' | 'price_asc' | 'price_desc';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, searchQuery: globalSearchQuery, setSearchQuery: setGlobalSearchQuery, categories, brands } = useAppStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // --- PENDING Filter States (Local) ---
  const [localSearch, setLocalSearch] = useState(globalSearchQuery);
  const [localCategory, setLocalCategory] = useState(searchParams.get('cat') || '');
  const [localSubcategory, setLocalSubcategory] = useState('');
  const [localBrand, setLocalBrand] = useState('');
  const [localState, setLocalState] = useState('');
  const [localPriceRange, setLocalPriceRange] = useState({ min: '', max: '' });
  const [localYearRange, setLocalYearRange] = useState({ min: '', max: '' });
  const [localConditions, setLocalConditions] = useState<string[]>([]);
  const [localTrade, setLocalTrade] = useState(false);
  const [localOffers, setLocalOffers] = useState(false);

  // --- APPLIED Filter States (Active) ---
  const [appliedFilters, setAppliedFilters] = useState({
    search: globalSearchQuery,
    category: searchParams.get('cat') || '',
    subcategory: '',
    brand: '',
    state: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    conditions: [] as string[],
    trade: false,
    offers: false
  });

  const [sortOption, setSortOption] = useState<SortOption>('recent');

  // Sync URL param with local state on load
  useEffect(() => {
    const catParam = searchParams.get('cat');
    if (catParam) {
      setLocalCategory(catParam);
      setAppliedFilters(prev => ({ ...prev, category: catParam }));
    }
  }, [searchParams]);

  // Sync global search query
  useEffect(() => {
    setLocalSearch(globalSearchQuery);
    setAppliedFilters(prev => ({ ...prev, search: globalSearchQuery }));
  }, [globalSearchQuery]);

  // Toggle Condition Helper
  const toggleLocalCondition = (cond: string) => {
    setLocalConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  // APPLY FILTERS HANDLER
  const handleApplyFilters = () => {
    setAppliedFilters({
      search: localSearch,
      category: localCategory,
      subcategory: localSubcategory,
      brand: localBrand,
      state: localState,
      priceMin: localPriceRange.min,
      priceMax: localPriceRange.max,
      yearMin: localYearRange.min,
      yearMax: localYearRange.max,
      conditions: localConditions,
      trade: localTrade,
      offers: localOffers
    });
    if (localSearch !== globalSearchQuery) {
        setGlobalSearchQuery(localSearch);
    }
    setMobileFiltersOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setLocalSearch('');
    setLocalCategory('');
    setLocalSubcategory('');
    setLocalBrand('');
    setLocalState('');
    setLocalPriceRange({ min: '', max: '' });
    setLocalYearRange({ min: '', max: '' });
    setLocalConditions([]);
    setLocalTrade(false);
    setLocalOffers(false);
    setSearchParams({});
    
    setAppliedFilters({
      search: '',
      category: '',
      subcategory: '',
      brand: '',
      state: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      conditions: [],
      trade: false,
      offers: false
    });
    setGlobalSearchQuery('');
  };

  // Derived Data
  const activeCategories = categories.filter(c => c.active);
  const activeBrands = brands.filter(b => b.active);
  
  const availableSubcategories = useMemo(() => {
    const cat = activeCategories.find(c => c.id === localCategory);
    return cat ? cat.subcategories : [];
  }, [localCategory, activeCategories]);

  // --- FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'active') return false;

      const { search, category, subcategory, brand, state, priceMin, priceMax, yearMin, yearMax, conditions, trade, offers } = appliedFilters;

      if (search) {
        const query = search.toLowerCase();
        const matchesTitle = (p.title || '').toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (category) {
         const prodCat = (p.category || '').toLowerCase().trim();
         const filterCatObj = activeCategories.find(c => c.id === category);
         const filterCatName = filterCatObj ? filterCatObj.name.toLowerCase().trim() : category.toLowerCase().trim();
         
         // 1. Exact match on Name (most common)
         let match = prodCat === filterCatName;
         
         // 2. Match on ID (from URL params)
         if (!match) {
             match = prodCat === category.toLowerCase().trim();
         }

         // 3. Normalized fuzzy match (handle accents, hyphens)
         if (!match) {
             const normProd = prodCat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');
             const normFilter = filterCatName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');
             match = normProd === normFilter;
         }
         
         // 4. Containment fallback (e.g. "Guitarras" matches "Guitarras Elétricas")
         if (!match && filterCatName) {
             match = prodCat.includes(filterCatName) || filterCatName.includes(prodCat);
         }

         if (!match) return false;
      }

      if (subcategory && p.subcategory !== subcategory) return false;
      if (brand && p.brand !== brand) return false;
      if (state && p.locationState !== state) return false;

      const price = p.price;
      if (priceMin && price < parseFloat(priceMin)) return false;
      if (priceMax && price > parseFloat(priceMax)) return false;

      if (p.year) {
        if (yearMin && p.year < parseInt(yearMin)) return false;
        if (yearMax && p.year > parseInt(yearMax)) return false;
      }

      if (conditions.length > 0 && !conditions.includes(p.condition)) return false;
      if (trade && !p.acceptsTrade) return false;
      if (offers && !p.acceptsNegotiation) return false;

      return true;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [
    products, appliedFilters, sortOption, activeCategories
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Mobile Actions */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm"
        >
          <SlidersHorizontal size={16} /> Filtros
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* --- SIDEBAR FILTERS --- */}
        <aside className={`
          fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-72 lg:block lg:z-0
          ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col lg:h-auto lg:block bg-white shadow-2xl lg:shadow-none w-full max-w-xs lg:max-w-none lg:rounded-xl lg:border lg:border-gray-100 lg:p-4">
            
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 lg:hidden bg-white">
              <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-0 space-y-6 custom-scrollbar">
              
              {/* Search Text */}
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1">Buscar</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ex: Stratocaster" 
                      className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                 </div>
              </div>

              {/* 1. MARCA */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
                   Marca
                   {localBrand && <button onClick={() => setLocalBrand('')} className="text-xs text-red-500 font-normal hover:underline">Limpar</button>}
                </h3>
                <select 
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-700"
                  value={localBrand}
                  onChange={(e) => setLocalBrand(e.target.value)}
                >
                  <option value="">Todas as Marcas</option>
                  {activeBrands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              {/* 2. CATEGORIA */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
                   Categoria
                   {localCategory && <button onClick={() => {setLocalCategory(''); setLocalSubcategory('');}} className="text-xs text-red-500 font-normal hover:underline">Limpar</button>}
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {activeCategories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => {
                         const newVal = localCategory === cat.id ? '' : cat.id;
                         setLocalCategory(newVal);
                         setLocalSubcategory(''); // Reset subcat
                      }}
                      className={`flex items-center w-full text-left px-2 py-2 rounded-lg text-sm transition-all border ${
                        localCategory === cat.id 
                          ? 'bg-white border-brand-500 text-brand-600 shadow-sm font-bold ring-1 ring-brand-100' 
                          : 'bg-white border-transparent text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${localCategory === cat.id ? 'bg-brand-600' : 'bg-gray-300'}`}></div>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. SUBCATEGORIA (Conditional) */}
              {localCategory && availableSubcategories.length > 0 && (
                <div className="animate-fadeIn">
                   <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
                      Subcategoria
                      {localSubcategory && <button onClick={() => setLocalSubcategory('')} className="text-xs text-red-500 font-normal hover:underline">Limpar</button>}
                   </h3>
                   <select 
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-700"
                      value={localSubcategory}
                      onChange={(e) => setLocalSubcategory(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
              )}

              {/* 4. PREÇO */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Preço ($)</h3>
                <div className="flex items-center gap-2">
                   <input 
                     type="number" 
                     placeholder="Mín" 
                     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-500 outline-none"
                     value={localPriceRange.min}
                     onChange={(e) => setLocalPriceRange({...localPriceRange, min: e.target.value})}
                   />
                   <span className="text-gray-400">-</span>
                   <input 
                     type="number" 
                     placeholder="Máx" 
                     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-500 outline-none"
                     value={localPriceRange.max}
                     onChange={(e) => setLocalPriceRange({...localPriceRange, max: e.target.value})}
                   />
                </div>
              </div>

              {/* 5. ANO */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Ano</h3>
                <div className="flex items-center gap-2">
                   <input 
                     type="number" 
                     placeholder="De" 
                     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-500 outline-none"
                     value={localYearRange.min}
                     onChange={(e) => setLocalYearRange({...localYearRange, min: e.target.value})}
                   />
                   <span className="text-gray-400">-</span>
                   <input 
                     type="number" 
                     placeholder="Até" 
                     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-brand-500 outline-none"
                     value={localYearRange.max}
                     onChange={(e) => setLocalYearRange({...localYearRange, max: e.target.value})}
                   />
                </div>
              </div>

              {/* 6. CONDIÇÃO */}
              <div>
                 <h3 className="font-bold text-gray-900 mb-2">Condição</h3>
                 <div className="space-y-2 bg-white border border-gray-200 rounded-lg p-3">
                   {Object.values(Condition).map(cond => (
                     <label key={cond} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-brand-600">
                       <input 
                         type="checkbox" 
                         className="rounded text-brand-600 focus:ring-brand-500 border-gray-300 bg-white w-4 h-4"
                         checked={localConditions.includes(cond)}
                         onChange={() => toggleLocalCondition(cond)}
                       />
                       {cond}
                     </label>
                   ))}
                 </div>
              </div>

              {/* 7. ESTADO */}
              <div>
                 <h3 className="font-bold text-gray-900 mb-2">Localização (Estado)</h3>
                 <select 
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-700"
                    value={localState}
                    onChange={(e) => setLocalState(e.target.value)}
                 >
                   <option value="">Todo o Brasil</option>
                   {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>

              {/* 8. OPÇÕES */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                 <label className="flex items-center gap-2 text-sm text-gray-900 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-brand-600 focus:ring-brand-500 border-gray-300 bg-white w-4 h-4"
                      checked={localOffers}
                      onChange={(e) => setLocalOffers(e.target.checked)}
                    />
                    Aceita Ofertas
                 </label>
                 <label className="flex items-center gap-2 text-sm text-gray-900 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-brand-600 focus:ring-brand-500 border-gray-300 bg-white w-4 h-4"
                      checked={localTrade}
                      onChange={(e) => setLocalTrade(e.target.checked)}
                    />
                    Aceita Trocas
                 </label>
              </div>

            </div>

            {/* Filter Action Buttons */}
            <div className="p-4 border-t border-gray-100 bg-white lg:border-none lg:pt-6 sticky bottom-0">
               <button 
                 onClick={handleApplyFilters}
                 className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 shadow-lg transition flex items-center justify-center gap-2"
               >
                 <Filter size={18} /> Aplicar Filtros
               </button>
               <button 
                 onClick={handleClearFilters} 
                 className="w-full text-gray-500 text-sm font-medium mt-3 hover:text-gray-800 underline"
               >
                 Limpar tudo
               </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)}></div>
        )}

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 min-h-[500px]">
           {/* Results Header & Sorting */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div>
                 <h1 className="text-xl font-bold text-gray-900">
                   {appliedFilters.search ? `Resultados para "${appliedFilters.search}"` : 'Explorar Anúncios'}
                 </h1>
                 <p className="text-sm text-gray-500">
                   {filteredProducts.length} {filteredProducts.length === 1 ? 'encontrado' : 'encontrados'}
                 </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <span className="text-sm text-gray-500 font-medium whitespace-nowrap hidden sm:block">Ordenar por:</span>
                 <div className="relative w-full sm:w-48">
                    <select 
                      className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer hover:border-gray-400 transition"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                    >
                       <option value="recent">Mais Recentes</option>
                       <option value="price_asc">Menor Preço</option>
                       <option value="price_desc">Maior Preço</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                 </div>
              </div>
           </div>

           {/* Product Grid */}
           {filteredProducts.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
               {filteredProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 flex flex-col items-center shadow-sm">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <SearchIcon size={32} />
               </div>
               <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado.</h3>
               <p className="text-gray-500 mt-2 max-w-xs mx-auto">Tente ajustar seus filtros ou buscar por termos mais genéricos.</p>
               <button onClick={handleClearFilters} className="mt-6 text-brand-600 font-bold hover:bg-brand-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-brand-100">
                 Limpar todos os filtros
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};