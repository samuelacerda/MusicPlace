
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FileText, Save, Eye } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const { contentPages, updateContentPage } = useAppStore();
  const [selectedPageId, setSelectedPageId] = useState(contentPages[0]?.id || '');
  const [formData, setFormData] = useState(contentPages.find(p => p.id === selectedPageId));

  const handleSelect = (id: string) => {
    setSelectedPageId(id);
    setFormData(contentPages.find(p => p.id === id));
  };

  const handleSave = () => {
    if (formData) {
        updateContentPage(formData.id, formData);
        alert('Página salva com sucesso!');
    }
  };

  if (!formData) return <div>Carregando...</div>;

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
       {/* Sidebar List */}
       <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
             Páginas do Sistema
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {contentPages.map(page => (
                <button 
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${selectedPageId === page.id ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                   <FileText size={16} />
                   {page.title}
                </button>
             ))}
          </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-900">Editar: {formData.title}</h2>
             <button onClick={handleSave} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
                <Save size={18} /> Salvar
             </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Título da Página</label>
                   <input 
                     type="text" 
                     value={formData.title} 
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                     className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                   <input 
                     type="text" 
                     value={formData.slug} 
                     readOnly
                     className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                   />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (HTML Suportado)</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">Use tags HTML básicas para formatar o texto (h1, p, b, ul, li).</p>
             </div>

             <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
                <label className="font-medium text-gray-700">Página Ativa / Visível</label>
             </div>
          </div>
       </div>
    </div>
  );
};
