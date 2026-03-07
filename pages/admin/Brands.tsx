
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Brand } from '../../types';

export const AdminBrands: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Brand>({ id: '', name: '', description: '', active: true });

  const handleEdit = (brand: Brand) => {
    setFormData({ ...brand });
    setEditingId(brand.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({ id: '', name: '', description: '', active: true });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBrand(editingId, formData);
    } else {
      addBrand({ ...formData, id: Date.now().toString() });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta marca?')) {
      deleteBrand(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="md:col-span-1">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{isEditing ? 'Editar Marca' : 'Nova Marca'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca</label>
                 <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Instrumentos</label>
                 <textarea className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 h-24 text-sm" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Guitarras, Baixos..." />
               </div>

               <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">Marca Ativa</label>
               </div>
               <div className="flex gap-2">
                 <button type="submit" className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-bold hover:bg-brand-700">Salvar</button>
                 {isEditing && <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold">Cancelar</button>}
               </div>
            </form>
         </div>
      </div>

      {/* List Section */}
      <div className="md:col-span-2">
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-gray-900">Gerenciar Marcas</h1>
           <button onClick={handleCreate} className="md:hidden bg-brand-600 text-white p-2 rounded-full"><Plus/></button>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                    <tr>
                        <th className="p-4 whitespace-nowrap">Nome</th>
                        <th className="p-4 whitespace-nowrap">Descrição</th>
                        <th className="p-4 whitespace-nowrap">Status</th>
                        <th className="p-4 text-right whitespace-nowrap">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {brands.map(brand => (
                        <tr key={brand.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900 align-top whitespace-nowrap">{brand.name}</td>
                            <td className="p-4 text-gray-500 text-xs align-top max-w-xs truncate">{brand.description}</td>
                            <td className="p-4 align-top whitespace-nowrap">
                                {brand.active ? <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">Ativa</span> : <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded-full">Inativa</span>}
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2 align-top whitespace-nowrap">
                                <button onClick={() => handleEdit(brand)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(brand.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};
