
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BlogCard } from '../../components/BlogCard';
import { Search } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { blogPosts, theme } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Extract categories
  const uniqueCategories = Array.from(new Set(blogPosts.map((p) => p.category)));
  const allCategories: string[] = ['Todas', ...uniqueCategories];
  
  const featuredPost = blogPosts.find(p => p.featured);

  // Filter
  const filteredPosts = blogPosts.filter(post => {
     const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesCategory = selectedCategory === 'Todas' || post.category === selectedCategory;
     return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 px-4">
         <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Blog MusicPlace</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Notícias, dicas, tutoriais e reviews sobre o mundo da música.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
           <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-brand-50 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  style={selectedCategory === cat ? { backgroundColor: theme.primaryColor } : {}}
                >
                  {cat}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
           </div>
        </div>

        {/* Featured Post (Hero) - Only show if no search/filter applied */}
        {!searchTerm && selectedCategory === 'Todas' && featuredPost && (
           <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <span className="bg-yellow-400 w-2 h-8 rounded-full"></span> Destaque
              </h2>
              <BlogCard post={featuredPost} />
           </div>
        )}

        {/* Post Grid */}
        <div>
           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             <span className="bg-brand-500 w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></span> Últimas Publicações
           </h2>
           
           {filteredPosts.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                   <BlogCard key={post.id} post={post} compact />
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">Nenhum artigo encontrado para sua busca.</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }} className="text-brand-600 font-bold mt-2 hover:underline" style={{ color: theme.primaryColor }}>Limpar filtros</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
