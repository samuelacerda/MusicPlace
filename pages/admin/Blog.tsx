
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Edit2, Search, Star, Upload, XCircle } from 'lucide-react';
import { BlogPost } from '../../types';

export const AdminBlog: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, toggleBlogPostFeatured } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const initialForm: BlogPost = {
    id: '',
    title: '',
    subtitle: '',
    content: '',
    image: '',
    category: '',
    author: 'Admin',
    createdAt: '',
    featured: false
  };

  const [formData, setFormData] = useState<BlogPost>(initialForm);

  const handleEdit = (post: BlogPost) => {
    setFormData(post);
    setEditingId(post.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({ 
      ...initialForm, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBlogPost(editingId, formData);
    } else {
      addBlogPost(formData);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      deleteBlogPost(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPosts = blogPosts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isEditing) {
    return (
      <div className="max-w-4xl">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar Post' : 'Novo Post'}</h1>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancelar</button>
         </div>
         <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
               <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo (Resumo)</label>
               <textarea required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 h-20" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Notícias, Dicas, Reviews" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
               </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center cursor-pointer group bg-white">
                   <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
                   <div className="flex flex-col items-center">
                      {formData.image ? (
                        <div className="relative">
                           <img src={formData.image} alt="Preview" className="h-40 object-cover rounded-lg shadow-md mb-2" />
                           <button type="button" onClick={(e) => {e.preventDefault(); setFormData({...formData, image: ''})}} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"><XCircle size={16}/></button>
                        </div>
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-brand-500 mb-2" />
                      )}
                      <span className="text-sm text-gray-500">{formData.image ? 'Clique para alterar' : 'Clique para enviar imagem'}</span>
                   </div>
                </div>
                <input type="text" placeholder="Ou cole a URL da imagem" className="w-full mt-2 p-2 text-xs border border-gray-200 rounded bg-white text-gray-900" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (HTML Simples)</label>
               <textarea 
                  required 
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono h-96 focus:ring-2 focus:ring-brand-500 outline-none" 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  placeholder="<p>Escreva seu texto aqui...</p>"
               />
               <p className="text-xs text-gray-500 mt-1">Você pode usar tags HTML como &lt;p&gt;, &lt;strong&gt;, &lt;h2&gt;, &lt;ul&gt; para formatar o texto.</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
               <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
               <label htmlFor="featured" className="font-bold text-gray-900">Destacar este post na Home e Topo do Blog</label>
            </div>

            <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold hover:bg-brand-700 shadow-lg">Salvar Post</button>
         </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Gerenciar Blog</h1>
           <p className="text-gray-500">Publique notícias e artigos para sua comunidade.</p>
        </div>
        <button onClick={handleCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
          <Plus size={18} /> Novo Post
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
         <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Buscar posts..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <tr>
                    <th className="p-4 whitespace-nowrap">Post</th>
                    <th className="p-4 whitespace-nowrap">Categoria</th>
                    <th className="p-4 whitespace-nowrap">Data</th>
                    <th className="p-4 text-center whitespace-nowrap">Destaque</th>
                    <th className="p-4 text-right whitespace-nowrap">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredPosts.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum post encontrado.</td></tr>
                ) : (
                    filteredPosts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50">
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <img src={post.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                                <div>
                                <div className="font-bold text-gray-900 line-clamp-1 max-w-xs">{post.title}</div>
                                <div className="text-xs text-gray-500">{post.author}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">{post.category}</span></td>
                        <td className="p-4 text-gray-500 whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-center">
                            <button 
                            onClick={() => toggleBlogPostFeatured(post.id)}
                            className={`p-2 rounded-full transition ${post.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}
                            >
                                <Star size={20} fill={post.featured ? "currentColor" : "none"} />
                            </button>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 items-center h-full">
                            <button onClick={() => handleEdit(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
