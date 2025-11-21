
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, ChevronDown, ChevronUp, Layers, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, clearCategories } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    icon: 'Music',
    subcategories: [],
    active: true,
    image: ''
  });
  const [tempSubcat, setTempSubcat] = useState('');

  const handleEdit = (cat: Category) => {
    setFormData(cat);
    setEditingId(cat.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({
      id: '',
      name: '',
      icon: 'Music',
      subcategories: [],
      active: true,
      image: ''
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
       ...formData,
       id: editingId || formData.name.toLowerCase().replace(/\s+/g, '-')
    };

    if (editingId) {
      updateCategory(editingId, categoryData);
    } else {
      addCategory(categoryData);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('ATENÇÃO: Isso apagará TODAS as categorias do sistema. Você terá que adicionar novas manualmente. Continuar?')) {
      clearCategories();
    }
  };

  const addSubcategory = () => {
    if (tempSubcat.trim()) {
      setFormData({ ...formData, subcategories: [...formData.subcategories, tempSubcat.trim()] });
      setTempSubcat('');
    }
  };

  const removeSubcategory = (index: number) => {
    const newSubs = [...formData.subcategories];
    newSubs.splice(index, 1);
    setFormData({ ...formData, subcategories: newSubs });
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

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancelar</button>
        </div>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
              <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ícone (Lucide React Name)</label>
              <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="Ex: Guitar, Drum, Mic2" />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem da Categoria (Opcional)</label>
              
              {/* Dimension Guideline */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex items-start gap-3">
                   <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                   <div>
                      <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Requisito de Dimensão</h4>
                      <p className="text-sm text-blue-800">
                        A imagem deve ser <strong>retangular</strong> para exibição correta na Home.
                      </p>
                      <p className="mt-1 text-sm font-mono text-blue-900 font-bold">
                        Recomendado: 320px x 200px
                      </p>
                   </div>
                </div>
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center cursor-pointer group bg-white">
                   <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
                   <div className="flex flex-col items-center">
                      {formData.image ? (
                        <div className="relative">
                          <img src={formData.image} alt="Preview" className="w-48 h-32 object-cover rounded-lg shadow-md mb-2" />
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFormData({...formData, image: ''}) }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400 group-hover:text-brand-500 mb-2" />
                      )}
                      <span className="text-sm text-gray-500">{formData.image ? 'Clique para alterar' : 'Clique para enviar imagem (JPG, PNG, SVG)'}</span>
                   </div>
              </div>
            </div>
            
            {/* Subcategories Manager */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategorias</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900" 
                  placeholder="Nova Subcategoria"
                  value={tempSubcat}
                  onChange={e => setTempSubcat(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
                />
                <button type="button" onClick={addSubcategory} className="bg-brand-600 text-white px-4 rounded-lg font-bold">Add</button>
              </div>
              <ul className="space-y-2">
                {formData.subcategories.map((sub, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 text-sm text-gray-900">
                    {sub}
                    <button type="button" onClick={() => removeSubcategory(idx)} className="text-red-500 hover:text-red-700"><XCircle size={16}/></button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="h-5 w-5 text-brand-600 rounded bg-white border-gray-300" />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Categoria Ativa</label>
            </div>
            <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700">Salvar Categoria</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
           <p className="text-gray-500">Organize a estrutura do marketplace.</p>
        </div>
        <div className="flex gap-2">
          {categories.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-200 transition"
              title="Apagar todas as categorias"
            >
              <Trash2 size={18} /> Excluir Todas
            </button>
          )}
          <button onClick={handleCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
            <Plus size={18} /> Nova Categoria
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {categories.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma categoria cadastrada. Clique em "Nova Categoria" para começar.
          </div>
        )}
        {categories.map(cat => (
          <div key={cat.id} className="border-b border-gray-100 last:border-none">
            <div className={`flex items-center justify-between p-4 hover:bg-gray-50 ${!cat.active ? 'opacity-60' : ''}`}>
               <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}>
                 {cat.image ? (
                   <img src={cat.image} alt={cat.name} className="w-16 h-10 rounded-md object-cover border border-gray-200" />
                 ) : (
                   <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                      <Layers size={20} />
                   </div>
                 )}
                 <span className="font-bold text-gray-900">{cat.name}</span>
                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{cat.subcategories.length} subcategorias</span>
                 {!cat.active && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">Inativa</span>}
               </div>
               
               <div className="flex items-center gap-3 relative z-10">
                 <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleEdit(cat); }} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Editar"
                 >
                    <Edit2 size={18}/>
                 </button>
                 <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Excluir"
                 >
                    <Trash2 size={18}/>
                 </button>
                 <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === cat.id ? null : cat.id); }} 
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Expandir"
                 >
                    {expandedId === cat.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                 </button>
               </div>
            </div>
            
            {expandedId === cat.id && (
              <div className="bg-gray-50 p-4 pl-16 border-t border-gray-100">
                 <p className="text-xs font-bold text-gray-500 uppercase mb-2">Subcategorias</p>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                   {cat.subcategories.map((sub, idx) => (
                     <div key={idx} className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                       {sub}
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
